import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    const { userId: adminId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Make API request to Clerk Backend API
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: { role: 'admin' },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user role in Clerk');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}