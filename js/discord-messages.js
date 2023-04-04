async function loadMessageData(file) {
  const response = await fetch(`discord%20messages/${file}`);
  const data = await response.json();
  return data;
}

async function fetchMessageFiles() {
  const repoOwner = 'JakobGlieder';
  const repoName = 'SimulationCraft';
  const apiResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/discord%20messages`);
  const files = await apiResponse.json();
  return files.filter((file) => file.name.endsWith('.json')).map((file) => file.name);
}

async function displayMessages() {
  const files = await fetchMessageFiles();
  const messagesDiv = document.getElementById('messages');

  for (const file of files) {
    const messageData = await loadMessageData(file);
    const button = document.createElement('button');
    button.textContent = file.replace('.json', '');
    button.onclick = () => sendMessage(messageData);
    messagesDiv.appendChild(button);
  }
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendMessage(messageDataArray) {
  const webhookUrl = document.getElementById('webhook-url').value;

  if (!webhookUrl) {
    alert('Please enter your webhook URL.');
    return;
  }

  const embeds = messageDataArray.map((messageData) => {
  const author = messageData.author || {};
  const fixedAuthor = {
    name: author.name || messageData.author,
    url: author.url || messageData.authorUrl,
    icon_url: author.icon_url || messageData.authorImageUrl,
  };

  return {
    author: fixedAuthor,
    title: messageData.title,
    description: messageData.description,
    image: {
      url: messageData.imageUrl,
    },
  };
});


  // Divide embeds into chunks of up to 10 embeds each
  const chunkSize = 10;
  const embedChunks = [];
  for (let i = 0; i < embeds.length; i += chunkSize) {
    embedChunks.push(embeds.slice(i, i + chunkSize));
  }

  const delayBetweenChunks = 500; // Delay in milliseconds
  const bufferTime = 2000; // Buffer time in milliseconds
  const estimatedTime = embedChunks.length * delayBetweenChunks + bufferTime;

  alert(`Sending messages. This will take approximately ${estimatedTime / 1000} seconds.`);

  const startTime = Date.now();

  for (const chunk of embedChunks) {
    const data = { embeds: chunk };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Message sent successfully.');
      } else {
        console.error('Error sending message:', response.statusText);
        const errorDetails = await response.json();
        console.error('Error details:', errorDetails);

        // Log problematic embed
        if (errorDetails.embeds && errorDetails.embeds.length > 0) {
          const errorIndex = parseInt(errorDetails.embeds[0], 10);
          console.error('Problematic embed:', data.embeds[errorIndex]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }

    await delay(delayBetweenChunks); // Add the delay between sending chunks
  }

  const endTime = Date.now();
  const timeTaken = (endTime - startTime) / 1000;
  const estimatedTimeInSeconds = estimatedTime / 1000;

  // Show an alert when all messages have been sent
  alert(`All messages have been sent! It took ${timeTaken.toFixed(1)} seconds (Estimated: ${estimatedTimeInSeconds.toFixed(1)} seconds).`);
}
