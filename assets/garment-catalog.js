/* Garment names and placement coordinates shared by the product grid and preview. */
(() => {
 const root = new URL('mockups/individual/', document.currentScript.src);
 const styles = {
  'T-shirt': {file:'tee', print:[.50,.40,.35,.44], logo:[.61,.31,.115]},
  'Tank Top': {file:'tank', print:[.50,.43,.36,.42], logo:[.62,.35,.10]},
  Hoodie: {file:'hoodie', print:[.50,.43,.34,.32], logo:[.60,.33,.10]},
  Shorts: {file:'shorts', print:[.70,.61,.23,.26], logo:[.68,.43,.095], lower:true},
  Joggers: {file:'joggers', print:[.61,.43,.13,.23], logo:[.60,.25,.075], lower:true},
  Sweatpants: {file:'sweatpants', print:[.61,.43,.13,.23], logo:[.60,.25,.075], lower:true},
  Leggings: {file:'leggings', print:[.60,.42,.10,.23], logo:[.60,.26,.067], lower:true},
  Crewneck: {file:'crewneck', logo:[.61,.30,.12], logoOnly:true},
  Polo: {file:'polo', logo:[.62,.33,.12], logoOnly:true},
  'Half-zip': {file:'half-zip', logo:[.62,.32,.12], logoOnly:true}
 };
 const tops = ['T-shirt','Tank Top','Hoodie'];
 const bottoms = ['Shorts','Joggers','Sweatpants','Leggings'];
 const branded = ['Crewneck','Polo','Half-zip'];
 function image(style, side = 'front', brandedImage = false) {
  const {file, lower, logoOnly} = styles[style];
  const suffix = brandedImage ? '-aj' : side === 'back' && !lower && !logoOnly ? '-back' : '';
  return new URL(file + suffix + '.webp', root).href;
 }
 window.AJGarments = {styles, tops, bottoms, branded, image};
})();
