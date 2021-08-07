"use strict"
window.onload = () => {
  class BaseImage {
    constructor(ctx) {
      this.image = new Image();
      this.image.src = "./image/annica.jpg";
      this.imageSize = 1080;
      this.ctx = ctx;
      this.windowSize = 800;
    }
    getImage() {
      return this.image;
    }
    drawImage(partsNum, px, py, dx, dy) {
      const imagePartsSize = this.imageSize/partsNum;
      const drawPatsSize = this.windowSize/partsNum;
      this.ctx.drawImage(
        baseImage.getImage(),
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
  }
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const baseImage = new BaseImage(ctx);
  baseImage.getImage().onload = () => {
    baseImage.drawImage(4, 0, 0, 0, 0);
    baseImage.drawImage(4, 0, 1, 0, 1);
    baseImage.drawImage(4, 0, 2, 0, 2);
    baseImage.drawImage(4, 0, 3, 0, 3);
  }
}