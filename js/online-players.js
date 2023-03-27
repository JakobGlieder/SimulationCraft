const serverDomain = 'SimulationCraft.net';

fetch(`https://api.mcsrvstat.us/2/${serverDomain}`)
  .then(response => response.json())
  .then(data => {
    if (data.online) {
      const playerList = document.querySelector('.player-list');
      data.players.list.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = player;
        playerList.appendChild(listItem);
      });
    } else {
      console.error('Server is offline');
    }
  })
  .catch(err => {
    console.error('Error fetching online players:', err);
  });
