/* Garment branding and agency-insignia placement. Coordinates use the wearer convention. */
(() => {
 const badge={surface:'Front',placement:'Left chest',wearerSide:'left',viewerSide:'right',x:.64,y:.285,width:.10,height:.12};
 const brand={surface:'Inside',placement:'Centered inside immediately below back collar',locked:true,asset:'assets/logo.png'};
 const flag={placement:'Right shoulder',wearerSide:'right',stars:'forward'};
 const state={placement:'Left shoulder',wearerSide:'left',studioZone:'shoulder-left'};
 const garmentSleeves = {
  'T-shirt': [.23,.365,.095],
  Hoodie: [.27,.435,.095],
  Crewneck: [.285,.435,.065],
  Polo: [.275,.395,.065],
  'Half-zip': [.285,.435,.065],
 };
 const photographedSleeves = {
  'T-shirt': [.21,.365,.085],
  Hoodie: [.23,.435,.085],
 };
 function sleevePosition(style, wearerSide, back=false, photographed=false) {
  if(style==='Full-zip hoodie')style='Hoodie';
  const [offset, height, width] = (photographed && photographedSleeves[style]) ||
   garmentSleeves[style] || garmentSleeves['T-shirt'];
  return [(wearerSide === 'right') !== back ? offset : 1 - offset, height, width];
 }
 function hasSleeves(style) { return style !== 'Tank Top'; }
 function drawFlag(context, x, y, flagWidth, flagHeight, back, colors) {
  const stripe = flagHeight / 13;
  const unionWidth = flagWidth * .4;
  // The right sleeve changes screen sides when the garment is turned around.
  const unionX = back ? 0 : flagWidth - unionWidth;
  context.save();
  context.translate(x, y);
  for (let row = 0; row < 13; row++) {
   context.fillStyle = row === 6 ? '#b8b8b8' : row % 2 ? '#555555' : '#242424';
   context.fillRect(0, row * stripe, flagWidth, stripe);
  }
  context.fillStyle = '#242424';
  context.fillRect(unionX, 0, unionWidth, stripe * 7);
  context.fillStyle = '#fff';
  for (let row = 0; row < 9; row++) {
   for (let column = 0; column < (row % 2 ? 5 : 6); column++) {
    const sx = unionX + unionWidth * (column + (row % 2 ? 1 : .5)) / 6;
    const sy = stripe * 7 * (row + .5) / 9;
    context.beginPath();
    for (let point = 0; point < 10; point++) {
     const angle = point * Math.PI / 5 - Math.PI / 2;
     const radius = stripe * (point % 2 ? .16 : .38);
     context.lineTo(sx + Math.cos(angle) * radius, sy + Math.sin(angle) * radius);
    }
    context.closePath();
    context.fill();
   }
  }
  const accents = colors.length ? colors : ['#b8b8b8'];
  const start = back ? unionWidth : 0;
  const segment = (flagWidth - unionWidth) / accents.length;
  accents.forEach((color, index) => {
   context.fillStyle = color;
   context.fillRect(start + segment * index, stripe * 6, segment, stripe);
  });
  context.restore();
 }
 function drawSplitFront(ctx,art,size,top,maxWidth,maxHeight,centerVertically=false){
  const width=art.naturalWidth||art.width;
  const height=art.naturalHeight||art.height;
  const gap=size*.025;
  const scale=Math.min((maxWidth-gap)/width,maxHeight/height);
  const halfWidth=width/2;
  const panelWidth=halfWidth*scale;
  const panelHeight=height*scale;
  const y=centerVertically?top-panelHeight/2:top;
  const leftEdge=(size-gap)/2;
  const rightEdge=(size+gap)/2;
  ctx.drawImage(art,0,0,halfWidth,height,leftEdge-panelWidth,y,panelWidth,panelHeight);
  ctx.drawImage(art,halfWidth,0,halfWidth,height,rightEdge,y,panelWidth,panelHeight);
 }
 function drawZipper(ctx,size,top,bottom){
  const center=size*.5;
  ctx.save();
  ctx.fillStyle='#1b1c1e';
  ctx.fillRect(center-size*.005,size*top,size*.01,size*(bottom-top));
  ctx.fillStyle='#9da0a4';
  ctx.fillRect(center-size*.001,size*top,size*.002,size*(bottom-top));
  ctx.fillRect(center-size*.004,size*(top+.008),size*.008,size*.019);
  ctx.restore();
 }
 function insideLabel(ctx,logo,x,y,width,height){
  ctx.save();ctx.fillStyle='#222830';ctx.fillRect(x,y,width,height);
  const sx=x+12,sy=y+10,w=Math.min(82,width*.26),h=height-20;
  ctx.fillStyle='#383f48';ctx.strokeStyle='#9da4ae';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(sx,sy+12);ctx.lineTo(sx+w*.25,sy);ctx.quadraticCurveTo(sx+w*.5,sy+22,sx+w*.75,sy);ctx.lineTo(sx+w,sy+12);ctx.lineTo(sx+w,sy+h);ctx.lineTo(sx,sy+h);ctx.closePath();ctx.fill();ctx.stroke();
  const lw=Math.min(w*.42,h*.55),lh=lw*(logo.naturalHeight||logo.height)/(logo.naturalWidth||logo.width);
  ctx.drawImage(logo,sx+(w-lw)/2,sy+26,lw,Math.min(lh,h-29));
  ctx.fillStyle='#f1f3f5';ctx.font='600 '+Math.max(10,Math.min(14,width*.035))+'px system-ui';ctx.textAlign='left';
  ctx.fillText('INSIDE BACK COLLAR',sx+w+12,sy+24,width-w-36);
  ctx.fillStyle='#c1c7cf';ctx.font='11px system-ui';ctx.fillText('Fixed AJ label · no exterior chest logo',sx+w+12,sy+45,width-w-36);ctx.restore();
 }
 window.AJPlacement=Object.freeze({brand:Object.freeze(brand),badge:Object.freeze(badge),flag:Object.freeze(flag),state:Object.freeze(state),sleevePosition,hasSleeves,drawFlag,drawSplitFront,drawZipper,insideLabel});
})();
