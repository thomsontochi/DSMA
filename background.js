// background.js
chrome.runtime.onInstalled.addListener(() => {
    // Create context menu items
    chrome.contextMenus.create({
      id: "smartResearch",
      title: "Smart Research",
      contexts: ["selection"]
    });
  
    chrome.contextMenus.create({
      id: "summarize",
      parentId: "smartResearch",
      title: "Summarize",
      contexts: ["selection"]
    });
  
    chrome.contextMenus.create({
      id: "translate",
      parentId: "smartResearch",
      title: "Translate",
      contexts: ["selection"]
    });
  
    chrome.contextMenus.create({
      id: "simplify",
      parentId: "smartResearch",
      title: "Simplify",
      contexts: ["selection"]
    });
  
    chrome.contextMenus.create({
      id: "notes",
      parentId: "smartResearch",
      title: "Generate Notes",
      contexts: ["selection"]
    });
  });