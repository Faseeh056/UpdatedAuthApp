import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
  try {
    // Check if user is admin
    const session = await locals.getSession();
    if (!session?.user || session.user.role !== 'admin') {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user statistics
    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
    const adminUsers = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, 'admin'));
    const clientUsers = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, 'client'));
    const activeUsers = await db.select({ count: sql<number>`count(*)` }).from(users).where(sql`${users.emailVerified} IS NOT NULL`);

    return json({
      totalUsers: totalUsers[0]?.count || 0,
      adminUsers: adminUsers[0]?.count || 0,
      clientUsers: clientUsers[0]?.count || 0,
      activeUsers: activeUsers[0]?.count || 0
    });
  } catch (error) {
    console.error('Failed to get stats:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
