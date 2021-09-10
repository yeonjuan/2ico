import type * as t from "./types";

function resizeCanvas(canvas: t.Canvas, width: number, height: number) {
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

function resize(canvas: t.Canvas, width: number, height: number) {
  const clone = document.createElement("canvas");
  const ctx = clone.getContext("2d")!;
  clone.width = width;
  clone.height = height;
  ctx.drawImage(canvas, 0, 0, width, height);
  return clone;
}

export default resizeCanvas;
