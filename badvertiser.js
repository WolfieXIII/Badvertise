if (!window.badvertiserInjected) {
    console.log('Badvertiser script loaded');
    window.badvertiserInjected = true;
    let allLinks = [];
}

function collectLinks() {
    console.log('Starting link collection...');
    
    // Collect static links
    const staticLinks  = Array.from(document.querySelectorAll('a')).map(a => a.href);
    //console.log('Collected static links:', staticLinks);
  
    // Collect dynamic links from onclick attributes
    const elementsWithOnclick = document.querySelectorAll('[onclick]');
    const dynamicLinks = Array.from(elementsWithOnclick).map(element => {
        const onclickValue = element.getAttribute('onclick');
        //console.log("Found onclick attribute:", onclickValue);
        return onclickValue;  // Placeholder
    }).filter(link => link !== null && link !== '');
  
    //console.log('Collected dynamic links:', dynamicLinks);
  
    // Combine static and dynamic links
    const allLinks = [...new Set([...staticLinks, ...dynamicLinks])];
    console.log('Static and Dynamic collected links:', allLinks);
  
    // Send these links back to background.js
    chrome.runtime.sendMessage({ action: 'foundLinks', links:allLinks });
}

  
// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'runBadvertiserScript') {
        collectLinks();
    }
  });
