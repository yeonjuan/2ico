import type * as t from "./types";

export default function createBitmapImageData(canvas: t.Canvas) {
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const rgbaData8 = imageData.data;
  const bgraData8 = new Uint8ClampedArray(imageData.data.length);
  for (let i = 0; i < rgbaData8.length; i += 4) {
    const r = rgbaData8[i];
    const g = rgbaData8[i + 1];
    const b = rgbaData8[i + 2];
    const a = rgbaData8[i + 3];
    bgraData8[i] = b;
    bgraData8[i + 1] = g;
    bgraData8[i + 2] = r;
    bgraData8[i + 3] = a;
  }

  const bgraData32 = new Uint32Array(bgraData8.buffer);
  const bgraData32Rotated = new Uint32Array(bgraData32.length);
  for (let i = 0; i < bgraData32.length; i++) {
    const xPos = i % canvas.width;
    const yPos = Math.floor(i / canvas.width);
    const xPosRotated = xPos;
    const yPosRotated = canvas.height - 1 - yPos;
    const indexRotated = yPosRotated * canvas.width + xPosRotated;
    const pixel = bgraData32[i];
    bgraData32Rotated[indexRotated] = pixel;
  }
  return bgraData32Rotated.buffer;
}
