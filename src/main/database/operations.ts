import { getPrismaClient } from './client';
import bcrypt from 'bcryptjs';

// Types
interface LoginCredentials {
  username: string;
  password: string;
}

interface CreateMemberInput {
  name: string;
  email?: string;
  phone: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  membershipType: string;
  membershipStartDate: Date;
  membershipEndDate: Date;
  amount: number;
  photo?: string;
}

interface UpdateMemberInput {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  membershipType?: string;
  membershipStartDate?: Date;
  membershipEndDate?: Date;
  amount?: number;
  status?: string;
  photo?: string;
}

// Initialize default admin
export async function initializeAdmin() {
  const prisma = getPrismaClient();
  
  try {
    const adminExists = await prisma.admin.findFirst({
      where: { username: 'admin' }
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.admin.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          name: 'Administrator'
        }
      });
      console.log('Default admin created');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
}

// Admin login
export async function loginAdmin(credentials: LoginCredentials) {
  const prisma = getPrismaClient();
  
  try {
    const admin = await prisma.admin.findUnique({
      where: { username: credentials.username }
    });

    if (!admin) {
      return null;
    }

    const isValid = await bcrypt.compare(credentials.password, admin.password);
    
    if (!isValid) {
      return null;
    }

    return {
      id: admin.id,
      username: admin.username,
      name: admin.name
    };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

// Get all members
export async function getAllMembers() {
  const prisma = getPrismaClient();
  
  return await prisma.member.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

// Get member by ID
export async function getMemberById(id: number) {
  const prisma = getPrismaClient();
  
  return await prisma.member.findUnique({
    where: { id }
  });
}

// Create member
export async function createMember(input: CreateMemberInput) {
  const prisma = getPrismaClient();
  
  return await prisma.member.create({
    data: {
      ...input,
      status: 'active'
    }
  });
}

// Update member
export async function updateMember(input: UpdateMemberInput) {
  const prisma = getPrismaClient();
  const { id, ...data } = input;
  
  return await prisma.member.update({
    where: { id },
    data
  });
}

// Delete member
export async function deleteMember(id: number) {
  const prisma = getPrismaClient();
  
  return await prisma.member.delete({
    where: { id }
  });
}

// Search members
export async function searchMembers(query: string) {
  const prisma = getPrismaClient();
  
  // SQLite doesn't support case-insensitive mode, so we'll search as-is
  // For case-insensitive search in SQLite, you'd need to use raw queries
  return await prisma.member.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { email: { contains: query } },
        { phone: { contains: query } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });
}

// Get dashboard stats
export async function getDashboardStats() {
  const prisma = getPrismaClient();
  
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const [
    totalMembers,
    activeMembers,
    expiringMembers,
    monthlyRevenue,
    recentMembers
  ] = await Promise.all([
    // Total members
    prisma.member.count(),
    
    // Active members
    prisma.member.count({
      where: {
        status: 'active',
        membershipEndDate: {
          gte: now
        }
      }
    }),
    
    // Expiring in 7 days
    prisma.member.count({
      where: {
        status: 'active',
        membershipEndDate: {
          gte: now,
          lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    
    // Monthly revenue
    prisma.member.aggregate({
      where: {
        membershipStartDate: {
          gte: startOfMonth
        }
      },
      _sum: {
        amount: true
      }
    }),
    
    // Recent members
    prisma.member.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        phone: true,
        membershipType: true,
        membershipEndDate: true,
        status: true,
        createdAt: true
      }
    })
  ]);
  
  return {
    totalMembers,
    activeMembers,
    expiringMembers,
    monthlyRevenue: monthlyRevenue._sum.amount || 0,
    recentMembers
  };
}