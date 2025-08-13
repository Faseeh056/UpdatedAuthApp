import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserParams {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  image?: string;
  role?: string;
}

export const userService = {
  /**
   * Create a new user
   */
  async createUser({ name, email, password, role = 'client' }: CreateUserParams) {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [user] = await db.insert(users).values({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
      emailVerified: new Date()
    }).returning();

    return user;
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    return await db.query.users.findFirst({
      where: eq(users.id, id)
    });
  },

  /**
   * Get user by email
   */
  async getUserByEmail(email: string) {
    return await db.query.users.findFirst({
      where: eq(users.email, email)
    });
  },

  /**
   * Update user
   */
  async updateUser({ id, name, email, password, image, role }: UpdateUserParams) {
    const updateData: Partial<typeof users.$inferInsert> = {
      updatedAt: new Date()
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (image) updateData.image = image;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (role) updateData.role = role;

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  },

  /**
   * Get all users (for admin)
   */
  async getAllUsers() {
    return await db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.createdAt)]
    });
  }
};