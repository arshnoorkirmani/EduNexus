import mongoose from "mongoose";

export type ConnectionObject = {
  isConnected: number;
  dbName: string;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongoosePromise?: Promise<typeof mongoose> | null;
};

export default async function dbConnect(
  databaseName?: string
): Promise<ConnectionObject> {
  const isLocal = process.env.NODE_ENV !== "production";
  const MONGO_BASE = isLocal ? process.env.MONGODB_URL_Local : process.env.MONGODB_URL;
  const DEFAULT_DB = process.env.DATABASE_NAME;
  console.log("MONGO_BASE", MONGO_BASE);
  console.log("DEFAULT_DB", DEFAULT_DB);
  if (!MONGO_BASE) {
    throw new Error(`❌ ${isLocal ? "MONGODB_URL_Local" : "MONGODB_URL"} missing in .env`);
  }

  const targetDb = databaseName || DEFAULT_DB;

  if (!targetDb) {
    throw new Error("❌ DATABASE_NAME missing and no databaseName provided");
  }
  console.log("targetDb", targetDb);
  // 1. If a connection is already established and matches the target DB, reuse it immediately.
  if (
    mongoose.connection.readyState === 1 &&
    mongoose.connection.name === targetDb
  ) {
    return {
      isConnected: mongoose.connection.readyState,
      dbName: mongoose.connection.name,
    };
  }

  // 2. If a connection is currently pending (promise exists), wait for it to resolve.
  if (globalWithMongoose.mongoosePromise) {
    try {
      const db = await globalWithMongoose.mongoosePromise;
      // After waiting, check if the resolved connection matches our target.
      if (db.connection.name === targetDb) {
        console.log(`🔁 Reused pending connection for: ${targetDb}`);
        return {
          isConnected: db.connection.readyState,
          dbName: db.connection.name,
        };
      }
    } catch (e) {
      // If the pending connection failed, we'll try to create a new one below.
      globalWithMongoose.mongoosePromise = null;
    }
  }

  // 3. If we are here, we either:
  //    a) Have no connection.
  //    b) Have a connection to the WRONG database.
  //    c) Had a pending connection that resolved to the WRONG database.

  // If connected to a different DB, disconnect first to allow switching
  if (mongoose.connection.readyState !== 0) {
    console.log(
      `Switching database: ${mongoose.connection.name} ➡ ${targetDb}`
    );
    await mongoose.disconnect();
  }

  // Construct the correct connection URI for the target database
  let connectionUri: string;

  if (process.env.NODE_ENV !== "production") {
    // In local environment, the URL has multiple hosts which URL object might not parse correctly.
    // Insert the database name just before the query parameters.
    if (MONGO_BASE.includes("/?")) {
      connectionUri = MONGO_BASE.replace("/?", `/${targetDb}?`);
    } else if (MONGO_BASE.endsWith("/")) {
      connectionUri = `${MONGO_BASE}${targetDb}`;
    } else {
      connectionUri = `${MONGO_BASE}/${targetDb}`;
    }
  } else {
    // We use the URL object to safely replace the database name (pathname) in production
    const urlObj = new URL(MONGO_BASE);
    urlObj.pathname = `/${targetDb}`;

    // Add parameters using searchParams to avoid duplication
    if (!urlObj.searchParams.has("retryWrites")) {
      urlObj.searchParams.set("retryWrites", "true");
    }
    if (!urlObj.searchParams.has("w")) {
      urlObj.searchParams.set("w", "majority");
    }
    if (!urlObj.searchParams.has("family")) {
      urlObj.searchParams.set("family", "4");
    }

    connectionUri = urlObj.toString();
  }
  console.log("connectionUri", connectionUri);
  try {
    // Store the promise globally so parallel requests wait
    globalWithMongoose.mongoosePromise = mongoose.connect(connectionUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      family: 4, // Force IPv4 to avoid stuck SRV lookups on some networks
    });

    const db = await globalWithMongoose.mongoosePromise;

    console.log(`✅ Connected to MongoDB: ${db.connection.name}`);

    return {
      isConnected: db.connection.readyState,
      dbName: db.connection.name,
    };
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    globalWithMongoose.mongoosePromise = null;
    throw new Error("Database connection failed");
  }
}