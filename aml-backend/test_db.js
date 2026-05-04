import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env' });

console.log("Attempting to connect to MongoDB Atlas...");
console.log("URI:", process.env.MONGODB_URI ? "Found" : "Not Found");

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
})
  .then(() => { 
      console.log("✅ SUCCESS: Connected to MongoDB Atlas!"); 
      process.exit(0); 
  })
  .catch(err => { 
      console.error("❌ FAILURE:", err.message); 
      process.exit(1); 
  });
