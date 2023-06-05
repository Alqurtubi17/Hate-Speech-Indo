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
            const isHateSpeech = data.is_hate_speech;
            const censoredText = isHateSpeech ? censorWords(originalText) : originalText;
            const newNode = document.createTextNode(censoredText);
            node.parentNode.replaceChild(newNode, node);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else {
        censorTextNodes(node.childNodes);
      }
    }
  }
  
  function censorWords(text) {
    // Mengirim permintaan ke API Django untuk mendapatkan kata-kata yang harus disensor
    return fetch('http://localhost:8000/api/get_censor_words/')
      .then(response => response.json())
      .then(data => {
        const wordsToCensor = data.words_to_censor;
        let censoredText = text;
  
        for (const word of wordsToCensor) {
          const regex = new RegExp(`\\b${word}\\b`, "gi");
          censoredText = censoredText.replace(regex, "*".repeat(word.length));
        }
  
        return censoredText;
      })
      .catch(error => {
        console.error('Error:', error);
        return text;
      });
  }
  
  censorTextNodes(document.body.childNodes);
  