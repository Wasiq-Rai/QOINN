import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    // Check if user is authenticated and admin
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Verify admin status (you can use your isUserAdmin function here)
    const currentUser = await (await clerkClient()).users.getUser(userId);
    if (currentUser.publicMetadata?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Fetch all users
    const { data } = await (await clerkClient()).users.getUserList();
    
    // Map users to simpler format with admin status
    const formattedUsers = data.map(user => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      lastSignInAt: user.lastSignInAt,
      createdAt: user.createdAt,
      isAdmin: user.publicMetadata?.role === "admin"
    }));
    
    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}