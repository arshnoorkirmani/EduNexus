import mongoose from "mongoose";

export type ConnectionObject = {
  isConnected: number;
  dbName: string;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: ConnectionObject;
  mongoosePromise?: Promise<typeof mongoose> | null;
};

export default async function dbConnect(
  databaseName?: string
): Promise<ConnectionObject> {
  const MONGO_BASE = process.env.MONGODB_URL;
  const DEFAULT_DB = process.env.DATABASE_NAME;

  if (!MONGO_BASE) {
    throw new Error("❌ MONGODB_URL missing in .env");
  }

  const targetDb = databaseName || DEFAULT_DB;

  // If a connection is currently being established, wait for it
  if (globalWithMongoose.mongoosePromise) {
    try {
      await globalWithMongoose.mongoosePromise;
    } catch (e) {
      // If the pending connection failed, clearing promise will be handled below or already handled
      globalWithMongoose.mongoosePromise = null;
    }
  }

  // Reuse connection if DB is same
  if (
    mongoose.connection.readyState === 1 &&
    mongoose.connection.name === targetDb
  ) {
    console.log(`🔁 Reusing cached connection: ${targetDb}`);
    return {
      isConnected: mongoose.connection.readyState,
      dbName: mongoose.connection.name,
    };
  }

  // If connected to a different DB, disconnect first to allow switching
  if (mongoose.connection.readyState !== 0) {
    console.log(
      `Switching database: ${mongoose.connection.name} ➡ ${targetDb}`
    );
    await mongoose.disconnect();
  }

  let connectionUri = MONGO_BASE.replace(/\/+$/, "");

  // If MongoDB URL does not have a DB name, append one
  const path = new URL(MONGO_BASE).pathname.replace(/^\//, "");
  if (!path) {
    connectionUri += `/${targetDb}`;
  }

  // Add parameters if not present
  if (!connectionUri.includes("?")) {
    connectionUri += "?retryWrites=true&w=majority";
  }

  try {
    // Store the promise globally so parallel requests wait
    globalWithMongoose.mongoosePromise = mongoose.connect(connectionUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 6000,
    });

    const db = await globalWithMongoose.mongoosePromise;

    console.log(`✅ Connected to MongoDB: ${db.connection.name}`);

    const connection: ConnectionObject = {
      isConnected: db.connection.readyState,
      dbName: db.connection.name,
    };

    // Cache new connection
    globalWithMongoose.mongooseConnection = connection;

    return connection;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    globalWithMongoose.mongoosePromise = null;
    throw new Error("Database connection failed");
  }
}
