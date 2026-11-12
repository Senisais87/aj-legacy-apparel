/* Place print artwork on the flat lay for the selected garment. */
(() => {
 const root = new URL('./', document.currentScript.src);
 const black = '#171717';
 function sizeOf(image) {
  return [image.naturalWidth || image.width, image.naturalHeight || image.height];
 }
 function fit(context, image, x, y, width, height) {
  const [w, h] = sizeOf(image);
  const scale = Math.min(width / w, height / h);
  context.drawImage(image, x - w * scale / 2, y - h * scale / 2, w * scale, h * scale);
 }
 function layer(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas.getContext('2d', {willReadFrequently:true});
 }
 function artwork(v) {
  const [iw, ih] = sizeOf(v.original);
  const box = v.rawArt ? [0,0,1,1] : v.mainBox ||
   (v.originalSide === 'Front' ? [.27,.23,.46,.55] : [.64,.22,.27,.51]);
  const [x,y,w,h] = box.map((n,i) => n * (i % 2 ? ih : iw));
  const ratio = Math.min(1, 680 / Math.max(w,h));
  const cut = layer(Math.ceil(w * ratio), Math.ceil(h * ratio));
  cut.drawImage(v.original,x,y,w,h,0,0,cut.canvas.width,cut.canvas.height);
  if(v.rawArt && v.artKey !== 'selected-gym-01') return cut.canvas;
  const pixels = cut.getImageData(0,0,cut.canvas.width,cut.canvas.height);
  for(let i=0;i<pixels.data.length;i+=4){
   const r=pixels.data[i],g=pixels.data[i+1],b=pixels.data[i+2];
   const hi=Math.max(r,g,b),lo=Math.min(r,g,b);
   if(v.rawArt && lo>177 && hi-lo<17) pixels.data[i+3]=0;
   if(!v.rawArt && hi-lo<30) pixels.data[i+3]*=Math.max(0,Math.min(1,(hi-37)/73));
  }
  cut.putImageData(pixels,0,0);
  return cut.canvas;
 }
 function drawGarment(context, image, x, size, color) {
  if(!color || color === black || color === '#151515' || color === '#15171b'){
   context.drawImage(image,x,0,size,size);
   return;
  }
  const work=layer(size,size);
  work.drawImage(image,0,0,size,size);
  const pixels=work.getImageData(0,0,size,size);
  const tint=color.match(/[0-9a-f]{2}/gi).map(channel=>parseInt(channel,16));
  for(let i=0;i<pixels.data.length;i+=4){
   if(!pixels.data[i+3])continue;
   const shade=.70+(pixels.data[i]+pixels.data[i+1]+pixels.data[i+2])/195;
   for(let c=0;c<3;c++) pixels.data[i+c]=tint[c]*shade;
  }
  work.putImageData(pixels,0,0);
  context.drawImage(work.canvas,x,0);
 }
 window.AJGraphicsPreview={create(canvas, refresh){
  const images=new Map();
  let disposed=false, artKey, cut;
  const get=src=>{
   if(!images.has(src)){
    const image=new Image();
    image.onload=()=>{if(!disposed)refresh()};
    image.onerror=()=>{if(!disposed)refresh()};
    images.set(src,image);
    image.src=src;
   }
   return images.get(src);
  };
  return {
   dispose(){disposed=true},
   draw(v){
    if(disposed||!v.source)return false;
    if(!v.compose){
     [canvas.width,canvas.height]=sizeOf(v.source);
     canvas.getContext('2d').drawImage(v.source,0,0,canvas.width,canvas.height);
    }else{
     const catalog=window.AJGarments;
     const profile=catalog.styles[v.style];
     const oneSide=profile.lower||profile.logoOnly;
     const front=get(catalog.image(v.style));
     const back=oneSide?null:get(catalog.image(v.style,'back'));
     const logo=get(new URL('logo.png',root).href);
     if([front,back,logo].some(image=>image&&!image.naturalWidth))return false;
     const size=oneSide?540:420;
     canvas.width=size*(oneSide?1:2);
     canvas.height=size+(oneSide?0:28);
     const context=canvas.getContext('2d');
     context.fillStyle='#242931';
     context.fillRect(0,0,canvas.width,canvas.height);
     drawGarment(context,front,0,size,v.color);
     if(back) drawGarment(context,back,size,size,v.color);
     if(!profile.logoOnly&&!v.logoOnly){
      const version=v.original.dataset?.renderVersion;
      const key=[v.artKey,version,v.stripe].join('|');
      if(key!==artKey){cut=artwork(v);artKey=key}
      const [x,y,w,h]=profile.print;
      fit(context,cut,((back&&v.side==='Back'?1:0)+x)*size,y*size,w*size,h*size);
     }
     if(profile.logoOnly||profile.lower||v.side==='Back'){
      const [x,y,w]=profile.logo;
      fit(context,logo,x*size,y*size,w*size,w*size);
     }
     if(v.text&&!profile.logoOnly){
      context.fillStyle=v.ink;
      context.font='bold 13px system-ui';
      context.textAlign='center';
      const short=v.style==='Shorts';
      context.fillText(v.text,size*(profile.lower?(short?.32:.40):.38),size*(profile.lower?(short?.45:.30):.28),size*(profile.lower?.105:.17));
     }
     if(back){
      context.fillStyle='#f2f3f5';
      context.font='600 14px system-ui';
      context.textAlign='center';
      context.fillText('FRONT',size*.5,size+15);
      context.fillText('BACK',size*1.5,size+15);
     }
    }
    canvas.dataset.previewEngine=v.compose?'garment-artwork-composite':'live-product-artwork';
    canvas.dataset.garment=v.style;
    canvas.dataset.placement=v.side;
    return true;
   }
  };
 }};
})();

// Keep nested collection-card handling from swallowing the K9 navigation link.
document.addEventListener('click',function(event){const link=event.target.closest?.('a[href]');if(link&&/service-designs\.html\?category=k9/.test(link.getAttribute('href'))){event.preventDefault();event.stopImmediatePropagation();location.assign(new URL('k9-collection.html',location.href).href)}},true);

(function(){const s=document.createElement('style');s.textContent="@media(max-width:600px){header{position:sticky;top:0}header nav{display:grid!important;grid-template-columns:minmax(0,1fr) 135px;gap:10px!important;padding:10px 16px!important}.brand{font-size:20px!important;white-space:nowrap}header nav .search{width:100%!important;min-width:0;font-size:14px;padding:8px}header nav .links{grid-column:1/-1;display:flex;justify-content:space-between;gap:8px!important;font-size:12px!important;flex-wrap:wrap}header nav .links a{padding:4px 0}html{scroll-padding-top:110px}.product-grid,.catalog-grid{grid-template-columns:1fr}.product-grid img,.catalog-grid img{max-width:100%;object-fit:contain!important}.product-grid button{min-width:0}}";document.head.appendChild(s)})();
