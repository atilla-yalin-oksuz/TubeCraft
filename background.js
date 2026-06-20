chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // Open the welcome page in a new tab when the extension is installed for the first time
    chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") });
  }
});
