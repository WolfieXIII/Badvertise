let injectedTabs = [];
let pageLinks = new Set();
let allSeenLinks = new Set();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
        allSeenLinks = new Set([...allSeenLinks, ...pageLinks]); //Keep a seperate accounting of all seen links
        pageLinks = new Set();          // Reset on reload
        const index = injectedTabs.indexOf(tabId);
        if (index > -1) {
            injectedTabs.splice(index, 1);  // Remove tabId from injectedTabs
        }
    }
  });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log("Action:", message.action)

    if (message.action === 'cleardata') {
        const tabId = message.tabId;
        pageLinks = new Set();
        allSeenLinks = new Set();
        chrome.tabs.sendMessage(tabId, { action: 'DEBUGOUTPUT', data: undefined, text: "data reset" });
    }

    if (message.action === 'collectLinks') {
      const tabId = message.tabId;
      if (!injectedTabs.includes(tabId)) {
        console.log('Injecting Badvertiser script into tab:', tabId);
        chrome.scripting.executeScript({
            target: { tabId },
            files: ['badvertiser.js']
        }, () => {
            console.log('Badvertiser script injected. Sending message to runBadvertiserScript.');
            chrome.tabs.sendMessage(tabId, { action: 'runBadvertiserScript' });         
        });

        // Mark this tab as injected
        injectedTabs.push(tabId);
      } else {
        chrome.tabs.sendMessage(tabId, { action: 'runBadvertiserScript' });
      }

      chrome.tabs.query({active: true}, (tabs) => {
        console.log('Active Tabs: ', tabs);
        //Do something with active tabs list
      });
    }

    if (message.action === 'foundLinks') {
        const links = message.links;
    
        // Add each link to the Set. This ensures uniqueness.
        links.forEach(link => pageLinks.add(link));
        
        chrome.windows.getLastFocused({populate: true}, (window) => {
            //console.log('Last focused window: ', window);
            const activeTab = window.tabs.find(tab => tab.active);
            //console.log('Active tab in last focused window: ', activeTab);
            if (activeTab) {
                // Do something with the active tab
                chrome.tabs.sendMessage(activeTab.id, { action: 'DEBUGOUTPUT', data: Array.from(pageLinks), text: "All Page Links:" });
                chrome.tabs.sendMessage(activeTab.id, { action: 'DEBUGOUTPUT', data: Array.from(allSeenLinks), text: "All Seen Links:" });
            }
          });
        
        //console.log('All page links are: ', Array.from(pageLinks));
        //console.log('All seen links are: ', Array.from(allSeenLinks));
      }
  });