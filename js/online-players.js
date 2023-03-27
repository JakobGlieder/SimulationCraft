const serverDomain = 'SimulationCraft.net';
const loadingIndicator = document.querySelector('.loading');
const playerListElement = document.querySelector('.player-list');

// Function to fetch and update the player list
function updatePlayerList() {
  fetch(`https://api.mcsrvstat.us/2/${serverDomain}`)
    .then(response => response.json())
    .then(data => {
      playerListElement.innerHTML = ''; // Clear the existing list

      if (data.online) {
        data.players.list.forEach(player => {
          const listItem = document.createElement('li');
          listItem.textContent = player;
          playerListElement.appendChild(listItem);
        });
      } else {
        console.error('Server is offline');
      }

      // Hide the loading indicator
      loadingIndicator.style.display = 'none';
    })
    .catch(err => {
      console.error('Error fetching online players:', err);
      // Hide the loading indicator on error as well
      loadingIndicator.style.display = 'none';
    });
}

// Call the function immediately to fetch the initial player list
updatePlayerList();

// Set an interval to refresh the player list every 5 seconds (5000 milliseconds)
setInterval(updatePlayerList, 5000);
