/* Garment names and placement coordinates shared by the product grid and preview. */
(() => {
 const root = new URL('mockups/individual/', document.currentScript.src);
 const modelRoot = new URL('models/worn/', document.currentScript.src);
 // Coordinates refer to a single square view in the front/back photo pair.
 const models = {
  'T-shirt': {file:'tee', front:[.52,.45,.32,.42], back:[.49,.44,.32,.43], hem:.78},
  Hoodie:{file:'hoodie', front:[.52,.39,.29,.27], back:[.50,.57,.31,.32], hem:.80},
  'Full-zip hoodie':{file:'full-zip', front:[.535,.38,.29,.27], back:[.49,.56,.31,.32], hem:.80},
  'Tank Top':{file:'tank', front:[.50,.46,.28,.40], back:[.50,.46,.28,.40], hem:.79},
  Crewneck:{file:'crewneck', front:[.50,.43,.29,.31], back:[.50,.49,.30,.38], hem:.80},
  Polo:{file:'polo', front:[.50,.43,.29,.33], back:[.50,.46,.31,.40], hem:.80},
  'Half-zip':{file:'half-zip', front:[.50,.51,.29,.30], back:[.50,.48,.31,.39], hem:.79},
  Shorts:{file:'shorts', lower:true,logo:[.62,.36,.065]},
  Joggers:{file:'joggers', lower:true,logo:[.63,.29,.055]},
  Sweatpants:{file:'sweatpants', lower:true,logo:[.63,.29,.055]},
  Leggings:{file:'leggings', lower:true,logo:[.61,.29,.048]},
 };
 function modelImage(style,fit) {
  const file=style==='Tank Top'&&/^Women/.test(fit)?'tank-women':models[style].file;
  return new URL(file+'.webp',modelRoot).href;
 }
 function drawModel(ctx,image,x,size,back,model,color) {
  const width=image.naturalWidth/2, height=image.naturalHeight;
  if(!color||['#171717','#151515','#15171b','#17191d'].includes(color.toLowerCase())){
   ctx.drawImage(image,back?width:0,0,width,height,x,0,size,size);
   return;
  }
  const canvas=document.createElement('canvas');
  canvas.width=canvas.height=size;
  const layer=canvas.getContext('2d',{willReadFrequently:true});
  layer.drawImage(image,back?width:0,0,width,height,0,0,size,size);
  const frame=layer.getImageData(0,0,size,size);
  const rgb=color.match(/[0-9a-f]{2}/gi).map(value=>parseInt(value,16));
  for(let y=Math.floor(size*.10);y<size*(model.hem||.83);y++){
   for(let col=Math.floor(size*.20);col<size*.82;col++){
    const i=(y*size+col)*4;
    const r=frame.data[i],g=frame.data[i+1],b=frame.data[i+2];
    const hi=Math.max(r,g,b),lo=Math.min(r,g,b);
    if(hi-lo>12||hi>52)continue;
    const shade=.58+hi/100;
    const mix=Math.min(1,(52-hi)/17);
    for(let channel=0;channel<3;channel++){
     frame.data[i+channel]=frame.data[i+channel]*(1-mix)+rgb[channel]*shade*mix;
    }
   }
  }
  layer.putImageData(frame,0,0);
  ctx.drawImage(canvas,x,0);
 }
 const hoodie = {
  file:'hoodie',
  print:[.50,.49,.34,.25],
  backPrint:[.50,.57,.34,.34],
  logo:[.60,.33,.10]
 };
 const styles = {
  'T-shirt': {file:'tee', print:[.50,.48,.35,.38], logo:[.61,.31,.115]},
  'Tank Top': {file:'tank', print:[.50,.50,.36,.36], logo:[.62,.35,.10]},
  Hoodie: hoodie,
  'Full-zip hoodie': {...hoodie, fullZip:true},
  Shorts: {file:'shorts', print:[.70,.61,.23,.26], logo:[.68,.43,.095], lower:true},
  Joggers: {file:'joggers', print:[.61,.43,.13,.23], logo:[.60,.25,.075], lower:true},
  Sweatpants: {file:'sweatpants', print:[.61,.43,.13,.23], logo:[.60,.25,.075], lower:true},
  Leggings: {file:'leggings', print:[.60,.42,.10,.23], logo:[.60,.26,.067], lower:true},
  Crewneck: {file:'crewneck', logo:[.61,.30,.12], logoOnly:true},
  Polo: {file:'polo', logo:[.62,.33,.12], logoOnly:true},
  'Half-zip': {file:'half-zip', logo:[.62,.32,.12], logoOnly:true}
 };
 const tops = ['T-shirt','Tank Top','Hoodie','Full-zip hoodie'];
 const bottoms = ['Shorts','Joggers','Sweatpants','Leggings'];
 const branded = ['Crewneck','Polo','Half-zip'];
 function image(style, side = 'front', brandedImage = false) {
  const {file, lower, logoOnly} = styles[style];
  const suffix = brandedImage && lower ? '-aj' : side === 'back' && !lower && !logoOnly ? '-back' : '';
  return new URL(file + suffix + '.webp', root).href;
 }
 window.AJGarments = {styles, models, modelImage, drawModel, tops, bottoms, branded, image, brandPlacement:'Inside below back collar', badgePlacement:'Wearer-left chest'};
})();
