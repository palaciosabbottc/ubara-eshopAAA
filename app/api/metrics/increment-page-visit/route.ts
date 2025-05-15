import { NextResponse } from "next/server"
import { incrementPageVisits } from "@/lib/metrics-supabase"

export async function POST() {
  try {
    await incrementPageVisits()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error incrementing page visit:', error)
    return NextResponse.json({ error: 'Failed to increment page visit' }, { status: 500 })
  }
} 