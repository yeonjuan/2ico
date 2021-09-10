import type * as t from "./types";
import createBitmapInfoHeader from "./create-bitmap-info-header";
import createBitmapImageData from "./create-bitmap-image-data";
import toBinary from "./to-binary";

export default function createBitmapBinary(canvas: t.Canvas): string {
  const size = canvas.width;
  const header = createBitmapInfoHeader(size, size);
  const imageData = createBitmapImageData(canvas);
  const bitmapMask = new Uint8Array((size * size) / 4).fill(0);
  return [header, imageData, bitmapMask].map(toBinary).join("");
}
