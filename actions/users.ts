'use server'
import { auth, clerkClient } from "@clerk/nextjs/server";
import { useSessionList } from "@clerk/nextjs";
export const getTotalUsers = async (): Promise<any> => {
    try {
      const { data } =  await (await clerkClient()).users.getUserList();
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching investments:", error);
    }
    return null;
  };

  export const getTotalLogins = async (): Promise<any> => {
    try {
      const { data } = await (await clerkClient()).sessions.getSessionList();
      return JSON.parse(JSON.stringify(data)); 
    } catch (error) {
      console.error("Error fetching logins:", error);
    }
    return null;
  };

  export const getUserSessions = async (userId: string): Promise<any> => {
    try {
      const { sessions } =  useSessionList();
      return sessions; 
    } catch (error) {
      console.error("Error fetching logins:", error);
    }
    return null;
  };

export const makeUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { userId: currentUserId } = await auth();
    
    // Check if user is authenticated
    if (!currentUserId) {
      throw new Error("Unauthorized");
    }
    
    // Verify current user is admin
    const currentUser = await (await clerkClient()).users.getUser(currentUserId);
    if (currentUser.publicMetadata?.role !== "admin") {
      throw new Error("Forbidden");
    }
    
    // Update the target user to admin
    await (await clerkClient()).users.updateUser(userId, {
      publicMetadata: { role: "admin" }
    });
    
    return true;
  } catch (error) {
    console.error("Error making user admin:", error);
    return false;
  }
};