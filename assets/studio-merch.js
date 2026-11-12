/* Use separate catalog cutouts so artwork and print-placement sources stay original. */
(() => {
 'use strict';
 const root=new URL('../',document.currentScript.src);
 const cutouts={
  "embedded/shirt0_0": "embedded-shirt0_0.webp",
  "assets/matthew-law.svg": "assets-matthew-law.webp",
  "assets/concepts/law-scripture.webp": "assets-concepts-law-scripture.webp",
  "embedded/hatdept0": "embedded-hatdept0.webp",
  "assets/mockups/individual/crewneck-aj.webp": "assets-mockups-individual-crewneck-aj.webp",
  "assets/merch-individual/shield-hoodie.webp": "assets-merch-individual-shield-hoodie.webp",
  "assets/merch-individual/vertical-flag-hoodie.webp": "assets-merch-individual-vertical-flag-hoodie.webp",
  "assets/merch-individual/badge-story.webp": "assets-merch-individual-badge-story.webp",
  "assets/merch-individual/honor-service-sacrifice.webp": "assets-merch-individual-honor-service-sacrifice.webp",
  "assets/merch-individual/peacemakers-tee.webp": "assets-merch-individual-peacemakers-tee.webp",
  "assets/merch-individual/blue-line-quarter-zip.webp": "assets-merch-individual-blue-line-quarter-zip.webp",
  "assets/merch-individual/service-above-self.webp": "assets-merch-individual-service-above-self.webp",
  "assets/merch-individual/law-enforcement-hoodie.webp": "assets-merch-individual-law-enforcement-hoodie.webp",
  "assets/merch-individual/shield-joggers.webp": "assets-merch-individual-shield-joggers.webp",
  "assets/merch-individual/shield-trucker.webp": "assets-merch-individual-shield-trucker.webp",
  "assets/merch-individual/thin-blue-line-cap.webp": "assets-merch-individual-thin-blue-line-cap.webp",
  "embedded/shirt1_0": "embedded-shirt1_0.webp",
  "assets/matthew-doc.svg": "assets-matthew-doc.webp",
  "assets/concepts/doc-scripture.webp": "assets-concepts-doc-scripture.webp",
  "embedded/hatdept1": "embedded-hatdept1.webp",
  "assets/merch-individual/corrections-flag-hoodie.webp": "assets-merch-individual-corrections-flag-hoodie.webp",
  "assets/merch-individual/trt-tee.webp": "assets-merch-individual-trt-tee.webp",
  "assets/merch-individual/correctional-officer-tee.webp": "assets-merch-individual-correctional-officer-tee.webp",
  "assets/merch-individual/doc-shield-hoodie.webp": "assets-merch-individual-doc-shield-hoodie.webp",
  "assets/merch-individual/orange-line-flag-top.webp": "assets-merch-individual-orange-line-flag-top.webp",
  "assets/merch-individual/doc-joggers.webp": "assets-merch-individual-doc-joggers.webp",
  "assets/merch-individual/doc-shield-cap.webp": "assets-merch-individual-doc-shield-cap.webp",
  "assets/merch-individual/doc-tumbler.webp": "assets-merch-individual-doc-tumbler.webp",
  "assets/merch-individual/orange-line-patch.webp": "assets-merch-individual-orange-line-patch.webp",
  "embedded/shirt2_0": "embedded-shirt2_0.webp",
  "embedded/shirt3_0": "embedded-shirt3_0.webp",
  "embedded/shirt4_0": "embedded-shirt4_0.webp",
  "embedded/hatdept2": "embedded-hatdept2.webp",
  "embedded/hatdept3": "embedded-hatdept3.webp",
  "embedded/hatdept4": "embedded-hatdept4.webp",
  "assets/concepts/gym-renew.webp": "assets-concepts-gym-renew.webp",
  "assets/concepts/gym-strength-hoodie.webp": "assets-concepts-gym-strength-hoodie.webp",
  "assets/concepts/gym-earned.webp": "assets-concepts-gym-earned.webp",
  "assets/concepts/gym-rep.webp": "assets-concepts-gym-rep.webp",
  "assets/concepts/gym-discipline.webp": "assets-concepts-gym-discipline.webp",
  "assets/concepts/gym-undefeated.webp": "assets-concepts-gym-undefeated.webp",
  "assets/concepts/gym-built-to-rise.webp": "assets-concepts-gym-built-to-rise.webp",
  "assets/concepts/gym-legacy-veins.webp": "assets-concepts-gym-legacy-veins.webp",
  "assets/merch-individual/selected-gym-01.webp": "assets-merch-individual-selected-gym-01.webp",
  "assets/merch-individual/selected-gym-02.webp": "assets-merch-individual-selected-gym-02.webp",
  "assets/merch-individual/selected-gym-03.webp": "assets-merch-individual-selected-gym-03.webp",
  "assets/merch-individual/selected-gym-04.webp": "assets-merch-individual-selected-gym-04.webp",
  "assets/merch-individual/selected-gym-05.webp": "assets-merch-individual-selected-gym-05.webp",
  "assets/merch-individual/selected-gym-06.webp": "assets-merch-individual-selected-gym-06.webp",
  "assets/merch-individual/selected-gym-07-quote-proof.webp": "assets-merch-individual-selected-gym-07-quote-proof.webp",
  "assets/mockups/individual/shorts-aj.webp": "assets-mockups-individual-shorts-aj.webp",
  "assets/merch-individual/selected-gym-board-discipline-builds-freedom.webp": "assets-merch-individual-selected-gym-board-discipline-builds-freedom.webp",
  "assets/merch-individual/selected-gym-board-iron-sharpens-iron.webp": "assets-merch-individual-selected-gym-board-iron-sharpens-iron.webp",
  "assets/merch-individual/selected-gym-board-persevere.webp": "assets-merch-individual-selected-gym-board-persevere.webp",
  "assets/merch-individual/selected-gym-board-strength-through-christ.webp": "assets-merch-individual-selected-gym-board-strength-through-christ.webp",
  "assets/merch-individual/selected-gym-board-aj-legacy-training-tee.webp": "assets-merch-individual-selected-gym-board-aj-legacy-training-tee.webp",
  "assets/gym-board/aj-legacy-training-cap.webp": "assets-gym-board-aj-legacy-training-cap.webp",
  "assets/gym-board/thin-blue-line-training-cap.webp": "assets-gym-board-thin-blue-line-training-cap.webp",
  "assets/gym-board/aj-legacy-shaker.webp": "assets-gym-board-aj-legacy-shaker.webp",
  "assets/merch-individual/gym-chest-logo-tee.webp": "assets-merch-individual-gym-chest-logo-tee.webp",
  "assets/merch-individual/forever-27.webp": "assets-merch-individual-forever-27.webp",
  "assets/events/legacy-strength-2027.png": "assets-events-legacy-strength-2027.webp",
  "memorial-images/eclipse-memorial-tee.jpg": "memorial-images-eclipse-memorial-tee.webp",
  "assets/concepts/memorial-until.webp": "assets-concepts-memorial-until.webp",
  "assets/concepts/memorial-faith-hoodie.webp": "assets-concepts-memorial-faith-hoodie.webp",
  "assets/concepts/memorial-lift.webp": "assets-concepts-memorial-lift.webp",
  "assets/concepts/memorial-love.webp": "assets-concepts-memorial-love.webp",
  "assets/concepts/memorial-carry.webp": "assets-concepts-memorial-carry.webp",
  "assets/merch-individual/their-watch.webp": "assets-merch-individual-their-watch.webp",
  "assets/merch-individual/memorial-shield-hoodie.webp": "assets-merch-individual-memorial-shield-hoodie.webp",
  "assets/merch-individual/psalm-34.webp": "assets-merch-individual-psalm-34.webp",
  "assets/merch-individual/memorial-line-cap.webp": "assets-merch-individual-memorial-line-cap.webp",
  "assets/merch-individual/memorial-shield-cap.webp": "assets-merch-individual-memorial-shield-cap.webp",
  "assets/merch-individual/memorial-tumbler.webp": "assets-merch-individual-memorial-tumbler.webp",
  "assets/merch-individual/memorial-plaque.webp": "assets-merch-individual-memorial-plaque.webp",
  "assets/first-responders/individual/fire-rescue-crest-tee.webp": "assets-first-responders-individual-fire-rescue-crest-tee.webp",
  "assets/first-responders/individual/fire-rescue-helmet-tee.webp": "assets-first-responders-individual-fire-rescue-helmet-tee.webp",
  "assets/merch-individual/responder-cap.webp": "assets-merch-individual-responder-cap.webp",
  "assets/merch-individual/fire-cap.webp": "assets-merch-individual-fire-cap.webp",
  "assets/first-responders/individual/ems-star-tee.webp": "assets-first-responders-individual-ems-star-tee.webp",
  "assets/first-responders/individual/ems-flag-tee.webp": "assets-first-responders-individual-ems-flag-tee.webp",
  "assets/merch-individual/ems-cap.webp": "assets-merch-individual-ems-cap.webp",
  "assets/first-responders/individual/dispatch-headset-tee.webp": "assets-first-responders-individual-dispatch-headset-tee.webp",
  "assets/first-responders/individual/dispatch-flag-tee.webp": "assets-first-responders-individual-dispatch-flag-tee.webp",
  "assets/merch-individual/dispatch-cap.webp": "assets-merch-individual-dispatch-cap.webp",
  "assets/first-responders/water-life-tee.png": "assets-first-responders-water-life-tee.webp",
  "assets/first-responders/water-swift-tee.png": "assets-first-responders-water-swift-tee.webp",
  "assets/k9/individual/labrador.png": "assets-k9-individual-labrador.webp",
  "assets/k9/individual/doberman.png": "assets-k9-individual-doberman.webp",
  "assets/k9/individual/dutch.png": "assets-k9-individual-dutch.webp",
  "assets/k9/individual/rottweiler.png": "assets-k9-individual-rottweiler.webp",
  "assets/k9/breeds/german-shepherd-duo.jpg": "assets-k9-breeds-german-shepherd-duo.webp",
  "assets/k9/breeds/belgian-malinois-duo.jpg": "assets-k9-breeds-belgian-malinois-duo.webp",
  "assets/k9/individual/sar-bloodhound.png": "assets-k9-individual-sar-bloodhound.webp",
  "assets/k9/individual/sar-labrador.png": "assets-k9-individual-sar-labrador.webp",
  "assets/k9/k9-handler-partner-tee.jpg": "assets-k9-k9-handler-partner-tee.webp",
  "assets/k9/k9-strength-service-tee.jpg": "assets-k9-k9-strength-service-tee.webp",
  "assets/k9/k9-search-protect-tee.jpg": "assets-k9-k9-search-protect-tee.webp",
  "assets/first-responders/individual/dispatch-headset-hoodie.webp": "assets-first-responders-individual-dispatch-headset-hoodie.webp",
  "assets/first-responders/individual/fire-rescue-helmet-hoodie.webp": "assets-first-responders-individual-fire-rescue-helmet-hoodie.webp",
  "assets/first-responders/individual/dispatch-flag-hoodie.webp": "assets-first-responders-individual-dispatch-flag-hoodie.webp",
  "assets/first-responders/individual/ems-star-hoodie.webp": "assets-first-responders-individual-ems-star-hoodie.webp",
  "assets/first-responders/individual/ems-flag-hoodie.webp": "assets-first-responders-individual-ems-flag-hoodie.webp",
  "assets/first-responders/individual/fire-rescue-crest-hoodie.webp": "assets-first-responders-individual-fire-rescue-crest-hoodie.webp",
  "assets/first-responders/water-swift-hoodie.png": "assets-first-responders-water-swift-hoodie.webp",
  "assets/first-responders/water-life-hoodie.png": "assets-first-responders-water-life-hoodie.webp"
};
 function source(original,key){
  if(!original)return null;
  const path=original.startsWith('data:')?'embedded/'+key:new URL(original,document.baseURI).pathname.slice(root.pathname.length);
  const cutout=cutouts[path];
  return cutout?new URL('assets/studio-merch/'+cutout,root).href:null;
 }
 function watch(container,selector){
  function apply(){
   for(const image of container.querySelectorAll(selector)){
    const replacement=source(image.getAttribute('src'));
    if(!replacement)continue;
    image.classList.add('aj-studio-merch');
    image.src=replacement;
   }
  }
  apply();
  new MutationObserver(apply).observe(container,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
 }
 window.AJStudioMerch={source,watch};
})();
