import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// ✅ Handle GET Requests
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const questions = await db.collection("questions").find({}).toArray()
    return NextResponse.json({ success: true, data: questions }, { status: 200 })
  } catch (error) {
    console.log("Error fetching questions:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// ✅ Handle POST Requests
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { category, question, options, correctAnswerId } = body

    if (!category || !question || !options || !correctAnswerId) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const newQuestion = { category, question, options, correctAnswerId }

    const result = await db.collection("questions").insertOne(newQuestion)
    return NextResponse.json({ success: true, data: { ...newQuestion, _id: result.insertedId } }, { status: 201 })
  } catch (error) {
    console.log("Error adding question:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// ✅ Handle PUT Requests for editing questions
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, category, question, options, correctAnswerId } = body

    if (!id || !category || !question || !options || !correctAnswerId) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const updatedQuestion = {
      category,
      question,
      options,
      correctAnswerId,
    }

    const result = await db.collection("questions").updateOne({ _id: new ObjectId(id) }, { $set: updatedQuestion })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Question not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: { ...updatedQuestion, _id: id } }, { status: 200 })
  } catch (error) {
    console.log("Error updating question:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

