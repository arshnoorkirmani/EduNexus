const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

async function connect() {
  const MONGO_BASE = process.env.MONGODB_URL;
  const targetDb = process.env.DATABASE_NAME;
  
  console.log("URL:", MONGO_BASE);
  console.log("DB:", targetDb);

  try {
    const urlObj = new URL(MONGO_BASE);
    urlObj.pathname = `/${targetDb}`;
    
    if (!urlObj.searchParams.has("retryWrites")) {
      urlObj.searchParams.set("retryWrites", "true");
    }
    if (!urlObj.searchParams.has("w")) {
      urlObj.searchParams.set("w", "majority");
    }
    
    const uri = urlObj.toString();
    console.log("Final URI:", uri);
    
    const db = await mongoose.connect(uri);
    console.log("Connected to", db.connection.name);
    process.exit(0);
  } catch(e) {
    console.error("Connection Error:", e);
    process.exit(1);
  }
}

connect();
