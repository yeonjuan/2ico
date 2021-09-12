(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.toIco = factory());
}(this, (function () { 'use strict';

    class BufferBuilder {
        constructor(size) {
            this.offset = 0;
            this.buffer = new ArrayBuffer(size);
            this.dataView = new DataView(this.buffer);
            this.offset = 0;
        }
        static create(size) {
            return new BufferBuilder(size);
        }
        add(valueType, value) {
            const littleEndian = valueType === "1B" ? undefined : true;
            this.dataView[BufferBuilder.SETTER_MAP[valueType]](this.offset, value, littleEndian);
            this.offset += BufferBuilder.BYTE_MAP[valueType];
            return this;
        }
        build() {
            return this.buffer;
        }
    }
    BufferBuilder.SETTER_MAP = {
        "1B": "setUint8",
        "2B": "setUint16",
        "4B": "setUint32",
        "4BSigned": "setInt32",
    };
    BufferBuilder.BYTE_MAP = {
        "1B": 1,
        "2B": 2,
        "4B": 4,
        "4BSigned": 4,
    };

    /**
     * create ICONDIR structure buffer
     * @param {number} numOfImages number of images
     * @see https://en.wikipedia.org/wiki/ICO_(file_format)
     */
    function createIconDir(numOfImages) {
        return BufferBuilder.create(6)
            .add("2B", 0) // Reserved. Must always be 0.
            .add("2B", 1) // Specifies image type: 1 for icon (.ICO) image, 2 for cursor (.CUR) image. Other values are invalid.
            .add("2B", numOfImages) // 	Specifies number of images in the file.
            .build();
    }

    function resizeCanvas(canvas, width, height) {
        let currentCanvas = canvas;
        let curWidth = canvas.width;
        let curHeight = canvas.height;
        let resizedCanvas;
        while (curWidth / 2 >= width) {
            curWidth = curWidth / 2;
            curHeight = curHeight / 2;
            resizedCanvas = resize(currentCanvas, curWidth, curHeight);
            currentCanvas = resizedCanvas;
        }
        if (curWidth > width) {
            resizedCanvas = resize(currentCanvas, width, height);
            currentCanvas = resizedCanvas;
        }
        return currentCanvas;
    }
    function resize(canvas, width, height) {
        const clone = document.createElement("canvas");
        const ctx = clone.getContext("2d");
        clone.width = width;
        clone.height = height;
        ctx.drawImage(canvas, 0, 0, width, height);
        return clone;
    }

    /**
     * create BITMAPINFOHEADER structure buffer
     * @param {number} size size of the image
     * @see https://en.wikipedia.org/wiki/BMP_file_format
     */
    function createBitmapInfoHeader(width, height) {
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

    function createBitmapImageData(canvas) {
        const ctx = canvas.getContext("2d");
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

    function toBinary(buffer) {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return binary;
    }

    function createBitmapBinary(canvas) {
        const size = canvas.width;
        const header = createBitmapInfoHeader(size, size);
        const imageData = createBitmapImageData(canvas);
        const bitmapMask = new Uint8Array((size * size) / 4).fill(0);
        return [header, imageData, bitmapMask].map(toBinary).join("");
    }

    /**
     * create ICONDIRENTRY structure buffer
     * @param {number}imageSize
     * @param {number} offset
     * @see https://en.wikipedia.org/wiki/ICO_(file_format)#Icon_resource_structure
     * @returns
     */
    function createIconDirEntry(width, height, offset, bitmapSize) {
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

    function toIco(canvas, sizes = [16, 32, 48]) {
        const numOfImages = sizes.length;
        const iconDir = toBinary(createIconDir(numOfImages));
        const iconDirEntries = [];
        let bitmapOffset = 6 + 16 * numOfImages;
        let bitmapBinaries = [];
        sizes.forEach((size) => {
            const resized = resizeCanvas(canvas, size, size);
            const bitmapBinary = createBitmapBinary(resized);
            const iconDirEntry = createIconDirEntry(size, size, bitmapOffset, bitmapBinary.length);
            iconDirEntries.push(toBinary(iconDirEntry));
            const area = size * size;
            bitmapOffset += 40 + 4 * area + (2 * area) / 8;
            bitmapBinaries.push(bitmapBinary);
        });
        return ("data:image/x-icon;base64," +
            btoa(iconDir + iconDirEntries.join("") + bitmapBinaries.join("")));
    }

    return toIco;

})));
