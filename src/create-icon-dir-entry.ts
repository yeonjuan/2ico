import BufferBuilder from "./buffer-builder";

/**
 * create ICONDIRENTRY structure buffer
 * @param {number}imageSize
 * @param {number} offset
 * @see https://en.wikipedia.org/wiki/ICO_(file_format)#Icon_resource_structure
 * @returns
 */
export default function createIconDirEntry(
  width: number,
  height: number,
  offset: number,
  bitmapSize: number
) {
  return BufferBuilder.create(16)
    .add("1B", width) // 	Specifies image width in pixels. Can be any number between 0 and 255. Value 0 means image width is 256 pixels.
    .add("1B", height) // Specifies image height in pixels. Can be any number between 0 and 255. Value 0 means image height is 256 pixels
    .add("1B", 0) // Specifies number of colors in the color palette. Should be 0 if the image does not use a color palette.
    .add("1B", 0) // Reserved. Should be 0
    .add("2B", 1) // In ICO format: Specifies color planes. Should be 0 or 1
    .add("2B", 32) // In ICO format: Specifies bits per pixel.
    .add("4B", bitmapSize) // Specifies the size of the image's data in bytes
    .add("4B", offset) // Specifies the offset of BMP or PNG data from the beginning of the ICO/CUR file
    .build();
}
