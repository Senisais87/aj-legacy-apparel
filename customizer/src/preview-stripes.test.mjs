import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const window = {};
runInNewContext(readFileSync(new URL('../../assets/preview-stripes.js', import.meta.url), 'utf8'), {window});
const {paint} = window.AJPreviewStripes;

function context(pixels) {
  const data = new Uint8ClampedArray(pixels.flat());
  return {
    canvas: {width: pixels.length, height: 1},
    getImageData(x, y, width, height) {
      return {width, height, data: data.slice(x * 4, (x + width) * 4)};
    },
    putImageData(image, x) {
      data.set(image.data, x * 4);
    },
    pixel(x) {
      return [...data.slice(x * 4, x * 4 + 4)];
    },
  };
}

test('a chosen color updates only the stripe and preserves its opacity', () => {
  const blue = [20, 80, 255, 220];
  const brown = [150, 93, 40, 255];
  const preview = context([blue, blue, brown, blue]);
  paint(preview, ['blue', 'x', [[.25, 0, .50, 1]]], ['#9141be']);
  assert.deepEqual(preview.pixel(0), blue);
  assert.deepEqual(preview.pixel(1), [145, 65, 190, 220]);
  assert.deepEqual(preview.pixel(2), brown);
  assert.deepEqual(preview.pixel(3), blue);
});

test('multiple colors fill adjacent bands across the existing stripe', () => {
  const blue = [20, 80, 255, 255];
  const preview = context([blue, blue, blue, blue]);
  paint(preview, ['blue', 'x', [[.25, 0, .50, 1]]], ['#ff0000', '#00ff00'], [.25, 0, .50, 1]);
  assert.deepEqual(preview.pixel(0), [255, 0, 0, 255]);
  assert.deepEqual(preview.pixel(1), [255, 0, 0, 255]);
  assert.deepEqual(preview.pixel(2), [0, 255, 0, 255]);
  assert.deepEqual(preview.pixel(3), [0, 255, 0, 255]);
});
