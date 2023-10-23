// Import necessary modules from Electron
const { contextBridge, ipcRenderer } = require("electron");

// Expose Electron functionality to the main world (browser context)
contextBridge.exposeInMainWorld("electron", {
  // Function to select files and invoke the "select-files" IPC request
  selectFiles: () => ipcRenderer.invoke("select-files"),
  // Function to combine files and invoke the "combine-files" IPC request with the provided paths
  combineFiles: (paths) => ipcRenderer.invoke("combine-files", paths),
});
