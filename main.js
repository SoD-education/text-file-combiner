// Import necessary modules from Electron
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
// Import the 'path' module for working with file paths
const path = require("path");
// Import the 'fs' module for file system operations
const fs = require("fs");

// Function to create the main window
function createWindow() {
  // Create a new browser window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // Set the web preferences for the Electron window
    webPreferences: {
      // Load a JavaScript file before the page is loaded
      preload: path.join(__dirname, "preload.js"),
      // Enable context isolation for better security
      contextIsolation: true,
      // Disable the remote module to prevent remote code execution
      enableRemoteModule: false,
    },
  });

  // Load the HTML file into the main window
  mainWindow.loadFile("index.html");
}

// Wait for the app to be ready, then create the main window
app.whenReady().then(() => {
  createWindow();

  // Event handler when the app is activated (e.g., clicking on the app's icon)
  app.on("activate", function () {
    // Create a new window if no windows are currently open
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Event handler when all windows are closed
app.on("window-all-closed", function () {
  // Quit the app if the platform is not macOS
  if (process.platform !== "darwin") app.quit();
});

// Handle the "select-files" IPC (Inter-Process Communication) request
ipcMain.handle("select-files", async () => {
  // Show a dialog to select multiple text files
  const { filePaths } = await dialog.showOpenDialog({
    // Set the properties for the file dialog, allowing the user to select and
    //   open multiple text files with a .txt extension.
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Text Files", extensions: ["txt"] }],
  });
  // Return the selected file paths
  return filePaths;
});

// Handle the "combine-files" IPC request
ipcMain.handle("combine-files", async (event, paths) => {
  let content = "";
  // Loop through each file path
  for (let path of paths) {
    // Read the content of each file and append it to the 'content' variable
    content += fs.readFileSync(path, "utf8") + "\n";
  }
  // Return the combined content of all files
  return content;
});
