"use strict"
window.onload = () => {
  class BaseImage {
    constructor(ctx) {
      this.image = new Image();
      this.image.src = "./image/annica.jpg";
      this.imageSize = 1080;
      this.ctx = ctx;
    }
    getImage() {
      return this.image;
    }
    drawImage() {
      this.ctx.drawImage(
        baseImage.getImage(),
        0,
        0,
        this.imageSize,
        this.imageSize,
        0,
        0,
        800,
        800
      );
    }
  }
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const baseImage = new BaseImage(ctx);
  baseImage.getImage().onload = () => {
    baseImage.drawImage();
  }
}