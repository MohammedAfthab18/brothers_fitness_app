// Shared types between main and renderer processes

export type PlanType = '1day' | '1week' | '1month' | '3months' | '6months' | '1year';

export interface Member {
  id: number;
  name: string;
  age: number;
  address: string;
  dob: Date;
  plan: PlanType;
  trainee: boolean;
  joinDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemberInput {
  name: string;
  age: number;
  address: string;
  dob: Date;
  plan: PlanType;
  trainee: boolean;
  joinDate: Date;
}

export interface UpdateMemberInput extends Partial<CreateMemberInput> {
  id: number;
}

export interface DashboardStats {
  totalMembers: number;
  activeTrainers: number;
  expiringSoon: number;
}

export interface Admin {
  id: number;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// IPC Channel names
export const IPC_CHANNELS = {
  // Auth
  LOGIN: 'auth:login',
  LOGOUT: 'auth:logout',
  CHECK_AUTH: 'auth:check',
  
  // Members
  GET_MEMBERS: 'members:getAll',
  GET_MEMBER: 'members:get',
  CREATE_MEMBER: 'members:create',
  UPDATE_MEMBER: 'members:update',
  DELETE_MEMBER: 'members:delete',
  SEARCH_MEMBERS: 'members:search',
  
  // Dashboard
  GET_STATS: 'dashboard:getStats',
} as const;