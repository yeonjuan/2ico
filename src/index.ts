import type * as t from "./types";
import createIconDir from "./create-icon-dir";
import resizeCanvas from "./resize-canvas";
import createBitmapBinary from "./create-bitmap-binary";
import createIconDirEntry from "./create-icon-dir-entry";
import toBinary from "./to-binary";

export default function toIco(
  canvas: t.Canvas,
  sizes: number[] = [16, 32, 48]
) {
  const numOfImages = sizes.length;
  const iconDir = toBinary(createIconDir(numOfImages));
  const iconDirEntries: string[] = [];

  let bitmapOffset = 6 + 16 * numOfImages;
  let bitmapBinaries: string[] = [];
  sizes.forEach((size) => {
    const resized = resizeCanvas(canvas, size, size);
    const bitmapBinary = createBitmapBinary(resized);
    const iconDirEntry = createIconDirEntry(
      size,
      size,
      bitmapOffset,
      bitmapBinary.length
    );
    iconDirEntries.push(toBinary(iconDirEntry));
    const area = size * size;
    bitmapOffset += 40 + 4 * area + (2 * area) / 8;
    bitmapBinaries.push(bitmapBinary);
  });
  return (
    "data:image/x-icon;base64," +
    btoa(iconDir + iconDirEntries.join("") + bitmapBinaries.join(""))
  );
}
