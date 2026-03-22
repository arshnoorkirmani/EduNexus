import dbConnect from "@/lib/DatabaseConnection";
import { Media } from "@/models/MediaSchema";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export const cleanupOrphanMedia = async (olderThanHours: number = 24) => {
  await dbConnect();

  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - olderThanHours);

  // Fetch orphan media: status is "temporary" OR no real parent entity ("draft"), older than X hours
  // Also, files that are soft deleted can be safely purged if they've been deleted for some time.
  const orphans = await Media.find({
    $or: [
      { status: "temporary" },
      { "owner.entityId": "draft" },
      // Uncomment below if you want to aggressively clean up soft-deleted files too
      // { deletedAt: { $ne: null } }
    ],
    createdAt: { $lt: cutoffDate },
  });

  const uniqueFolders = new Set<string>();
  let deletedFilesCount = 0;
  let skippedFilesCount = 0;
  let deletedFoldersCount = 0;
  let failedFoldersCount = 0;
  let dbDeletedCount = 0;

  for (const media of orphans) {
    let fileFolderPath = "";

    try {
      // Get file details to get its directory path BEFORE deleting it
      try {
        const fileDetails = await imagekit.getFileDetails(media.providerFileId);
        if (fileDetails && fileDetails.filePath) {
          // Extracts everything before the last slash
          const splitPath = fileDetails.filePath.split("/");
          splitPath.pop();
          fileFolderPath = splitPath.join("/");
          if (fileFolderPath) {
            uniqueFolders.add(fileFolderPath);
          }
        }
      } catch (err: any) {
        console.warn(`Could not fetch details for ImageKit file ${media.providerFileId}. Assuming it may already be deleted.`, err.message || err);
      }

      // Delete from ImageKit
      await imagekit.deleteFile(media.providerFileId);
      deletedFilesCount++;

      // Delete corresponding media record from MongoDB
      await Media.deleteOne({ _id: media._id });
      dbDeletedCount++;

    } catch (error: any) {
      if (error.message && error.message.includes("404")) {
        // If file not found in ImageKit, it's safe to just clean the DB
        console.log(`File not found in ImageKit (FileID: ${media.providerFileId}), removing DB record only.`);
        await Media.deleteOne({ _id: media._id });
        dbDeletedCount++;
        skippedFilesCount++;
      } else {
        console.error(`Failed to delete orphan file (FileID: ${media.providerFileId}):`, error.message || error);
        skippedFilesCount++;
      }
    }
  }

  // Cleanup Empty Folders
  for (const folder of Array.from(uniqueFolders)) {
    try {
      if (folder === "/" || folder === "") continue; // Never delete root

      // Check if folder is actually empty
      const remainingFiles = await imagekit.listFiles({
        path: folder,
        limit: 1, // Any file means it's not empty
      });

      if (!remainingFiles || remainingFiles.length === 0) {
        await imagekit.deleteFolder(folder);
        deletedFoldersCount++;
        console.log(`Deleted empty ImageKit folder: ${folder}`);
      }
    } catch (folderError: any) {
      console.warn(`Failed to process or delete folder ${folder}:`, folderError.message || folderError);
      failedFoldersCount++;
    }
  }

  return {
    deletedFilesCount,
    skippedFilesCount,
    dbDeletedCount,
    deletedFoldersCount,
    failedFoldersCount,
  };
};
