/* Recolor only the printed stripe regions in the supplied artwork. */
(function () {
  const matches = {
    blue: (r, g, b) => b > r * 1.32 && b > g * 1.13 && b > 48,
    purple: (r, g, b) => b > g * 1.27 && r > g * 1.12 && b > 52,
    red: (r, g, b) => r > g * 1.65 && r > b * 1.55 && r > 65,
    orange: (r, g, b) => r > g * 1.22 && g > b * 1.37 && g > 40 && r > 85,
    gold: (r, g, b) => r > 92 && g > 70 && g > r * .59 && b < g * .66,
    silver: (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b) < 24 && r > 76,
  };

  const responder = {
    'fire-rescue-crest': ['red', 'x', [[.66,.075,.10,.36],[.66,.83,.10,.17]]],
    'fire-rescue-helmet': ['red', 'x', [[.68,.075,.115,.35],[.68,.77,.115,.23]]],
    'ems-flag': ['blue', 'x', [[.62,.25,.10,.46],[.62,.78,.10,.10]]],
    'dispatch-flag': ['gold', 'y', [[.22,.55,.64,.115]]],
    'water-life': ['orange', 'x', [[.43,.40,.16,.14],[.43,.64,.16,.08]]],
  };

  const matthewBack = ['orange', 'x', [[.775,.045,.047,.215],[.778,.676,.049,.292]]];
  const service = {
    'concept-law-scripture': [['blue', 'x', [[0,.24,.12,.20],[.735,.115,.042,.43]]]],
    'concept-doc-scripture': [['silver', 'y', [[.024,.312,.079,.013]]]],
    'shirt2_0-law': [matthewBack, ['blue', 'y', [[.005,.285,.095,.155]]]],
    'shirt2_0-doc': [matthewBack],
  };

  function k9(product) {
    if (product.original) return ['blue', 'y', [[.22,.40,.20,.26]]];
    if (product.family === 'handler') return [product.line.toLowerCase(), 'x', [[.54,.32,.10,.29]]];
    if (product.family === 'search') return [product.line.toLowerCase(), 'y', [[.29,.46,.44,.25]]];
    return [product.line.toLowerCase(), 'x', [[.31,.36,.25,.27]]];
  }

  function paint(context, recipe, colors, sourceBox = [0, 0, 1, 1]) {
    if (!recipe || !colors.length) return;
    const [hue, axis, regions] = recipe;
    const targets = colors.map(hex => hex.match(/[0-9a-f]{2}/gi).map(channel => parseInt(channel, 16)));
    const {width, height} = context.canvas;
    const [sx, sy, sw, sh] = sourceBox;
    for (const [left, top, w, h] of regions) {
      const x0 = Math.max(0, Math.floor((left - sx) / sw * width));
      const y0 = Math.max(0, Math.floor((top - sy) / sh * height));
      const x1 = Math.min(width, Math.ceil((left + w - sx) / sw * width));
      const y1 = Math.min(height, Math.ceil((top + h - sy) / sh * height));
      if (x1 <= x0 || y1 <= y0) continue;
      const image = context.getImageData(x0, y0, x1 - x0, y1 - y0);
      const {data} = image;
      // Split each printed stripe across its width when multiple colors are selected.
      const position = index => axis === 'x' ? index % image.width : Math.floor(index / image.width);
      let min = Infinity, max = -Infinity;
      const pixels = [];
      for (let i = 0; i < data.length; i += 4) {
        if (!data[i + 3] || !matches[hue](data[i], data[i + 1], data[i + 2])) continue;
        pixels.push(i);
        const offset = position(i / 4);
        min = Math.min(min, offset);
        max = Math.max(max, offset);
      }
      for (const i of pixels) {
        const target = targets[Math.floor((position(i / 4) - min) / (max - min + 1) * targets.length)];
        const shade = .6 + .4 * Math.max(data[i], data[i + 1], data[i + 2]) / 255;
        for (let channel = 0; channel < 3; channel++) data[i + channel] = target[channel] * shade;
      }
      context.putImageData(image, x0, y0);
    }
  }

  window.AJPreviewStripes = {paint, responder, service, k9};
})();
