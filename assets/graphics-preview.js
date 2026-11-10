/* Full-colour on-garment proofs. Artwork is sampled from the supplied mockups;
   the original reference remains available. These are visual, not production, files. */
(function(){
 'use strict';
 const template=new Image();template.src='assets/mockups/garment-only-studio.webp';
 const hats=new Image();hats.src='assets/models/headwear-models.png';
 const joggers=new Image();joggers.src='assets/models/jogger-models.png';
 const scripture=new Image();scripture.src='assets/artwork/matthew-5-9.png';
 const logoSource=new Image();logoSource.src='assets/concepts/gym-renew.webp';
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function tile(source,box,trim=true){
  const w=source.naturalWidth||source.width,h=source.naturalHeight||source.height;
  const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*box[2]));c.height=Math.max(1,Math.round(h*box[3]));
  const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(source,w*box[0],h*box[1],w*box[2],h*box[3],0,0,c.width,c.height);
  const pixels=ctx.getImageData(0,0,c.width,c.height),d=pixels.data;
  for(let i=0;i<d.length;i+=4){
   const hi=Math.max(d[i],d[i+1],d[i+2]),lo=Math.min(d[i],d[i+1],d[i+2]);
   // Keep saturated dark blue/orange marks; reject neutral black fabric.
   const chroma=hi-lo,ink=chroma>24&&hi>44;
   const alpha=ink?clamp((hi-25)/45,0,1):clamp((hi-58)/32,0,1);
   d[i+3]=Math.round(d[i+3]*alpha);
   // RGB stays at its original strength. Do not multiply RGB by alpha a second time.
  }
  ctx.putImageData(pixels,0,0);if(!trim)return c;
  // Center the visible ink rather than the source photo's uneven fabric margins.
  let left=c.width,top=c.height,right=-1,bottom=-1;
  for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>100){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}
  if(right<left)return c;
  const trimmed=document.createElement('canvas');trimmed.width=right-left+1;trimmed.height=bottom-top+1;
  trimmed.getContext('2d').drawImage(c,left,top,trimmed.width,trimmed.height,0,0,trimmed.width,trimmed.height);return trimmed;
 }
 function place(ctx,art,cx,top,maxW,maxH){const s=Math.min(maxW/art.width,maxH/art.height);ctx.drawImage(art,cx-art.width*s/2,top,art.width*s,art.height*s)}
 function garment(ctx,hoodie,back,color){
  const cw=template.naturalWidth/2,ch=template.naturalHeight/2;
  const c=document.createElement('canvas');c.width=768;c.height=768;
  const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(template,back*cw,hoodie*ch,cw,ch,0,0,768,768);
  if(color!=='#15171b'&&color!=='#141414'&&color!=='#121212'&&color!=='#000000'){
   const points=hoodie?[[304,32],[468,32],[502,133],[581,188],[640,430],[625,684],[551,684],[529,430],[521,687],[244,687],[236,430],[211,684],[137,684],[122,430],[181,188],[269,133]]:[[292,45],[478,45],[562,96],[665,295],[567,344],[542,300],[555,684],[213,684],[225,300],[201,344],[98,295],[201,96]];
   x.save();x.beginPath();points.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.clip();
   const rgb=[1,3,5].map(n=>parseInt(color.slice(n,n+2),16)),p=x.getImageData(0,0,768,768),d=p.data;
   for(let i=0;i<d.length;i+=4){const hi=Math.max(d[i],d[i+1],d[i+2]),lo=Math.min(d[i],d[i+1],d[i+2]);if(hi>110||hi-lo>22)continue;const light=(d[i]+d[i+1]+d[i+2])/3,shade=.46+light/88;for(let k=0;k<3;k++)d[i+k]=clamp(rgb[k]*shade,0,255)}
   const painted=document.createElement('canvas');painted.width=painted.height=768;painted.getContext('2d').putImageData(p,0,0);x.drawImage(painted,0,0);x.restore();
  }
  ctx.drawImage(c,back*768,0);
 }
 window.AJGraphicsPreview={
  create(canvas,onReady){
   let disposed=false;
   const ready=()=>{if(!disposed)onReady()};
   hats.addEventListener('load',ready);joggers.addEventListener('load',ready);template.addEventListener('load',ready);scripture.addEventListener('load',ready);logoSource.addEventListener('load',ready);
   return {
    dispose(){disposed=true;hats.removeEventListener('load',ready);joggers.removeEventListener('load',ready);template.removeEventListener('load',ready);scripture.removeEventListener('load',ready);logoSource.removeEventListener('load',ready)},
    draw(v){
     if(v.special){
      if(!v.source)return false;canvas.width=v.source.naturalWidth;canvas.height=v.source.naturalHeight;
      canvas.getContext('2d').drawImage(v.source,0,0);canvas.dataset.previewEngine='original-product-photo';return true;
     }
     if(!template.complete||!template.naturalWidth)return false;
     canvas.width=1536;canvas.height=830;const ctx=canvas.getContext('2d');
     ctx.fillStyle='#e9e6e1';ctx.fillRect(0,0,1536,830);
     garment(ctx,v.hoodie,0,v.color);garment(ctx,v.hoodie,1,v.color);
     ctx.save();ctx.translate(0,0);
     const mainOnFront=v.side==='Front',offset=mainOnFront?0:768;
     // Sizes are anchored to the visible torso, with clearance above hoodie pockets.
     const y=v.hoodie?(mainOnFront?230:220):(mainOnFront?140:110);
     const maxH=v.hoodie?(mainOnFront?195:365):(mainOnFront?480:500);
     if(v.source){
      // Artwork-specific source windows avoid clipping the quote or bottom wordmark.
      const profiles={'shirt2_0':[.67,.065,.29,.83],'shirt2_2':[.63,.09,.32,.80],'concept-law-scripture':[.65,.155,.215,.44],'concept-doc-scripture':[.64,.15,.24,.53]};
      const box=v.mainBox||profiles[v.artKey]||(v.paired?[.635,v.originalHoodie?.24:.085,.33,v.originalHoodie?.63:.76]:[.23,.16,.57,.73]);
      const rebuilt=/^shirt2_[02]$/.test(v.artKey);
      const clean=rebuilt&&scripture.complete&&scripture.naturalWidth?tile(scripture,[.17,.05,.67,.92]):tile(v.source,box);
      if(rebuilt){const c=clean.getContext('2d'),p=c.getImageData(0,0,clean.width,clean.height),d=p.data;for(let i=0;i<d.length;i+=4){if(Math.max(d[i],d[i+1],d[i+2])-Math.min(d[i],d[i+1],d[i+2])>24){const rgb={'Blue':[40,112,237],'Orange':[244,119,33],'Red':[210,40,50],'Green':[40,150,80],'Purple':[145,65,190],'Silver / gray':[181,184,189],'None — monochrome':[215,217,220]}[v.flag]||[181,184,189];const light=Math.max(d[i],d[i+1],d[i+2])/255;for(let k=0;k<3;k++)d[i+k]=Math.round(rgb[k]*light)}}c.putImageData(p,0,0)}
      if(!v.blankBack)place(ctx,clean,384+offset,y,v.hoodie?(mainOnFront?270:340):340,maxH);
      if(v.event){
       ctx.fillStyle='#454545';ctx.textAlign='center';ctx.font='600 20px system-ui';ctx.fillText('Sponsor artwork pending',1152,280);
      }else if(v.service&&v.paired){
       // Carry the existing personalized front, rank and sleeve graphics into the photo proof.
       place(ctx,tile(v.source,v.frontBox||[.12,.17,.28,.27],false),384,v.hoodie?146:123,v.hoodie?140:155,v.hoodie?98:105);
       if(v.sleeves){v.sleeves({drawImage(art,x){ctx.drawImage(art,x===516?518:224,v.hoodie?172:147,20,25)}},tile)}
      }else{
       const logo=v.paired?tile(v.source,[.322,v.originalHoodie?.27:.23,.08,.13]):logoSource.complete&&logoSource.naturalWidth?tile(logoSource,[.322,.23,.08,.13]):null;
       const lx=mainOnFront?1152:446,ly=mainOnFront?(v.hoodie?155:76):(v.hoodie?147:126);
       if(logo)place(ctx,logo,lx,ly,mainOnFront?32:44,mainOnFront?32:44);
       if(v.text){ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=v.ink;let fs=15;ctx.font='700 '+fs+'px system-ui';while(ctx.measureText(v.text).width>85&&fs>8){fs--;ctx.font='700 '+fs+'px system-ui'}ctx.fillText(v.text,318,v.hoodie?175:153);ctx.restore()}
      }
     }
     ctx.restore();ctx.fillStyle='#e9e6e1';ctx.fillRect(0,768,1536,62);ctx.fillStyle='#242424';ctx.textAlign='center';ctx.font='600 20px system-ui';ctx.fillText('FRONT',384,806);ctx.fillText('BACK',1152,806);
     canvas.dataset.previewEngine='garment-only-photo';canvas.dataset.garment=v.hoodie?'Hoodie':'Shirt';canvas.dataset.designSide=v.side;return true;
    }
   };
  }
 };
})();

// Keep nested collection-card handling from swallowing the K9 navigation link.
document.addEventListener('click',function(event){const link=event.target.closest?.('a[href]');if(link&&/service-designs\.html\?category=k9/.test(link.getAttribute('href'))){event.preventDefault();event.stopImmediatePropagation();location.assign(new URL('k9-collection.html',location.href).href)}},true);

(function(){const s=document.createElement('style');s.textContent="@media(max-width:600px){header{position:sticky;top:0}header nav{display:grid!important;grid-template-columns:minmax(0,1fr) 135px;gap:10px!important;padding:10px 16px!important}.brand{font-size:20px!important;white-space:nowrap}header nav .search{width:100%!important;min-width:0;font-size:14px;padding:8px}header nav .links{grid-column:1/-1;display:flex;justify-content:space-between;gap:8px!important;font-size:12px!important;flex-wrap:wrap}header nav .links a{padding:4px 0}html{scroll-padding-top:110px}.product-grid,.catalog-grid{grid-template-columns:1fr}.product-grid img,.catalog-grid img{max-width:100%;object-fit:contain!important}.product-grid button{min-width:0}}";document.head.appendChild(s)})();
