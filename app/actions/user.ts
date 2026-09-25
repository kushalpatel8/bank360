"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(userId: string, updates: { 
  name?: string;
  role?: string; 
  status?: string; 
}) {
  try {
    const client = await clerkClient();
    
    // Update Role via metadata
    if (updates.role) {
      // Map UI display strings back to underlying role keys
      const roleMapping: Record<string, string> = {
        "Administrator": "administrator",
        "Analyst": "analyst",
        "Relationship Manager": "relationship_manager",
        // also support if they pass raw keys
        "administrator": "administrator",
        "analyst": "analyst",
        "relationship_manager": "relationship_manager"
      };
      
      const rawRole = roleMapping[updates.role] || updates.role;
      
      await client.users.updateUserMetadata(userId, {
        publicMetadata: { role: rawRole }
      });
    }

    // Handle Name update (split into first/last)
    if (updates.name) {
      const parts = updates.name.split(" ");
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ") || "";
      await client.users.updateUser(userId, { firstName, lastName });
    }

    // Handle Status (ban/unban)
    if (updates.status) {
      if (updates.status === "Inactive") {
        await client.users.banUser(userId);
      } else if (updates.status === "Active") {
        await client.users.unbanUser(userId);
      }
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return { success: false, error: "Failed to update user in database" };
  }
}
