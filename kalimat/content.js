function censorTextNodes(nodeList) {
    for (const node of nodeList) {
      if (node.nodeType === Node.TEXT_NODE) {
        const originalText = node.textContent.trim();
        
        // Mengirim permintaan ke API Django
        fetch('http://localhost:8000/api/check_hatespeech/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: originalText }),
        })
          .then(response => response.json())
          .then(data => {
            const isHateSpeech = data.is_hatespeech;
            if (isHateSpeech) {
              const censoredText = "*".repeat(originalText.length);
              const newNode = document.createTextNode(censoredText);
              node.parentNode.replaceChild(newNode, node);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else {
        censorTextNodes(node.childNodes);
      }
    }
  }
  
  censorTextNodes(document.body.childNodes);
  