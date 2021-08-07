"use strict"
class BaseImage {
  constructor(ctx, widowSize) {
    this.image = new Image();
    this.image.src = "./image/annica.jpg";
    this.imageSize = 1080;
    this.ctx = ctx;
    this.windowSize = widowSize;
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
    this.windowSize = 800;
    this.partsNum = 4;
    this.baseImage = new BaseImage(this.ctx, this.windowSize);
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
    this.nullPoint = {
      x: this.partsNum - 1,
      y: this.partsNum - 1
    }
  }
  rightMove() {
    // 範囲内かを確認する
    if(this.nullPoint.x - 1 >= 0) {
      const target = this.board[this.nullPoint.x-1][this.nullPoint.y];
      this.board[this.nullPoint.x][this.nullPoint.y] = {
        x: target.x,
        y: target.y
      }
      this.board[this.nullPoint.x-1][this.nullPoint.y] = null;
      this.nullPoint.x -= 1;
    }
  }
  drawGameBoard() {
    console.log(this.board);
    this.baseImage.getImage().onload = () => {
      this.ctx.clearRect(0, 0, this.windowSize, this.windowSize)
      for(const x in this.board){
        for(const y in this.board[x]){
          const parts = this.board[x][y];
          if(parts !== null) {
            this.baseImage.drawImage(this.partsNum, parts.x, parts.y, x, y);
          }
        }
      }
    }
  }
}
window.onload = () => {
  const game = new GameObject();
  game.rightMove();
  game.drawGameBoard();
}
