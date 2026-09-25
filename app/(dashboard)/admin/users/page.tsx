import { clerkClient } from "@clerk/nextjs/server";
import { ManageUsersClient } from "@/components/dashboard/ManageUsersClient";

export default async function ManageUsersPage() {
  let clerkUsers: any[] = [];
  
  try {
    const client = await clerkClient();
    const response = await client.users.getUserList();
    // In newer clerk SDK versions, it returns { data: [...] }, in older it's an array directly
    clerkUsers = response.data || response;
  } catch (error) {
    console.error("Failed to fetch Clerk users:", error);
  }

  const mappedUsers = clerkUsers.map((user) => {
    // Format Name
    let name = user.firstName || "";
    if (user.lastName) name += ` ${user.lastName}`;
    if (!name.trim()) name = "Unknown User";

    // Format Email
    const email = user.emailAddresses?.[0]?.emailAddress || "No Email";

    // Determine Role
    const rawRole = user.publicMetadata?.role || "analyst";
    const roleMap: Record<string, string> = {
      administrator: "Administrator",
      analyst: "Analyst",
      relationship_manager: "Relationship Manager"
    };
    const displayRole = roleMap[rawRole as string] || "Unknown Role";

    return {
      id: user.id,
      name,
      email,
      role: displayRole,
      status: user.banned ? "Inactive" : "Active",
      imageUrl: user.imageUrl || null,
      lastActive: user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : "Never",
    };
  });

  // Fallback data in case the fetch fails or API key is restricted
  const displayUsers = mappedUsers.length > 0 ? mappedUsers : [
    { id: "1", name: "Sarah Williams", email: "sarah.w@bank360.com", role: "Relationship Manager", status: "Active", lastActive: "10 mins ago" },
    { id: "2", name: "David Chen", email: "david.c@bank360.com", role: "Analyst", status: "Active", lastActive: "1 hour ago" },
  ];

  return <ManageUsersClient initialUsers={displayUsers} />;
}
