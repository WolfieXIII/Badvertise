document.addEventListener('DOMContentLoaded', function() {
    const collectLinksButton = document.getElementById('collectLinks');
    collectLinksButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
              const currentTab = tabs[0];
              chrome.runtime.sendMessage({ action: 'collectLinks', tabId: currentTab.id });
              console.log('Add Collect Data Click')
            }
        });
    });

    const resetDataButton = document.getElementById('cleardata');
    resetDataButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
              const currentTab = tabs[0];
              chrome.runtime.sendMessage({ action: 'cleardata', tabId: currentTab.id });
              console.log('Add Clear Data Click')
            }
        });
    });
  });