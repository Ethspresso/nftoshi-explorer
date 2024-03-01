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
    const trait_key = req.params.key.replace("_", " ");
    const trait_key_idx = data.traitList.indexOf(trait_key);
    const trait_value = req.params.value.replace("_", " ");
    const trait_value_idx = data.traitVariants[trait_key].indexOf(trait_value);
    const trait_lookupkey = trait_key + ": " + trait_value;

    const tokenId = data.traitToTokenIDs[trait_lookupkey][req.params.idx];
    const payload = {
        url: APP_URL,
        tokenId: tokenId,
        tokenImg: helpers.getImgUrl(tokenId),
        marketplaceUrl: helpers.getMarketplaceUrl(tokenId),
        currentTrait: trait_key,
        currentValue: trait_value,
        nextIndex: parseInt(req.params.idx) + 1,
        nextIndexDisplay: parseInt(req.params.idx) + 2,  // Indices start at zero
        nextValue: data.traitVariants[trait_key][trait_value_idx + 1].replace(" ", "_"), // Next value for same trait
        newTrait: data.traitList[trait_key_idx + 1].replace(" ", "_"), // New trait to explore
        newTraitValue: data.traitVariants[data.traitList[trait_key_idx + 1]][0].replace(" ", "_") // Value for new trait
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
