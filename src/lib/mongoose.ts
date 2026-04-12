import mongoose from 'mongoose'

const { MONGODB_URI } = process.env

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in environment variables.')
}

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalForMongoose = globalThis as typeof globalThis & {
  __taskmanMongoose?: MongooseCache
}

const cached = globalForMongoose.__taskmanMongoose ?? { conn: null, promise: null }

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB_NAME
      })
      .then((mongooseInstance) => mongooseInstance)
  }

  cached.conn = await cached.promise
  globalForMongoose.__taskmanMongoose = cached
  return cached.conn
}
