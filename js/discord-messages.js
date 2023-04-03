async function sendMessage(messageDataArray) {
  const webhookUrl = document.getElementById('webhook-url').value;

  if (!webhookUrl) {
    alert('Please enter your webhook URL.');
    return;
  }

  const chunks = [];
  for (let i = 0; i < messageDataArray.length; i += 10) {
    chunks.push(messageDataArray.slice(i, i + 10));
  }

  for (const chunk of chunks) {
    const embeds = chunk.map((messageData) => {
      return {
        author: {
          name: messageData.author,
          url: messageData.authorUrl,
          icon_url: messageData.authorImageUrl,
        },
        title: messageData.title,
        description: messageData.description,
        image: {
          url: messageData.imageUrl,
        },
      };
    });

    const data = { embeds };

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
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
