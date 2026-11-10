/* Preserve approved garment artwork without extracting pixels from fabric. */
(function(){
 'use strict';
 window.AJGraphicsPreview={create(canvas,onReady){
  let disposed=false;
  return {
   dispose(){disposed=true},
   draw(v){
    if(disposed||!v.source)return false;
    const width=v.source.naturalWidth||v.source.width;
    const height=v.source.naturalHeight||v.source.height;
    if(!width||!height)return false;
    canvas.width=width;canvas.height=height;
    canvas.getContext('2d').drawImage(v.source,0,0,width,height);
    canvas.dataset.previewEngine='approved-garment-image';
    canvas.dataset.garment=v.hoodie?'Hoodie':'Shirt';
    return true;
   }
  };
 }};
})();

// Keep nested collection-card handling from swallowing the K9 navigation link.
document.addEventListener('click',function(event){const link=event.target.closest?.('a[href]');if(link&&/service-designs\.html\?category=k9/.test(link.getAttribute('href'))){event.preventDefault();event.stopImmediatePropagation();location.assign(new URL('k9-collection.html',location.href).href)}},true);

(function(){const s=document.createElement('style');s.textContent="@media(max-width:600px){header{position:sticky;top:0}header nav{display:grid!important;grid-template-columns:minmax(0,1fr) 135px;gap:10px!important;padding:10px 16px!important}.brand{font-size:20px!important;white-space:nowrap}header nav .search{width:100%!important;min-width:0;font-size:14px;padding:8px}header nav .links{grid-column:1/-1;display:flex;justify-content:space-between;gap:8px!important;font-size:12px!important;flex-wrap:wrap}header nav .links a{padding:4px 0}html{scroll-padding-top:110px}.product-grid,.catalog-grid{grid-template-columns:1fr}.product-grid img,.catalog-grid img{max-width:100%;object-fit:contain!important}.product-grid button{min-width:0}}";document.head.appendChild(s)})();
