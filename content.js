// Run whenever a page loads 
console.log('Badvertiser page script running');
let allLinks = [];

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            const newLinks = Array.from(mutation.target.querySelectorAll('a')).map(a => a.href);
            allLinks = [...new Set([...allLinks, ...newLinks])];  // Remove duplicates
        }
    });
    //console.log("Mutation Links: ", allLinks)
    // Send these links back to background.js
    chrome.runtime.sendMessage({ action: 'foundLinks', links:allLinks });
});

// Initialize the observer to watch the entire document
observer.observe(document, { childList: true, subtree: true });


// Listen for debug messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'DEBUGOUTPUT') {
        console.log("BADMAN:", message.text, message.data)
    }
  });