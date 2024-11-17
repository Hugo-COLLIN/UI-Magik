chrome.action.onClicked.addListener(async (tab) => {
  console.info("Icon clicked")

  await chrome.scripting.executeScript({
    target: {tabId: tab.id || 0},
    files: ['css-picker/picker.js']
  });
});
