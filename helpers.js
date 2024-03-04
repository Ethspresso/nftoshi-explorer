const APP_URL = "https://nftoshi-explorer-ethspresso.koyeb.app";

const MARKETPLACE_URL = "https://opensea.io/assets";
const IPFS_PROVIDER_URL = "https://cloudflare-ipfs.com/ipfs";

const COLLECTION_NETWORK = "base";
const COLLECTION_CONTRACT = "0xbdb1a8772409a0c5eeb347060cbf4b41dd7b2c62";
const IPFS_IMAGE_HASH = "bafybeicgkb56vydl3kkcrgox7dpyatrgafxogurp42opjmiocfnwmbftlm";
const IMAGE_FILETYPE = ".png";

function getImgUrl(token_id) {
  return APP_URL + "/img/" + token_id + IMAGE_FILETYPE;
};

function getMarketplaceUrl(token_id) {
  return MARKETPLACE_URL + "/" + COLLECTION_NETWORK + "/" + COLLECTION_CONTRACT + "/" + token_id;
};

module.exports = {
    getImgUrl: getImgUrl,
    getMarketplaceUrl: getMarketplaceUrl
};
