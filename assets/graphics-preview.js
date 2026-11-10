/* Full-colour on-garment proofs. Artwork is sampled from the supplied mockups;
   the original reference remains available. These are visual, not production, files. */
(function(){
 'use strict';
 const template=new Image();template.src='assets/models/customizer-models.png';
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
   const rgb=[1,3,5].map(n=>parseInt(color.slice(n,n+2),16)),p=x.getImageData(0,0,768,768),d=p.data;
   for(let i=0;i<d.length;i+=4){const hi=Math.max(d[i],d[i+1],d[i+2]);const px=(i/4)%768,py=Math.floor(i/4/768);if(hi>110||py<220||py>650||px<180||px>590||(!hoodie&&py>395&&(px<250||px>525)))continue;const light=(d[i]+d[i+1]+d[i+2])/3,shade=.46+light/88;for(let k=0;k<3;k++)d[i+k]=clamp(rgb[k]*shade,0,255)}
   x.putImageData(p,0,0);
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
      const base=v.special==='joggers'?joggers:hats;if(!base.complete||!base.naturalWidth)return false;
      canvas.width=1536;canvas.height=830;const ctx=canvas.getContext('2d');ctx.fillStyle='#e9e6e1';ctx.fillRect(0,0,1536,830);
      const row=v.special==='joggers'?0:/beanie/i.test(v.title)?2:/boonie/i.test(v.title)?3:/dad/i.test(v.title)?1:0;
      const cw=base.naturalWidth/2,ch=v.special==='joggers'?base.naturalHeight:base.naturalHeight/4;
      for(let back=0;back<2;back++){
       const c=document.createElement('canvas');c.width=c.height=768;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(base,back*cw,row*ch,cw,ch,0,0,768,768);
       if(v.color&&!['#15171b','#141414','#121212','#000000'].includes(v.color)){
        const p=x.getImageData(0,0,768,768),d=p.data,rgb=[1,3,5].map(n=>parseInt(v.color.slice(n,n+2),16));
        for(let i=0;i<d.length;i+=4){const px=(i/4)%768,py=Math.floor(i/4/768),hi=Math.max(d[i],d[i+1],d[i+2]),lo=Math.min(d[i],d[i+1],d[i+2]);
         if(hi>90||hi-lo>22||(v.special==='joggers'?(py<325||py>690||px<290||px>475):(py<25||py>230||px<165||px>595)))continue;
         for(let k=0;k<3;k++)d[i+k]=Math.min(255,rgb[k]*(.45+hi/110));}x.putImageData(p,0,0);
       }ctx.drawImage(c,back*768,0);
      }
      if(v.source){
       if(v.special==='joggers')place(ctx,tile(v.source,[.60,.24,.14,.14]),428,365,28,34);
       else{
        let box=v.artKey.startsWith('hatdept')?[.18,.18,.30,.42]:/beanie/i.test(v.title)?[.35,.49,.31,.31]:[.44,.27,.27,.43];
        let front=tile(v.source,box),back=logoSource.complete&&logoSource.naturalWidth?tile(logoSource,[.322,.23,.08,.13]):front;
        if(v.artKey.startsWith('hatdept')&&v.artKey!=='hatdept5'){
         front=document.createElement('canvas');front.width=240;front.height=145;const t=front.getContext('2d'),labels=[['LAW','ENFORCEMENT'],['DOC','CORRECTIONS'],['TRT'],['JUVENILE','DETENTION'],['REHABILITATION','REENTRY']][Number(v.artKey.slice(-1))]||['AJ','LEGACY'];t.textAlign='center';t.fillStyle='#fff';t.font='bold 35px system-ui';labels.forEach((label,i)=>t.fillText(label,120,45+i*42,228));if(v.flag!=='None — monochrome'){t.fillStyle=({'Blue':'#2870ed','Orange':'#f47721','Red':'#d22832','Green':'#289650','Purple':'#9141be'}[v.flag]||'#b5b8bd');t.fillRect(8,labels.length===1?68:105,224,7);}
        }else front=back;
        if(v.layout?.startsWith('AJ Legacy')){front=back;back=null;}
        if(v.flag){const x=front.getContext('2d'),p=x.getImageData(0,0,front.width,front.height),d=p.data,rgb=({'Blue':[40,112,237],'Orange':[244,119,33],'Red':[210,40,50],'Green':[40,150,80],'Purple':[145,65,190]}[v.flag]||[181,184,189]);for(let i=0;i<d.length;i+=4){const hi=Math.max(d[i],d[i+1],d[i+2]),lo=Math.min(d[i],d[i+1],d[i+2]);if(hi-lo>24)for(let k=0;k<3;k++)d[i+k]=rgb[k]*hi/255}x.putImageData(p,0,0);}
        place(ctx,front,384,row===2?250:row===3?93:75,90,row===2?58:64);
        if(back)place(ctx,back,1152,row===2?260:row===3?93:88,44,44);
        else{ctx.save();ctx.translate(1124,100);ctx.scale(.67,.67);ctx.fillStyle='#e8e8e8';ctx.fillRect(0,0,84,48);ctx.fillStyle='#181818';for(let y=0;y<48;y+=8)ctx.fillRect(0,y,84,4);ctx.fillStyle=({'Blue':'#2870ed','Orange':'#f47721','Red':'#d22832','Green':'#289650','Purple':'#9141be'}[v.flag]||'#b5b8bd');ctx.fillRect(0,24,84,4);ctx.fillStyle='#181818';ctx.fillRect(0,0,35,24);ctx.restore();}
        if(v.text){ctx.fillStyle=v.ink||'#fff';ctx.textAlign='center';ctx.font='bold 13px system-ui';ctx.fillText(v.text,255,row===2?285:155,75);}
       }
      }
      ctx.fillStyle='#e9e6e1';ctx.fillRect(0,768,1536,62);ctx.fillStyle='#242424';ctx.textAlign='center';ctx.font='600 20px system-ui';ctx.fillText('FRONT',384,806);ctx.fillText('BACK',1152,806);canvas.dataset.previewEngine='ai-model-photo';return true;
     }
     if(!template.complete||!template.naturalWidth)return false;
     canvas.width=1536;canvas.height=830;const ctx=canvas.getContext('2d');
     ctx.fillStyle='#e9e6e1';ctx.fillRect(0,0,1536,830);
     garment(ctx,v.hoodie,0,v.color);garment(ctx,v.hoodie,1,v.color);
     ctx.save();ctx.translate(0,v.hoodie?185:150);
     const mainOnFront=v.side==='Front',offset=mainOnFront?0:768;
     // Sizes are anchored to the visible torso, with clearance above hoodie pockets.
     const y=v.hoodie?(mainOnFront?155:164):(mainOnFront?135:123);
     const maxH=v.hoodie?(mainOnFront?105:220):(mainOnFront?205:240);
     if(v.source){
      // Artwork-specific source windows avoid clipping the quote or bottom wordmark.
      const profiles={'shirt2_0':[.67,.065,.29,.83],'shirt2_2':[.63,.09,.32,.80],'concept-law-scripture':[.65,.155,.215,.44],'concept-doc-scripture':[.64,.15,.24,.53]};
      const box=v.mainBox||profiles[v.artKey]||(v.paired?[.635,v.originalHoodie?.24:.085,.33,v.originalHoodie?.63:.76]:[.23,.16,.57,.73]);
      const rebuilt=/^shirt2_[02]$/.test(v.artKey);
      const clean=rebuilt&&scripture.complete&&scripture.naturalWidth?tile(scripture,[.17,.05,.67,.92]):tile(v.source,box);
      if(rebuilt){const c=clean.getContext('2d'),p=c.getImageData(0,0,clean.width,clean.height),d=p.data;for(let i=0;i<d.length;i+=4){if(Math.max(d[i],d[i+1],d[i+2])-Math.min(d[i],d[i+1],d[i+2])>24){const rgb={'Blue':[40,112,237],'Orange':[244,119,33],'Red':[210,40,50],'Green':[40,150,80],'Purple':[145,65,190],'Silver / gray':[181,184,189],'None — monochrome':[215,217,220]}[v.flag]||[181,184,189];const light=Math.max(d[i],d[i+1],d[i+2])/255;for(let k=0;k<3;k++)d[i+k]=Math.round(rgb[k]*light)}}c.putImageData(p,0,0)}
      if(!v.blankBack)place(ctx,clean,384+offset,y,v.hoodie?(mainOnFront?145:170):180,maxH);
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
     canvas.dataset.previewEngine='ai-model-photo';canvas.dataset.garment=v.hoodie?'Hoodie':'Shirt';canvas.dataset.designSide=v.side;return true;
    }
   };
  }
 };
})();

// Keep nested collection-card handling from swallowing the K9 navigation link.
document.addEventListener('click',function(event){const link=event.target.closest?.('a[href]');if(link&&/service-designs\.html\?category=k9/.test(link.getAttribute('href'))){event.preventDefault();event.stopImmediatePropagation();location.assign(new URL('k9-collection.html',location.href).href)}},true);
