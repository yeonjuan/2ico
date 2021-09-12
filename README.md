# 2ico

Generate ICO from canvas. see [Demo](https://yeonjuan.github.io/2ico/)

## Installation

```
npm install 2ico
```

## Usage

```js
import toICO from '2ico';

toICO(canvas, [16, 32, 48]); // data:image/x-icon;base64, ...
```

### Parameters

- **canvas** (`HTMLCanvasElement`): The canvas element.
- **sizes** (`number[]`): The sizes of images in ico. (default: [16, 32, 48])

### Returns

- Data URIs (`string`): the ico Data URIs.


```js
const elCanvas = document.getElementById('canvas-id');

const result = toICO(
  elCanvas,
  [16, 32, 48] 
);

console.log(result); // data:image/x-icon;base64, ...
```

## LICENSE

[MIT](./LICENSE)
