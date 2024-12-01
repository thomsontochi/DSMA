// content.js
let selectedText = '';

document.addEventListener('mouseup', () => {
  selectedText = window.getSelection().toString().trim();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelection") {
    sendResponse({text: selectedText});
  }
});