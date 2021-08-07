"use strict"
const BOARD_NUM = 3;
const RANDOM_MOVER = 100;
let restartGame;

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
    this.partsNum = BOARD_NUM;
    this.baseImage = new BaseImage(this.ctx, this.windowSize);
    this.moveCount = 0;
    this.initGame();
  }
  initGame() {
    // リスタートボタンを非表示にする
    const restartArea = document.getElementById("restart");
    restartArea.style.display = 'none';
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
    this.baseImage.getImage().onload = () => {
      this.drawGameBoard();
    }
    // ランダムで動かして盤面を作成する
    [...Array(RANDOM_MOVER)].forEach(()=>{
      this.randMove();
    });
    this.moveCount = 0;
    this.isClear = false;
  }
  moveParts(dx, dy) {
    // 範囲内かを確認する
    if(this.nullPoint.x + dx >= 0 && this.nullPoint.x + dx < this.partsNum &&
        this.nullPoint.y + dy >= 0 && this.nullPoint.y + dy < this.partsNum
    ) {
      const target = this.board[this.nullPoint.x+dx][this.nullPoint.y+dy];
      this.board[this.nullPoint.x][this.nullPoint.y] = {
        x: target.x,
        y: target.y
      }
      this.board[this.nullPoint.x+dx][this.nullPoint.y+dy] = null;
      this.nullPoint.x += dx;
      this.nullPoint.y += dy;
    }
    this.moveCount++;
  }
  getCount() {
    return this.moveCount;
  }
  getIsClear() {
    return this.isClear;
  }
  clearCheck() {
    let isClear = true;
    for(let x=0; x<this.partsNum; x++) {
      for(let y=0; y<this.partsNum; y++) {
        if(this.board[x][y] === null) {
          continue;
        }
        if(this.board[x][y].x !== x || this.board[x][y].y !== y) {
          isClear = false;
        }
      }
    }
    this.isClear = isClear;
  }
  randMove() {
    const num = Math.floor(Math.random()*4);
    switch(num){
      case 0:
        this.moveParts(-1, 0);
        break;
      case 1:
        this.moveParts(1, 0);
        break;
      case 2:
        this.moveParts(0, 1);
        break;
      case 3:
        this.moveParts(0, -1);
        break;
    }
  }
  drawGameBoard() {
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

window.onload = () => {
  const game = new GameObject();
  restartGame = () => {
    game.initGame();
    game.drawGameBoard();
    document.getElementById('count').innerText = `Count: ${game.getCount()}`;
  }
  window.addEventListener("keydown", (evt) => {
    const key = evt.key;
    const keyList = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];
    if(keyList.includes(key) && !game.getIsClear()) {
      switch(key) {
        case 'ArrowRight':
          game.moveParts(-1, 0);
          break;
        case 'ArrowLeft':
          game.moveParts(1, 0);
          break;
        case 'ArrowDown':
          game.moveParts(0, -1);
          break;
        case 'ArrowUp':
          game.moveParts(0, 1);
          break;
      }
      game.drawGameBoard();
      game.clearCheck();
      document.getElementById('count').innerText = `Count: ${game.getCount()}`;
      if(game.getIsClear()) {
        document.getElementById('status').innerText = '状況：クリア！';
        // リスタートボタンを表示する
        const restartArea = document.getElementById("restart");
        restartArea.style.display = 'block';
      }
    }
  });
}
