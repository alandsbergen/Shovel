console.log("content.js");

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    // First, validate the message's structure.
    if ((msg.from === 'popup') && (msg.subject === 'text')) {
      // Collect the necessary data. 
      // (For your specific requirements `document.querySelectorAll(...)`
      //  should be equivalent to jquery's `$(...)`.)
      let selectedText = window.getSelection().toString().trim();
      var message = {
            text: selectedText
        }
  
      // Directly respond to the sender (popup), 
      // through the specified callback.
      response(message);
    }
  });