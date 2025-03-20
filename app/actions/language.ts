"use server"

import connectToDatabase from "@/lib/mongodb"
import Language from "@/models/Language"

export async function getLanguages() {
  try {
    await connectToDatabase()
    const languages = await Language.find().sort({ name: 1 })
    return { success: true, data: languages }
  } catch (error) {
    console.error("Error fetching languages:", error)
    return { success: false, error: "Failed to fetch languages" }
  }
}

export async function createLanguage(data: { name: string }) {
  try {
    await connectToDatabase()
    const language = await Language.create(data)
    return { success: true, data: language }
  } catch (error) {
    console.error("Error creating language:", error)
    return { success: false, error: "Failed to create language" }
  }
}

export async function updateLanguage(id: string, data: { name: string }) {
  try {
    await connectToDatabase()
    const language = await Language.findByIdAndUpdate(id, data, { new: true })
    return { success: true, data: language }
  } catch (error) {
    console.error("Error updating language:", error)
    return { success: false, error: "Failed to update language" }
  }
}

export async function deleteLanguage(id: string) {
  try {
    await connectToDatabase()
    await Language.findByIdAndDelete(id)
    return { success: true }
  } catch (error) {
    console.error("Error deleting language:", error)
    return { success: false, error: "Failed to delete language" }
  }
} 