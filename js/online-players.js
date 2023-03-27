const serverDomain = 'SimulationCraft.net';
const ping = new MCPing(serverDomain, 25565);

ping.ping((err, response) => {
    if (err) {
        console.error('Error fetching server data:', err);
    } else {
        const playerList = document.querySelector('.player-list');

        response.players.sample.forEach(player => {
            const listItem = document.createElement('li');
            listItem.textContent = player.name;
            playerList.appendChild(listItem);
        });
    }
});
