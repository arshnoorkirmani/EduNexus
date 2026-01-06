import { apiClient } from "@/helper/ApiClient";
import {
  CreateMediaPayload,
  UpdateMediaPayload,
  MediaOwner,
  MediaStatus,
} from "@/types/media";
import { AppData } from "./appConfig";

/**
 * Service for handling Media operations.
 * Communicates with the /api/media endpoints.
 */
class MediaService {
  private readonly base = AppData.routes.backend.api.media;

  /**
   * Create a new media record.
   * Usually called after a file is uploaded to the provider (e.g., ImageKit).
   * The status is set to 'temporary' by default on the server if not specified.
   *
   * @param payload - The data required to create a media record.
   * @returns The created media document.
   */
  async create(payload: CreateMediaPayload) {
    return apiClient.post(this.base, payload);
  }

  /**
   * Update an existing media record.
   * Use this to finalize an upload (change status to 'uploaded') or change visibility/owner.
   *
   * @param payload - The fields to update. Must include providerFileId.
   * @returns The updated media document.
   */
  async update(payload: UpdateMediaPayload) {
    return apiClient.put(this.base, payload);
  }

  /**
   * Soft delete a media record and remove it from the storage provider.
   *
   * @param providerFileId - The unique ID from the provider (e.g. ImageKit fileId).
   * @returns Success status.
   */
  async delete(providerFileId: string) {
    return apiClient.delete(this.base, {
      providerFileId,
    });
  }

  /**
   * Replace a media file.
   * Marks the old file as 'replaced' and creates a new media record.
   *
   * @param oldProviderFileId - The file ID of the media to be replaced.
   * @param newPayload - The data for the new media record.
   * @returns The new media document.
   */
  async replace(oldProviderFileId: string, newPayload: CreateMediaPayload) {
    // 1. Mark the old media as replaced
    await this.update({
      providerFileId: oldProviderFileId,
      status: MediaStatus.REPLACED,
    });

    // 2. Create the new media record
    return this.create({
      ...newPayload,
      status: MediaStatus.UPLOADED,
    });
  }

  /**
   * Fetch media records belonging to a specific owner entity.
   *
   * @param owner - The owner details (entity type, entity ID, field name).
   * @returns A list of media documents.
   */
  async getByOwner(owner: MediaOwner) {
    return apiClient.get(this.base, {
      params: {
        entity: owner.entity,
        entityId: owner.entityId,
        field: owner.field,
      },
    });
  }

  /**
   * Fetch a single media record by its provider file ID.
   *
   * @param providerFileId - The unique provider file ID.
   * @returns The media document.
   */
  async getByFileId(providerFileId: string) {
    return apiClient.get(`${this.base}/${providerFileId}`);
  }
}

/* -------------------------------------------------------------------------- */
/* Exports                                                                    */
/* -------------------------------------------------------------------------- */

const mediaService = new MediaService();
export default mediaService;
