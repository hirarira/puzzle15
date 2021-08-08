"use strict"
const BOARD_NUM = 3;
const RANDOM_MOVER = 100;
const FRAME_COUNT = 10;
let restartGame;

const wait = (ms) => {
  return new Promise((resolve)=>{
    setTimeout(resolve, ms);
  })
} 

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
class GameObject {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    this.windowSize = 800;
    this.partsNum = BOARD_NUM;
    this.baseImage = new BaseImage(this.ctx, this.windowSize);
    this.moveCount = 0;
    this.isMoving = false;
    this.sound = {
      move: new Audio("./music/cursor1.wav"),
      clear: new Audio("./music/clear2.mp3")
    }
    this.initGame();
  }
  initGame() {
    this.isInit = true;
    document.getElementById('status').innerText = '状況：初期化中';
    // 背景画像が入力されているかを確認する
    const imageURLPath = document.getElementById("imageURLInput").value;
    if(imageURLPath) {
      this.baseImage = new BaseImage(this.ctx, this.windowSize, imageURLPath);
    }
    // 分割パーツ数を設定
    const partsNum = Number(document.getElementById("splitNum").value);
    if(partsNum > 1) {
      this.partsNum = partsNum;
    }
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
    // ランダムで動かして盤面を作成する
    // ランダムで動かす数を取得する
    let randMoveNum = Number(document.getElementById("resetRandomNum").value);
    randMoveNum = randMoveNum < 10? 10: randMoveNum;
    (async ()=>{
      if(!this.baseImage.getIsLoaded()) {
        await this.baseImage.onloadImage();
        this.baseImage.changeIsLoaderd();
      }
      for(let i=0; i<randMoveNum; i++) {
        await this.randMove();
      }
      this.moveCount = 0;
      this.isClear = false;
      this.isInit = false;
      document.getElementById('status').innerText = '状況：プレイ中';
      document.getElementById('count').innerText = `Count: ${this.moveCount}`;
    })()
  }
  async moveParts(dx, dy) {
    // 範囲内かを確認する
    if(this.nullPoint.x + dx >= 0 && this.nullPoint.x + dx < this.partsNum &&
        this.nullPoint.y + dy >= 0 && this.nullPoint.y + dy < this.partsNum
    ) {    
      this.isMoving = true;
      const target = this.board[this.nullPoint.x+dx][this.nullPoint.y+dy];
      this.board[this.nullPoint.x+dx][this.nullPoint.y+dy] = null;
      // 動きを入れる
      for(let i=0; i<FRAME_COUNT; i++) {
        this.baseImage.moveDrawImage(
          this.partsNum,
          target.x,
          target.y,
          this.nullPoint.x+dx,
          this.nullPoint.y+dy,
          -1 * dx,
          -1 * dy,
          i
        );
        await wait(10);
      }
      this.board[this.nullPoint.x][this.nullPoint.y] = {
        x: target.x,
        y: target.y
      }
      this.nullPoint.x += dx;
      this.nullPoint.y += dy;
      this.drawGameBoard();
      this.moveCount++;    
      this.isMoving = false;
    }
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
  async randMove() {
    const num = Math.floor(Math.random()*4);
    switch(num){
      case 0:
        await this.moveParts(-1, 0);
        break;
      case 1:
        await this.moveParts(1, 0);
        break;
      case 2:
        await this.moveParts(0, 1);
        break;
      case 3:
        await this.moveParts(0, -1);
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
  clearDrawBoard() {
    this.baseImage.gameClearDraw();
  }
  async keyDown(key) {
    const keyList = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];
    if(keyList.includes(key) && !this.isClear && !this.isMoving) {
      // カーソルを動かしたときのSEを流す
      this.sound.move.play();
      switch(key) {
        case 'ArrowRight':
          await this.moveParts(-1, 0);
          break;
        case 'ArrowLeft':
          await this.moveParts(1, 0);
          break;
        case 'ArrowDown':
          await this.moveParts(0, -1);
          break;
        case 'ArrowUp':
          await this.moveParts(0, 1);
          break;
      }
      this.drawGameBoard();
      this.clearCheck();
      document.getElementById('count').innerText = `Count: ${this.getCount()}`;
      if(this.getIsClear()) {
        // クリアファンファーレを流す
        this.sound.clear.play();
        document.getElementById('status').innerText = '状況：クリア！';
        this.board[this.partsNum-1][this.partsNum-1] = {
          x: this.partsNum,
          y: this.partsNum
        };
        this.clearDrawBoard();
      }
    }
  }
}

window.onload = () => {
  const game = new GameObject();
  restartGame = () => {
    if(!game.isInit) {
      game.initGame();
    }
  }
  window.addEventListener("keydown", async (evt) => {
    const key = evt.key;
    await game.keyDown(key);
  });
}
