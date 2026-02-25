import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const modelsPath = path.join(__dirname, '..', 'models')
console.log('Looking for models in:', modelsPath)

async function initializeDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB')

        const modelFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith('.js'))

        if (modelFiles.length === 0) {
            console.log('No model files found in models/ folder')
            return
        }

        for (const file of modelFiles) {
            await import(`file://${path.join(modelsPath, file)}`)
        }

        const registeredModels = mongoose.modelNames()
        const expectedCollections = registeredModels.map(name =>
            mongoose.model(name).collection.collectionName
        )

        const existing = await mongoose.connection.db.listCollections().toArray()
        const existingNames = existing.map(c => c.name)

        const found = expectedCollections.filter(name => existingNames.includes(name))
        const missing = expectedCollections.filter(name => !existingNames.includes(name))

        if (found.length === expectedCollections.length) {
            console.log(`Found all ${found.length} collections: ${found.join(', ')}`)
        } else {
            if (found.length > 0) {
                console.log(`Found collections: ${found.join(', ')}`)
            }

            console.log(`Missing collections: ${missing.join(', ')} — attempting to create...`)

            for (const name of missing) {
                try {
                    await mongoose.connection.db.createCollection(name)
                    console.log(`Created collection: ${name}`)
                } catch (err) {
                    console.log(`Failed to create collection: ${name} —`, err.message)
                }
            }
        }
    } catch (error) {
        console.log('MongoDB connection error:', error.message)
    }
}

export default initializeDatabase