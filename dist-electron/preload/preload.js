"use strict";
const electron = require("electron");
const IPC_CHANNELS = {
  // Auth
  LOGIN: "auth:login",
  CHECK_AUTH: "auth:check",
  // Members
  GET_MEMBERS: "members:getAll",
  GET_MEMBER: "members:get",
  CREATE_MEMBER: "members:create",
  UPDATE_MEMBER: "members:update",
  DELETE_MEMBER: "members:delete",
  SEARCH_MEMBERS: "members:search",
  // Dashboard
  GET_STATS: "dashboard:getStats"
};
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Auth
  login: (credentials) => electron.ipcRenderer.invoke(IPC_CHANNELS.LOGIN, credentials),
  checkAuth: () => electron.ipcRenderer.invoke(IPC_CHANNELS.CHECK_AUTH),
  // Members
  getMembers: () => electron.ipcRenderer.invoke(IPC_CHANNELS.GET_MEMBERS),
  getMember: (id) => electron.ipcRenderer.invoke(IPC_CHANNELS.GET_MEMBER, id),
  createMember: (input) => electron.ipcRenderer.invoke(IPC_CHANNELS.CREATE_MEMBER, input),
  updateMember: (input) => electron.ipcRenderer.invoke(IPC_CHANNELS.UPDATE_MEMBER, input),
  deleteMember: (id) => electron.ipcRenderer.invoke(IPC_CHANNELS.DELETE_MEMBER, id),
  searchMembers: (query) => electron.ipcRenderer.invoke(IPC_CHANNELS.SEARCH_MEMBERS, query),
  // Dashboard
  getDashboardStats: () => electron.ipcRenderer.invoke(IPC_CHANNELS.GET_STATS)
});
