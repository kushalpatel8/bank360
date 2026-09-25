import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';

export { auth, currentUser, clerkClient };

export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

export async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
}

export async function getUserDetails() {
  const user = await currentUser();
  return user;
}
