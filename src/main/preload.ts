import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/types';
import type { 
  Member, 
  CreateMemberInput, 
  UpdateMemberInput,
  DashboardStats,
  LoginCredentials,
  Admin
} from '../shared/types';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Auth
  login: (credentials: LoginCredentials): Promise<Admin | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.LOGIN, credentials),
  
  checkAuth: (): Promise<boolean> =>
    ipcRenderer.invoke(IPC_CHANNELS.CHECK_AUTH),
  
  // Members
  getMembers: (): Promise<Member[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_MEMBERS),
  
  getMember: (id: number): Promise<Member | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_MEMBER, id),
  
  createMember: (input: CreateMemberInput): Promise<Member> =>
    ipcRenderer.invoke(IPC_CHANNELS.CREATE_MEMBER, input),
  
  updateMember: (input: UpdateMemberInput): Promise<Member> =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_MEMBER, input),
  
  deleteMember: (id: number): Promise<{ success: boolean }> =>
    ipcRenderer.invoke(IPC_CHANNELS.DELETE_MEMBER, id),
  
  searchMembers: (query: string): Promise<Member[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.SEARCH_MEMBERS, query),
  
  // Dashboard
  getDashboardStats: (): Promise<DashboardStats> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_STATS),
});

// Type declaration for TypeScript
declare global {
  interface Window {
    electronAPI: {
      login: (credentials: LoginCredentials) => Promise<Admin | null>;
      checkAuth: () => Promise<boolean>;
      getMembers: () => Promise<Member[]>;
      getMember: (id: number) => Promise<Member | null>;
      createMember: (input: CreateMemberInput) => Promise<Member>;
      updateMember: (input: UpdateMemberInput) => Promise<Member>;
      deleteMember: (id: number) => Promise<{ success: boolean }>;
      searchMembers: (query: string) => Promise<Member[]>;
      getDashboardStats: () => Promise<DashboardStats>;
    };
  }
}