"use strict"
const FRAME_COUNT = 10;

class BaseImage {
  constructor(ctx, widowSize, src = "./image/03.jpg") {
    this.image = new Image();
    this.image.src = src;
    this.imageSize = 800;
    this.ctx = ctx;
    this.windowSize = widowSize;
    this.isLoaded = false;
    this.isInit = false;
  }
  changeIsLoaderd() {
    this.isLoaded = true
  }
  getIsLoaded() {
    return this.isLoaded;
  }
  getImage() {
    return this.image;
  }
  gameClearDraw() {
    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.imageSize,
      this.imageSize,
      0,
      0,
      this.windowSize,
      this.windowSize
    );
  }
  drawImage(partsNum, px, py, dx, dy) {
    const imagePartsSize = this.imageSize/partsNum;
    const drawPatsSize = this.windowSize/partsNum;
    this.ctx.drawImage(
      this.image,
      imagePartsSize * px,
      imagePartsSize * py,
      imagePartsSize,
      imagePartsSize,
      drawPatsSize * dx,
      drawPatsSize * dy,
      drawPatsSize,
      drawPatsSize
    );
  }
  moveDrawImage(partsNum, px, py, dx, dy, mx, my, frame) {
    const imagePartsSize = this.imageSize/partsNum;
    const drawPatsSize = this.windowSize/partsNum;
    const moveX = mx * drawPatsSize * frame / FRAME_COUNT;
    const moveY = my * drawPatsSize * frame / FRAME_COUNT;
    this.ctx.drawImage(
      this.image,
      imagePartsSize * px,
      imagePartsSize * py,
      imagePartsSize,
      imagePartsSize,
      drawPatsSize * dx + moveX,
      drawPatsSize * dy + moveY,
      drawPatsSize,
      drawPatsSize
    );
  }
  onloadImage() {
    return new Promise((resolve, reject)=>{
      this.image.onload = () => resolve();
      this.image.onerror = (e) => reject();
    })
  }
}