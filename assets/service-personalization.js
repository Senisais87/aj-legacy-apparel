(() => {
 const chest = ['Left chest', 'Right chest'];
 const shoulders = 'Across back shoulders';
 const spine = 'Down back spine';
 const hems = ['Bottom front', 'Bottom back'];
 const locations = {
  Name: [...chest, shoulders, spine],
  Rank: [...chest, shoulders, spine, ...hems],
  'EOW date': [...chest, shoulders, ...hems],
  Facility: [...chest, shoulders, ...hems],
 };
 const boxes = {
  'Left chest': [0, .64, .30, .13],
  'Right chest': [0, .36, .30, .13],
  [shoulders]: [1, .50, .32, .33],
  [spine]: [1, .50, .55, .26],
  'Bottom front': [0, .50, .63, .32],
  'Bottom back': [1, .50, .63, .32],
 };
 const supportedStyles = ['T-shirt', 'Hoodie'];
 function paint(context, marks, size) {
  const count = {};
  for (const {label, value, placement} of marks) {
   const [side, x, y, width] = boxes[placement];
   const row = count[placement] || 0;
   count[placement] = row + 1;
   const vertical = placement === spine;
   context.save();
   context.translate((side + x + (vertical ? row * .025 : 0)) * size,
    (y + (vertical ? 0 : row * .023)) * size);
   if (vertical) context.rotate(Math.PI / 2);
   context.font = '700 ' + Math.round(size * .017) + 'px system-ui';
   context.textAlign = 'center';
   context.textBaseline = 'middle';
   context.strokeStyle = '#151515';
   context.fillStyle = '#fff';
   context.lineWidth = 2;
   const text = label === 'EOW date' ? 'EOW ' + value : value;
   context.strokeText(text, 0, 0, width * size);
   context.fillText(text, 0, 0, width * size);
   context.restore();
  }
 }
 function mount(form, {service, flag, style, preview, standalone = false, update}) {
  const group = document.createElement('fieldset');
  group.className = 'aj-personalization-fields';
  const legend = document.createElement('legend');
  legend.textContent = 'Garment personalization';
  group.append(legend);
  const fields = ['Name', 'Rank', ...(service ? ['Facility', 'EOW date'] : [])].map(label => {
   const row = document.createElement('div');
   const caption = document.createElement('label');
   caption.textContent = label;
   const input = document.createElement('input');
   input.type = label === 'EOW date' ? 'date' : 'text';
   input.maxLength = 48;
   if (input.type === 'text') input.placeholder = 'Optional';
   caption.append(input);
   const position = document.createElement('label');
   position.textContent = label + ' placement';
   const select = document.createElement('select');
   for (const location of locations[label]) select.add(new Option(location));
   select.value = label === 'Rank' ? 'Right chest' : label === 'EOW date' ? 'Bottom back' :
    label === 'Facility' ? shoulders : 'Left chest';
   position.append(select);
   row.append(caption, position);
   group.append(row);
   return {label, row, input, select};
  });
  const review = form.querySelector('.continue-customize');
  form.insertBefore(group, review || null);
  const proof = document.createElement('figure');
  proof.className = 'aj-personalization-proof';
  const caption = document.createElement('figcaption');
  caption.textContent = standalone ? 'Front and back personalization placement · Main artwork shown in the product preview' :
   'Front and back personalization placement';
  const canvas = document.createElement('canvas');
  canvas.width = 840;
  canvas.height = 446;
  canvas.setAttribute('role', 'img');
  proof.append(caption, canvas);
  proof.hidden = true;
  if (preview.id === 'garment-preview') preview.append(proof);
  else preview.after(proof);
  const images = new Map();
  function image(path) {
   if (!images.has(path)) {
    const img = new Image();
    img.onload = draw;
    img.src = path;
    images.set(path, img);
   }
   return images.get(path);
  }
  function marks() {
   const currentStyle = style();
   return fields.filter(({label, input}) => input.value.trim() &&
    (label !== 'EOW date' || flag() && supportedStyles.includes(currentStyle)))
    .map(({label, input, select}) => ({label, value: input.value.trim(), placement: select.value}));
  }
  function draw() {
   if (!proof.isConnected) return;
   const currentStyle = style();
   for (const {label, row} of fields) {
    row.hidden = label === 'EOW date' && !(flag() && supportedStyles.includes(currentStyle));
   }
   const entries = marks();
   proof.hidden = !standalone || !entries.length;
   if (proof.hidden) return;
   const template = window.AJGarments?.styles[currentStyle] ? currentStyle : 'T-shirt';
   const catalog = window.AJGarments;
   const front = image(catalog.image(template));
   const back = image(catalog.image(template, 'back'));
   if (!front.naturalWidth || !back.naturalWidth) return;
   const context = canvas.getContext('2d');
   const size = 420;
   context.fillStyle = '#222830';
   context.fillRect(0, 0, canvas.width, canvas.height);
   context.drawImage(front, 0, 0, size, size);
   context.drawImage(back, size, 0, size, size);
   paint(context, entries, size);
   context.fillStyle = '#fff';
   context.font = '600 14px system-ui';
   context.textAlign = 'center';
   context.fillText('FRONT', size * .5, 437);
   context.fillText('BACK', size * 1.5, 437);
   canvas.setAttribute('aria-label', entries.map(mark => mark.label + ': ' + mark.value + ', ' + mark.placement).join('; '));
  }
  group.addEventListener('input', () => {draw(); update?.()});
  group.addEventListener('change', () => {draw(); update?.()});
  form.addEventListener('change', draw);
  draw();
  return {draw, marks};
 }
 function connectProduct(screen, collection) {
  let connectedForm;
  function attach() {
   const form = screen.querySelector('#custom-form');
   const style = form?.querySelector('#garment-style');
   const preview = screen.querySelector('#garment-preview');
   if (!style || !preview || form === connectedForm || window.AJGarments.styles[style.value]?.lower) return;
   connectedForm = form;
   const legacyName = [...form.querySelectorAll('#personal option')].find(option => option.value === 'Name');
   legacyName?.remove();
   const note = [...form.querySelectorAll('.note')].find(node => node.textContent.startsWith('Only Name and Unit'));
   if (note) note.textContent = 'Use Garment personalization for independent name and rank placement.';
   const personalization = mount(form, {
    service: ['law', 'doc'].includes(collection),
    flag: () => {
     const control = form.querySelector('#flag');
     return control && !control.closest('label').hidden;
    },
    style: () => style.value,
    preview,
    standalone: true,
    update: () => screen.querySelector('#finished-design')?.remove(),
   });
   form.addEventListener('click', event => {
    if (!event.target.closest('.continue-customize')) return;
    const review = screen.querySelector('#finished-design');
    for (const mark of personalization.marks()) {
     if (!review) break;
     const detail = document.createElement('p');
     detail.textContent = mark.label + ' · ' + mark.value + ' · ' + mark.placement;
     review.append(detail);
    }
   });
  }
  attach();
  new MutationObserver(attach).observe(screen, {subtree: true, childList: true});
 }
 window.AJServicePersonalization = {mount, connectProduct};
})();
