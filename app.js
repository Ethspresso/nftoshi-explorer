const express = require('express');
const path = require('path');

// Custom modules
const helpers = require(path.join(__dirname, 'helpers'));
const data = require(path.join(__dirname, 'data'));

// Initialize Express.js app
const app = express();
const port = 8000;
app.set('view engine', 'ejs');

// Set up static files directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/random', (req, res) => {
    const tokenId = Math.floor(Math.random() * 3001)
    const payload = {
        tokenId: tokenId,
        tokenImg: helpers.imgUrl(tokenId),
        marketplaceUrl: helpers.marketplaceUrl(tokenId)
    };
    res.render('random', payload);
});

app.post('/rarity/:idx', (req, res) => {
    const tokenId = data.rankByRarity[parseInt(req.params.idx)];
    const payload = {
        tokenId: tokenId,
        tokenImg: helpers.imgUrl(tokenId),
        marketplaceUrl: helpers.marketplaceUrl(tokenId)
    };
    res.render('rarity', payload);
});

// Handle unknown routes
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
