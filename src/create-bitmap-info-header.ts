import BufferBuilder from "./buffer-builder";

/**
 * create BITMAPINFOHEADER structure buffer
 * @param {number} size size of the image
 * @see https://en.wikipedia.org/wiki/BMP_file_format
 */
export default function createBitmapInfoHeader(width: number, height: number) {
  return BufferBuilder.create(40)
    .add("4B", 40) // the size of this header, in bytes (40)
    .add("4BSigned", width) // the bitmap width in pixels (signed integer)
    .add("4BSigned", height * 2) // 	the bitmap height in pixels (signed integer)
    .add("2B", 1) // the number of color planes (must be 1)
    .add("2B", 32) // the number of bits per pixel, which is the color depth of the image. Typical values are 1, 4, 8, 16, 24 and 32.
    .add("4B", 0) // the compression method being used. See the next table for a list of possible values
    .add("4B", 0) // the image size. This is the size of the raw bitmap data; a dummy 0 can be given for BI_RGB bitmaps.
    .add("4B", 0) // the horizontal resolution of the image. (pixel per metre, signed integer)
    .add("4B", 0) // the vertical resolution of the image. (pixel per metre, signed integer)
    .add("4B", 0) // the number of colors in the color palette, or 0 to default to 2n
    .add("4B", 0) // 	the number of important colors used, or 0 when every color is important; generally ignored
    .build();
}
