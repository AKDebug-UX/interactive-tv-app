import { MongoClient, type Db } from "mongodb"

function validateMongoDBURI(uri: string): boolean {
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://")
}

const uri: string = process.env.MONGODB_URI!
if (!uri) {
  throw new Error("Missing MONGODB_URI in environment variables")
}

if (!validateMongoDBURI(uri)) {
  throw new Error("Invalid MONGODB_URI format. It should start with 'mongodb://' or 'mongodb+srv://'")
}

const dbName: string = process.env.MONGODB_DB || "EventRegistration"

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToDatabase(): Promise<{ db: Db }> {
  if (!client) {
    try {
      client = new MongoClient(uri)
      await client.connect()
      db = client.db(dbName)
      console.log(`Connected to MongoDB database: ${dbName}`)
    } catch (error) {
      console.log("Failed to connect to MongoDB:", error)
      throw error
    }
  }
  if (!db) {
    throw new Error("Database not initialized")
  }
  return { db }
}

