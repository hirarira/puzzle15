"use strict"
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
}
class GameObject {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    this.baseImage = new BaseImage(this.ctx);
    this.partsNum = 4;
    this.initGame();
  }
  initGame() {
    // boardをリセットする
    this.board = [...Array(this.partsNum)].map((x, i)=>{
      return [...Array(this.partsNum)].map((x, j)=>{
        return {
          x: i,
          y: j
        }
      })
    });
    // 右下を欠けさせる
    this.board[this.partsNum-1][this.partsNum-1] = null;
  }
  drawGameBoard() {
    this.baseImage.getImage().onload = () => {
      for(const x in this.board){
        for(const y in this.board[x]){
          const parts = this.board[x][y];
          if(parts !== null) {
            this.baseImage.drawImage(this.partsNum, x, y, parts.x, parts.y);
          }
        }
      }
    }
  }
}
window.onload = () => {
  const game = new GameObject();
  game.drawGameBoard();
}
