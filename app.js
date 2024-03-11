const express = require('express');
const path = require('path');

// Custom modules
const helpers = require(path.join(__dirname, 'helpers'));
const data = require(path.join(__dirname, 'data'));

// Settings
const APP_URL = "https://nftoshi-explorer-ethspresso.koyeb.app";

// Initialize Express.js app
const app = express();
const port = 8000;
app.set('view engine', 'ejs');

// Set up static files directory
app.use(express.static(path.join(__dirname, 'public')));

// Index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Index page via POST because frames mainly use POST
app.post('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve images
app.get('/img/:fname', (req, res) => {
    res.set('Content-Type', 'image/png');
    res.sendFile(path.join(__dirname, 'public', 'img', fname));
});

// Random tokens
app.post('/random', (req, res) => {
    const tokenId = Math.floor(Math.random() * 3001)
    const payload = {
        url: APP_URL,
        tokenId: tokenId,
        tokenImg: helpers.getImgUrl(tokenId),
        marketplaceUrl: helpers.getMarketplaceUrl(tokenId)
    };
    res.render('random', payload);
});

// Most rare tokens
app.post('/rarity/:idx', (req, res) => {
    const tokenId = data.rankByRarity[parseInt(req.params.idx)];
    const payload = {
        url: APP_URL,
        tokenId: tokenId,
        tokenImg: helpers.getImgUrl(tokenId),
        marketplaceUrl: helpers.getMarketplaceUrl(tokenId),
        nextIndex: parseInt(req.params.idx) + 1,
        nextIndexDisplay: parseInt(req.params.idx) + 2  // Indices start at zero
    };
    res.render('rarity', payload);
});

// Tokens by trait (key: value)
app.post('/traits/:key/:value/:idx', (req, res) => {
    const traitKey = req.params.key;
    const traitKeyDisplay = traitKey.replace("_", " ");
    const traitKeyIndex = data.traitList.indexOf(traitKeyDisplay);
    const traitValue = req.params.value;
    const traitValueDisplay = traitValue.replace("_", " ");
    const traitValueIndex = data.traitVariants[traitKeyDisplay].indexOf(traitValueDisplay);
    const traitLookupKey = traitKeyDisplay + ": " + traitValueDisplay;
    const tokenId = data.traitToTokenIDs[traitLookupKey][req.params.idx];

    // Wrap around when we reach end of lists
    let nextTraitValueIndex = traitValueIndex + 1;
    if (nextTraitValueIndex >= data.traitVariants[traitKeyDisplay].length) {
        nextTraitValueIndex = 0;
    }
    let nextTraitKeyIndex = traitKeyIndex + 1;
    if (nextTraitKeyIndex >= data.traitList.length) {
        nextTraitKeyIndex = 0;
    }

    // Determine next item
    const nextValueDisplay = data.traitVariants[traitKeyDisplay][nextTraitValueIndex];
    const newTraitDisplay = data.traitList[nextTraitKeyIndex];
    const newTraitValueDisplay = data.traitVariants[data.traitList[nextTraitKeyIndex]][0];

    const payload = {
        url: APP_URL,
        tokenId: tokenId,
        tokenImg: helpers.getImgUrl(tokenId),
        marketplaceUrl: helpers.getMarketplaceUrl(tokenId),
        traitKey: traitKey,
        traitKeyDisplay: traitKeyDisplay,
        traitValue: traitValue,
        traitValueDisplay: traitValueDisplay,
        nextIndex: parseInt(req.params.idx) + 1,
        nextIndexDisplay: parseInt(req.params.idx) + 2,  // Indices start at zero
        nextValue: nextValueDisplay.replace(" ", "_"), // Next value for same trait
        nextValueDisplay: nextValueDisplay,
        newTrait: newTraitDisplay.replace(" ", "_"), // New trait to explore
        newTraitDisplay: newTraitDisplay,
        newTraitValue: newTraitValueDisplay.replace(" ", "_"), // Value for new trait
        newTraitValueDisplay: newTraitValueDisplay
    };
    res.render('traits', payload);
});

// Handle unknown routes
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
