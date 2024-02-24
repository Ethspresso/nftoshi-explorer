function addTag(key, value) {
  const newTag = document.createElement('meta');
  newTag.setAttribute('name', key);
  newTag.setAttribute('content', value);
  document.head.appendChild(newTag);
};

function addImage(url) {
  addTag("fc:frame:image", url);
}

function imgUrl(token_id) {
  return "https://cloudflare-ipfs.com/ipfs/bafybeicgkb56vydl3kkcrgox7dpyatrgafxogurp42opjmiocfnwmbftlm/" + token_id + ".png";
};

function marketplaceUrl(token_id) {
  return "https://opensea.io/assets/base/0xbdb1a8772409a0c5eeb347060cbf4b41dd7b2c62/" + token_id;
};

function addButton(idx, text, action, target) {
  addTag(" fc:frame:button:" + idx, text); addTag("fc:frame:button:" + idx + ":action", action);
  addTag("fc:frame:button:" + idx + ":target", target);
};