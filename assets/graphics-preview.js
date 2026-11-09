/* Full-colour on-garment proofs. Artwork is sampled from the supplied mockups;
   the original reference remains available. These are visual, not production, files. */
(function(){
 'use strict';
 const template=new Image();template.src='assets/mockups/blank-garments.png';
 const logoSource=new Image();logoSource.src='assets/concepts/gym-renew.webp';
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function tile(source,box){
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
  ctx.putImageData(pixels,0,0);return c;
 }
 function place(ctx,art,cx,top,maxW,maxH){const s=Math.min(maxW/art.width,maxH/art.height);ctx.drawImage(art,cx-art.width*s/2,top,art.width*s,art.height*s)}
 function garment(ctx,hoodie,back,color){
  const cw=template.naturalWidth/2,ch=template.naturalHeight/2;
  const c=document.createElement('canvas');c.width=768;c.height=512;
  const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(template,back*cw,hoodie*ch,cw,ch,0,0,768,512);
  if(color!=='#15171b'&&color!=='#141414'&&color!=='#121212'&&color!=='#000000'){
   const rgb=[1,3,5].map(n=>parseInt(color.slice(n,n+2),16)),p=x.getImageData(0,0,768,512),d=p.data;
   for(let i=0;i<d.length;i+=4){const hi=Math.max(d[i],d[i+1],d[i+2]);if(hi>110)continue;const light=(d[i]+d[i+1]+d[i+2])/3,shade=.46+light/88;for(let k=0;k<3;k++)d[i+k]=clamp(rgb[k]*shade,0,255)}
   x.putImageData(p,0,0);
  }
  ctx.drawImage(c,back*768,0);
 }
 window.AJGraphicsPreview={
  create(canvas,onReady){
   let disposed=false;
   const ready=()=>{if(!disposed)onReady()};
   template.addEventListener('load',ready);logoSource.addEventListener('load',ready);
   return {
    dispose(){disposed=true;template.removeEventListener('load',ready);logoSource.removeEventListener('load',ready)},
    draw(v){
     if(!template.complete||!template.naturalWidth)return false;
     canvas.width=1536;canvas.height=574;const ctx=canvas.getContext('2d');
     ctx.fillStyle='#e9e6e1';ctx.fillRect(0,0,1536,574);
     garment(ctx,v.hoodie,0,v.color);garment(ctx,v.hoodie,1,v.color);
     const mainOnFront=v.side==='Front',offset=mainOnFront?0:768;
     const y=mainOnFront&&v.text?188:v.hoodie?(mainOnFront?153:164):123;
     const maxH=v.hoodie?(mainOnFront?245:265):310;
     if(v.source){
      // Artwork-specific source windows avoid clipping the quote or bottom wordmark.
      const box=v.mainBox||(v.paired?[.595,v.originalHoodie?.24:.15,.30,v.originalHoodie?.50:.62]:[.23,.16,.57,.73]);
      if(!v.blankBack)place(ctx,tile(v.source,box),384+offset,y,v.hoodie?223:250,maxH);
      if(v.event){
       ctx.fillStyle='#454545';ctx.textAlign='center';ctx.font='600 20px system-ui';ctx.fillText('Sponsor artwork pending',1152,280);
      }else if(v.service&&v.paired){
       // Carry the existing personalized front, rank and sleeve graphics into the photo proof.
       place(ctx,tile(v.source,v.frontBox||[.12,.17,.28,.27]),384,123,235,150);
       if(v.sleeves){v.sleeves(ctx,tile)}
      }else{
       const logo=v.paired?tile(v.source,[.322,v.originalHoodie?.27:.23,.08,.13]):logoSource.complete&&logoSource.naturalWidth?tile(logoSource,[.322,.23,.08,.13]):null;
       const lx=mainOnFront?1152:446,ly=mainOnFront?(v.hoodie?155:76):(v.hoodie?147:126);
       if(logo)place(ctx,logo,lx,ly,mainOnFront?48:67,mainOnFront?47:66);
       if(v.text){ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=v.ink;let fs=20;ctx.font='700 '+fs+'px system-ui';while(ctx.measureText(v.text).width>130&&fs>8){fs--;ctx.font='700 '+fs+'px system-ui'}ctx.fillText(v.text,318,v.hoodie?175:153);ctx.restore()}
      }
     }
     ctx.fillStyle='#e9e6e1';ctx.fillRect(0,512,1536,62);ctx.fillStyle='#242424';ctx.textAlign='center';ctx.font='600 20px system-ui';ctx.fillText('FRONT',384,550);ctx.fillText('BACK',1152,550);
     canvas.dataset.previewEngine='full-color-photo';canvas.dataset.garment=v.hoodie?'Hoodie':'Shirt';canvas.dataset.designSide=v.side;return true;
    }
   };
  }
 };
})();
