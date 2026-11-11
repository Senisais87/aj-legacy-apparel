/* Shared presentation layer. Existing catalog data and proof renderers remain authoritative. */
(()=>{
'use strict';
/* Refresh shared header stylesheet when a new storefront build is published. */
const cssVersion='91fdd74-bright-left-v5';
for(const link of document.querySelectorAll('link[rel="stylesheet"]')){
 try{const u=new URL(link.href,document.baseURI);if(u.pathname.endsWith('/assets/storefront.css')){u.searchParams.set('v',cssVersion);if(link.href!==u.href)link.href=u.href;}}catch(_e){}
}

const root=new URL('../',document.currentScript.src),url=p=>new URL(p,root).href;
const collections=[['law','Law Enforcement','line-images/law-enforcement.jpg','Honor the commitment. Carry the legacy.','#1769AA'],['doc','Department of Corrections','line-images/corrections.jpg','Strength behind the walls. Honor beyond them.','#D7D9DC'],['first','First Responder','assets/first-responders/collection-group.jpg','Fire & Rescue · EMS / Paramedics · Dispatch · Water Rescue','#F47721'],['gym','Gym Attire','line-images/athletics.jpg','Built with purpose. Earned with every rep.','#F47721'],['memorial','Memorial','line-images/memorial.jpg','In memory of Andrew John Faught. A legacy that lives on.','#1769AA']];
const link=k=>k==='first'?url('assets/first-responders/index.html'):url('index.html?collection='+k);
const old=document.querySelector('body>header');if(old)old.classList.add('previous-header');
const chrome=document.createElement('div');chrome.className='aj-chrome';chrome.innerHTML=`<header class="aj-masthead"><img class="aj-drew uniform" src="${url('assets/drew-uniform-approved.jpg')}" alt="Andrew John Faught — Illinois Department of Corrections uniform"><a class="aj-wordmark" href="${url('index.html')}" aria-label="AJ Legacy Apparel homepage"><img src="${url('assets/logo.png')}" alt="AJ mountain shield"><div><strong>AJ LEGACY</strong><span>APPAREL</span><small class="aj-motto">PROTECT <i>·</i> <b>HONOR</b> <i>·</i> INSPIRE</small><em>In Memory of Andrew John Faught</em></div></a><img class="aj-drew civilian" src="${url('assets/drew-civilian-approved.jpg')}" alt="Drew — approved civilian photograph"></header><nav class="aj-navigation" aria-label="Main navigation"><a href="${url('index.html')}#memorial">Our Story</a><a href="${url('index.html')}#collection-navigation">Collections</a><a href="${url('index.html?collection=limited')}">Limited Edition</a><a href="${url('index.html')}#customization-options">Customization</a><a href="${url('index.html')}#giving">Giving Back</a><a href="${url('contact.html')}">Contact Us</a><span class="aj-prelaunch">COMING SOON · CHECKOUT DISABLED</span></nav><section class="aj-collection-strip" aria-label="Apparel collections">${collections.map(([k,n,img])=>`<a href="${link(k)}" data-collection="${k}"><img src="${url(img)}" alt="${n} approved group merchandise"><strong>${n}<small>COLLECTION</small></strong></a>`).join('')}</section><section class="aj-collection-banner" aria-label="Selected collection"><div><span>APPAREL WITH PURPOSE</span><h1></h1><p></p></div><img alt=""></section>`;
document.body.prepend(chrome);
chrome.querySelector('.aj-collection-strip').id='collection-navigation';
document.querySelectorAll('a[href]').forEach(anchor=>{if(anchor.hash==='#collections')anchor.hash='collection-navigation'});
// Restore section navigation after the legacy renderer resets the scroll position.
const sectionIds=new Set(['memorial','collection-navigation','customization-options','giving']);
function scrollToSection(){
 const id=location.hash.slice(1)==='collections'?'collection-navigation':location.hash.slice(1);
 if(!sectionIds.has(id))return;
 const target=document.getElementById(id);if(!target)return;
 target.scrollIntoView({block:'start',behavior:'instant'});
}
chrome.querySelector('.aj-navigation').addEventListener('click',event=>{
 const anchor=event.target.closest('a');if(!anchor)return;
 const destination=new URL(anchor.href);
 if(destination.pathname===location.pathname&&destination.search===location.search&&sectionIds.has(destination.hash.slice(1))){
  event.preventDefault();history.pushState(null,'',destination.href);scrollToSection();
 }
});
window.addEventListener('hashchange',scrollToSection);
window.addEventListener('load',scrollToSection);
const banner=chrome.querySelector('.aj-collection-banner');
function setCollection(k){const c=collections.find(c=>c[0]===k)||(k==='limited'?['limited','Limited Edition','assets/events/legacy-strength-2027.png','Legacy of Strength · February 20, 2027','#1769AA']:null);banner.hidden=!c;if(!c)return;banner.style.setProperty('--collection-accent',c[4]);banner.querySelector('h1').textContent=c[1]+' Collection';banner.querySelector('p').textContent=c[3];banner.querySelector('img').src=url(c[2]);banner.querySelector('img').alt=c[1]+' merchandise';chrome.querySelectorAll('[data-collection]').forEach(a=>{a.classList.toggle('selected',a.dataset.collection===k);if(a.dataset.collection===k)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});}
function disabledCheckout(parent){if(parent.querySelector('.aj-checkout'))return;const box=document.createElement('div');box.className='aj-checkout';box.innerHTML='<p>COMING SOON</p><button type="button" disabled>Checkout unavailable during prelaunch</button><small>Family & supplier review · No orders or payments</small>';parent.append(box)}
if(window.AJStore){
 document.body.classList.add('aj-store');
 document.getElementById('back-lines').textContent='← Back to collections';
 const store=window.AJStore,custom=document.querySelector('.customize-screen'),grid=document.getElementById('product-grid');
 const params=new URLSearchParams(location.search),key=params.get('collection')||params.get('line'),actual=key==='memorial'?'limited':key;
 const sub=params.get('subline')||params.get('sub');
 const collectionURL=(k,subline)=>url('index.html?collection='+encodeURIComponent(k)+(subline?'&subline='+encodeURIComponent(subline):''));
 // Each step has its own address and a normal browser navigation.
 document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',event=>{event.stopImmediatePropagation();location.assign(collectionURL(button.dataset.open))},true));
 document.querySelectorAll('#cards .card').forEach(card=>{card.style.cursor='pointer';card.addEventListener('click',event=>{if(event.target.closest('a,button'))return;location.assign(card.dataset.line==='first'?link('first'):collectionURL(card.dataset.line))})});
 // Append the selected designs so existing product URLs retain their indices.
 if(actual==='gym'){
  const selectedGymDesigns=[
   ['gym-01.jpg','Sun Warrior — Bigger Than the Sun'],
   ['gym-02.jpg','Eclipse Deadlift — Bigger Than the Sun'],
   ['gym-03.jpg','Cane Corso — Bigger Than the Sun'],
   ['gym-04.jpg','Pit Bull — Built for Strength'],
   ['gym-05.jpg','Cane Corso — Discipline Builds Beasts'],
   ['gym-06.jpg','Pit Bull — Loyalty Builds Strength'],
   ['gym-07-quote-proof.svg','Mind Over Body — Andrew Faught'],
  ];
  for(const [file,title] of selectedGymDesigns){
   const img='selected-'+file.split('.')[0];
   const quoteDesign=file.endsWith('.svg');
   assets[img]=url('assets/gym-selected/'+file);
   store.lines.gym.push({
    img,title,kind:'shirt',flag:'none',concept:true,quoteDesign,
    verse:quoteDesign?'Do the things you don’t want to do to show your body that your mind is the boss.':'',
    detail:quoteDesign?'Drew’s words on training and discipline.':'Selected Gym Attire artwork.',
   });
  }
 }
 if(actual&&store.lines[actual]){
  store.openLine(actual);setCollection(key);document.body.dataset.activeCollection=key;
  // The legacy renderer updates hashes. Keep the explicit route authoritative.
  history.replaceState(null,'',url('index.html?'+params.toString()));
  const entries=store.lines[actual];
  if(params.has('product')&&Number.isInteger(Number(params.get('product')))&&entries[Number(params.get('product'))]){
   const index=Number(params.get('product'));store.openItem(entries[index],index);
   if(actual==='gym'){
    const garment=document.getElementById('garment-style');
    const form=document.getElementById('custom-form');
    if(garment){
     garment.add(new Option('Tank Top'));
     if(/tank/i.test(entries[index].title))garment.value='Tank Top';
     const note=document.createElement('p');
     note.className='note';
     note.textContent='Tank tops are available in Men’s, Women’s and Unisex fits. The artwork preview uses the approved reference image.';
     garment.closest('label').after(note);
     const reviewButton=form.querySelector('#review-customizations,#quote-review');
     reviewButton?.addEventListener('click',()=>{
      const review=document.getElementById('finished-design');
      if(!review||garment.value!=='Tank Top')return;
      const fit=form.querySelector('#fit,#quote-fit')?.value;
      const style=document.createElement('p');
      style.textContent=[fit,'Tank Top'].filter(Boolean).join(' · ');
      review.querySelector('h3')?.after(style);
     });
    }
   }
   // The shared placement studio does not have these artwork files in its design picker.
   if(entries[index].img.startsWith('selected-gym-')){
    const studioLink=document.getElementById('interactive-studio-link');
    if(studioLink)studioLink.hidden=true;
   }
   const shell=document.createElement('div');shell.className='aj-product-workspace aj-dedicated-customizer';
   const center=document.createElement('section');center.className='aj-preview-column';center.setAttribute('aria-label','Garment preview');
   const controls=document.createElement('section');controls.className='aj-controls-column';controls.setAttribute('aria-label','Customization options');
   for(const id of ['garment-preview','artwork-reference']){const element=document.getElementById(id);if(element)center.append(element)}
   if(!center.children.length)center.append(document.getElementById('selected-product-image'));
   controls.append(document.getElementById('flow-product'),document.getElementById('custom-form'));disabledCheckout(controls);
   shell.append(center,controls);custom.append(shell);
   history.replaceState(null,'',url('index.html?'+params.toString()));
  }else{
   grid.addEventListener('click',event=>{const tile=event.target.closest('.product-tile');if(!tile)return;event.stopImmediatePropagation();const index=[...grid.children].indexOf(tile);location.assign(collectionURL(key,sub)+'&product='+index)},true);
   if(actual==='law'||actual==='doc'){
    const groups=document.createElement('nav');groups.className='aj-subline-links';groups.setAttribute('aria-label','Choose a sub-line');
    const options=actual==='law'?[['all','All Law Enforcement designs'],['k9','K9 / Canine']]:[['all','All DOC designs'],['trt','Tactical Response Team (TRT)']];
    for(const [id,label] of options){const anchor=document.createElement('a');anchor.textContent=label;anchor.href=id==='k9'?url('k9-collection.html'):collectionURL(key,id==='all'?null:id);groups.append(anchor)}
    grid.before(groups);
    if(sub==='trt')for(const [index,tile] of [...grid.children].entries())tile.hidden=!/TRT|tactical response/i.test(entries[index].title+' '+(entries[index].detail||''));
   }
  }
 }else{store.showPage('lines');setCollection(null)}
 document.getElementById('back-products').addEventListener('click',event=>{event.stopImmediatePropagation();location.assign(collectionURL(key,sub))},true);
 document.getElementById('back-lines').addEventListener('click',event=>{event.stopImmediatePropagation();location.assign(url('index.html#collections'))},true);

}else{
 document.body.classList.add('aj-service-store');const k=location.pathname.includes('first-responders')?'first':'law';setCollection(k);
 const wrap=document.querySelector('main.wrap');const grid=document.getElementById('grid'),preview=document.querySelector('section.preview');
 if(wrap&&grid&&preview){
  const params=new URLSearchParams(location.search),requested=params.get('product');
  const category=params.get('category')||(k==='first'?'fire':'k9');
  const original=document.querySelector('body>img.hero');if(original)original.hidden=true;
  const tabs=document.getElementById('tabs');
  // Capture before inline legacy handlers so category and product choices open a new screen.
  if(tabs)tabs.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;event.stopImmediatePropagation();const code=button.getAttribute('onclick')||'';const match=code.match(/group='([^']+)'/);if(match)location.assign(location.pathname+'?category='+encodeURIComponent(match[1]))},true);
  grid.addEventListener('click',event=>{const tile=event.target.closest('.tile');if(!tile)return;const button=tile.querySelector('button');if(!button)return;event.stopImmediatePropagation();const match=(button.getAttribute('onclick')||'').match(/item='([^']+)'/);if(match)location.assign(location.pathname+'?category='+encodeURIComponent(category)+'&product='+encodeURIComponent(match[1]))},true);
  if(requested){
   const models=wrap.querySelector('.modelgrid');if(models){models.hidden=true;if(models.previousElementSibling?.tagName==='H2')models.previousElementSibling.hidden=true;if(models.nextElementSibling)models.nextElementSibling.hidden=true}
   const button=[...grid.querySelectorAll('button')].find(button=>(button.getAttribute('onclick')||'').includes("item='"+requested+"'"));
   if(button){button.onclick();preview.hidden=false;grid.hidden=true;if(tabs)tabs.hidden=true;
    const back=document.createElement('a');back.className='aj-related';back.href=location.pathname+'?category='+encodeURIComponent(category);back.textContent='← Back to individual designs';wrap.prepend(back);
    preview.classList.add('aj-service-preview','aj-dedicated-service');disabledCheckout(preview.lastElementChild);
   }else preview.hidden=true;
  }else{preview.hidden=true;grid.classList.add('aj-individual-designs')}
 }
 const breedLayout=document.querySelector('.layout');
 if(document.getElementById('breed')&&breedLayout)breedLayout.classList.add('aj-dedicated-breed');

 const form=document.querySelector('.form')||document.querySelector('.customizer');if(form&&!document.querySelector('.aj-checkout'))disabledCheckout(form);
}
requestAnimationFrame(scrollToSection);
})();
