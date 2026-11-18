/* Garment branding and agency-insignia placement. Coordinates use the wearer convention. */
(() => {
 const badge={surface:'Front',placement:'Left chest',wearerSide:'left',viewerSide:'right',x:.64,y:.285,width:.10,height:.12};
 const brand={surface:'Inside',placement:'Centered inside immediately below back collar',locked:true,asset:'assets/logo.png'};
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
 window.AJPlacement=Object.freeze({brand:Object.freeze(brand),badge:Object.freeze(badge),insideLabel});
})();
