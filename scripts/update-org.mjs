import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const orgSchema = new mongoose.Schema({
  name: String,
  tagline: String,
  description: String,
  logoUrl: String,
  contactEmail: String,
  contactPhone: String,
  address: String,
  facebookUrl: String,
  twitterUrl: String,
  instagramUrl: String,
  updatedAt: Date,
});

const Organization = mongoose.models.Organization || mongoose.model("Organization", orgSchema);

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    let org = await Organization.findOne();
    if (!org) {
      org = new Organization({});
    }

    org.name = "Rdef-Focas";
    org.address = "M.B.M Building\nKKS Road\nMavittapuram\nTellipalai";
    org.updatedAt = new Date();

    await org.save();
    console.log("Organization updated successfully!");
    console.log(org);
  } catch (error) {
    console.error("Error updating organization:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

main();
