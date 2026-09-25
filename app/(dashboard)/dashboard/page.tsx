import { auth, clerkClient } from "@clerk/nextjs/server";
import { AnalystDashboard } from "@/components/dashboard/AnalystDashboard";
import { RMDashboard } from "@/components/dashboard/RMDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const cookieStore = await cookies();
  const clerkRole = (sessionClaims?.metadata as any)?.role;
  const cookieRole = cookieStore.get("user_role")?.value;
  
  const role = clerkRole || cookieRole;

  if (!role) {
    redirect("/role-selection");
  }

  // Auto-sync the role to Clerk's database if it's missing!
  if (cookieRole && clerkRole !== cookieRole) {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: { role: cookieRole }
      });
    } catch (error) {
      console.error("Failed to sync role to Clerk:", error);
    }
  }

  if (role === "analyst") {
    return <AnalystDashboard />;
  }

  if (role === "administrator") {
    return <AdminDashboard />;
  }

  // Default to Relationship Manager
  return <RMDashboard />;
}
