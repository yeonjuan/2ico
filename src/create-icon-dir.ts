import BufferBuilder from "./buffer-builder";

/**
 * create ICONDIR structure buffer
 * @param {number} numOfImages number of images
 * @see https://en.wikipedia.org/wiki/ICO_(file_format)
 */
export default function createIconDir(numOfImages: number): ArrayBuffer {
  return BufferBuilder.create(6)
    .add("2B", 0) // Reserved. Must always be 0.
    .add("2B", 1) // Specifies image type: 1 for icon (.ICO) image, 2 for cursor (.CUR) image. Other values are invalid.
    .add("2B", numOfImages) // 	Specifies number of images in the file.
    .build();
}
