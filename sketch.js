// 學號變數
const STUDENT_ID = "412730946";

// 定義漂浮圓形的數量
const NUM_CIRCLES = 30;

// 定義可選的四種顏色 (十六進位字串)
const COLORS = [
  '#d8e2dc', // 淺灰綠
  '#ffe5d9', // 淺蜜桃色
  '#ffcad4', // 淺粉色
  '#f4acb7'  // 中粉色
];

// 儲存所有圓形物件的陣列
let bubbles = []; 
let score = 0; // 遊戲分數

// 儲存點擊時的分數視覺回饋物件
let scoreFeedbacks = [];

// 泡泡物件的類別
class Bubble {
  constructor() {
    this.reset();
  }

  // 重置泡泡狀態
  reset() {
    this.r = random(50, 200); // 直徑
    this.x = random(width);   // X 座標
    this.y = height + this.r / 2; // Y 座標 (從底部開始)
    this.speed = random(0.5, 3); // 速度
    this.color = random(COLORS); // 顏色
    this.alpha = random(50, 200); // 透明度
    this.isPopped = false; // 標記是否已破掉
  }

  // 移動泡泡的方法
  move() {
    if (this.isPopped) {
        // 如果已破掉，將其緩慢移出畫面底部，以便之後重置
        this.y += 10;
        if (this.y > height + this.r) {
            this.reset();
        }
        return; 
    }

    this.y -= this.speed;

    // 如果泡泡完全飄出畫布頂端，則重置
    if (this.y < -this.r / 2) {
      this.reset();
    }
  }

  // 顯示泡泡和附帶小方形的方法
  display() {
    if (this.isPopped) return; // 如果已破掉，則不顯示

    // 繪製圓形
    let c = color(this.color);
    c.setAlpha(this.alpha);
    fill(c);
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);

    // 繪製方形
    let squareSize = this.r / 5;
    fill(255, 150); // 白色，透明度 150
    noStroke();

    let angle = PI / 4; // 45 度
    let distance = (this.r / 2) - (squareSize / 2) - 5;
    let squareX = this.x + cos(angle) * distance;
    let squareY = this.y - sin(angle) * distance;

    rectMode(CENTER);
    rect(squareX, squareY, squareSize, squareSize);
    rectMode(CORNER);
  }

  // 檢查滑鼠是否點擊到泡泡 (包括小方形)
  contains(px, py) {
    if (this.isPopped) return false; 

    // 檢查點擊是否在圓形範圍內
    let d = dist(px, py, this.x, this.y);
    if (d < this.r / 2) {
      return true; 
    }

    // 檢查點擊是否在小方形範圍內
    let squareSize = this.r / 5;
    let angle = PI / 4;
    let distance = (this.r / 2) - (squareSize / 2) - 5;
    let squareX_center = this.x + cos(angle) * distance;
    let squareY_center = this.y - sin(angle) * distance;

    let squareX_topLeft = squareX_center - squareSize / 2;
    let squareY_topLeft = squareY_center - squareSize / 2;

    if (px > squareX_topLeft && px < squareX_topLeft + squareSize &&
        py > squareY_topLeft && py < squareY_topLeft + squareSize) {
      return true; 
    }

    return false;
  }

  // 讓泡泡破掉
  pop() {
    this.isPopped = true;
    score += 100; // 增加分數
    // 在泡泡破掉的位置產生一個分數回饋文字
    scoreFeedbacks.push(new ScoreFeedback(this.x, this.y, "+100"));
  }
}

// 分數回饋文字的類別
class ScoreFeedback {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.alpha = 255; // 從不透明開始
    this.speed = 1;   // 向上移動速度
  }

  update() {
    this.y -= this.speed; // 向上飄
    this.alpha -= 5;      // 逐漸變透明
    return this.alpha <= 0; // 如果完全透明，返回 true 表示可以移除
  }

  display() {
    fill(0, 0, 0, this.alpha); // 黑色文字，帶透明度
    textSize(24);
    textAlign(CENTER, CENTER);
    text(this.text, this.x, this.y);
  }
}


// 設定函式
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  // 設定角度模式為弧度，以便使用 sin/cos
  angleMode(RADIANS); 

  // 初始化所有泡泡物件
  for (let i = 0; i < NUM_CIRCLES; i++) {
    bubbles.push(new Bubble());
  }
}

// 繪圖函式
function draw() {
  background(255, 10); // 輕微的半透明背景重繪

  // 處理所有泡泡
  for (let i = bubbles.length - 1; i >= 0; i--) { 
    let bubble = bubbles[i];
    bubble.move();
    bubble.display();
  }

  // 處理分數回饋文字
  for (let i = scoreFeedbacks.length - 1; i >= 0; i--) {
    let feedback = scoreFeedbacks[i];
    if (feedback.update()) {
      scoreFeedbacks.splice(i, 1); 
    } else {
      feedback.display();
    }
  }

  // 顯示分數和學號
  fill(0); // 黑色文字
  textSize(32);
  textAlign(LEFT, TOP);
  
  // 顯示分數
  text("分數: " + score, 10, 10);
  
  // 顯示學號，位置在分數下方或右側，這裡放在下方
  textSize(20);
  text("學號: " + STUDENT_ID, 10, 50); 
}

// 滑鼠點擊事件
function mousePressed() {
  for (let i = bubbles.length - 1; i >= 0; i--) { 
    let bubble = bubbles[i];
    if (bubble.contains(mouseX, mouseY)) {
      bubble.pop(); // 讓泡泡破掉
      break;
    }
  }
}

// 視窗大小改變時的處理函式
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(255); 
  // 簡單地讓它們分佈在畫布中
  for (let bubble of bubbles) {
    bubble.x = random(width);
    bubble.y = random(height);
  }
}