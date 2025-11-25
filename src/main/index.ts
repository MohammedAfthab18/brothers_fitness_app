import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { getPrismaClient, disconnectPrisma } from './database/client';
import * as db from './database/operations';
import { IPC_CHANNELS } from '../shared/types';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#F5F5F7',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(async () => {
  // Initialize database
  getPrismaClient();
  await db.initializeAdmin();
  
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', async () => {
  await disconnectPrisma();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  await disconnectPrisma();
});

// ============ IPC Handlers ============

// Auth
ipcMain.handle(IPC_CHANNELS.LOGIN, async (_, credentials) => {
  try {
    return await db.loginAdmin(credentials);
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
});

ipcMain.handle(IPC_CHANNELS.CHECK_AUTH, async () => {
  // In a real app, you'd check session tokens
  return true;
});

// Members
ipcMain.handle(IPC_CHANNELS.GET_MEMBERS, async () => {
  try {
    return await db.getAllMembers();
  } catch (error) {
    console.error('Get members error:', error);
    throw error;
  }
});

ipcMain.handle(IPC_CHANNELS.GET_MEMBER, async (_, id: number) => {
  try {
    return await db.getMemberById(id);
  } catch (error) {
    console.error('Get member error:', error);
    throw error;
  }
});

ipcMain.handle(IPC_CHANNELS.CREATE_MEMBER, async (_, input) => {
  try {
    return await db.createMember(input);
  } catch (error) {
    console.error('Create member error:', error);
    throw error;
  }
});

ipcMain.handle(IPC_CHANNELS.UPDATE_MEMBER, async (_, input) => {
  try {
    return await db.updateMember(input);
  } catch (error) {
    console.error('Update member error:', error);
    throw error;
  }
});

ipcMain.handle(IPC_CHANNELS.DELETE_MEMBER, async (_, id: number) => {
  try {
    await db.deleteMember(id);
    return { success: true };
  } catch (error) {
    console.error('Delete member error:', error);
    throw error;
  }
});

ipcMain.handle(IPC_CHANNELS.SEARCH_MEMBERS, async (_, query: string) => {
  try {
    return await db.searchMembers(query);
  } catch (error) {
    console.error('Search members error:', error);
    throw error;
  }
});

// Dashboard
ipcMain.handle(IPC_CHANNELS.GET_STATS, async () => {
  try {
    return await db.getDashboardStats();
  } catch (error) {
    console.error('Get stats error:', error);
    throw error;
  }
});