// Add an event listener to execute code when the DOM content has been loaded
window.addEventListener("DOMContentLoaded", () => {
  // Get the 'select-files' button element by its ID
  const selectFilesBtn = document.getElementById("select-files");
  // Get the 'save-file' button element by its ID
  const saveFileBtn = document.getElementById("save-file");
  // Get the 'file-list' element by its ID
  const fileList = document.getElementById("file-list");
  // Get the 'save-status' element by its ID
  const saveStatus = document.getElementById("save-status");
  // Initialize a variable to store the file content
  let fileContent = "";

  // Add an event listener to the 'select-files' button for the 'click' event
  selectFilesBtn.addEventListener("click", async () => {
    // Call the 'selectFiles' function exposed by the 'electron' object in the browser context
    const filePaths = await window.electron.selectFiles();

    // Remove the 'disabled' class from the 'save-file' button
    saveFileBtn.classList.remove("disabled");

    // Render the selected file paths as list items inside the 'file-list' element
    fileList.innerHTML = filePaths.map((path) => `<li>${path}</li>`).join("");

    // Clear the save status text and file content
    saveStatus.textContent = "";
    fileContent = "";

    // Loop through each file path
    for (let path of filePaths) {
      // Read the content of each file using the 'readFile' function exposed by the 'electron' object
      const content = await window.electron.readFile(path);
      // Append the file content to the 'fileContent' variable
      fileContent += content + "\n";
    }
  });

  // Add an event listener to the 'save-file' button for the 'click' event
  saveFileBtn.addEventListener("click", async () => {
    // Check if the 'file-list' element is empty
    if (fileList.innerHTML === "") {
      // Render a message indicating that other .txt files should be selected
      fileList.innerHTML =
        '<li class="empty-list">Select some other .txt files to combine</li>';
      return;
    }

    try {
      // Create a Blob with the combined file content as text/plain type
      const data = new Blob([fileContent], { type: "text/plain" });
      // Create a URL for the Blob object
      const url = window.URL.createObjectURL(data);

      // Create a link element to download the combined file
      const link = document.createElement("a");
      link.href = url;
      link.download = "combined.txt";
      link.click();

      // Revoke the URL object to free up resources
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Display an error message if an error occurs while saving the file
      saveStatus.textContent = "An error occurred while saving the file.";
    }

    // Render a message indicating that other .txt files should be selected
    fileList.innerHTML =
      '<li class="empty-list">FILES COMBINED SUCCESSFULLY.</li><li class="empty-list">(If required, select some other .txt files to combine)</li>';
  });

  // Add the 'disabled' class to the 'save-file' button initially
  saveFileBtn.classList.add("disabled");
});
