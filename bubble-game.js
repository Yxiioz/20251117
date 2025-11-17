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

  reset() {
    this.r = random(50, 200);
    this.x = random(width);
    this.y = height + this.r / 2;
    this.speed = random(0.5, 3);
    this.color = random(COLORS);
    this.alpha = random(50, 200);
    this.isPopped = false;
  }

  move() {
    if (this.isPopped) {
      this.y += 10;
      if (this.y > height + this.r) {
        this.reset();
      }
      return;
    }

    this.y -= this.speed;

    if (this.y < -this.r / 2) {
      this.reset();
    }
  }

  display() {
    if (this.isPopped) return;

    let c = color(this.color);
    c.setAlpha(this.alpha);
    fill(c);
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);

    let squareSize = this.r / 5;
    fill(255, 150);
    noStroke();

    let angle = PI / 4;
    let distance = (this.r / 2) - (squareSize / 2) - 5;
    let squareX = this.x + cos(angle) * distance;
    let squareY = this.y - sin(angle) * distance;

    rectMode(CENTER);
    rect(squareX, squareY, squareSize, squareSize);
    rectMode(CORNER);
  }

  contains(px, py) {
    if (this.isPopped) return false;

    let d = dist(px, py, this.x, this.y);
    if (d < this.r / 2) return true;

    let squareSize = this.r / 5;
    let angle = PI / 4;
    let distance = (this.r / 2) - (squareSize / 2) - 5;
    let squareX = this.x + cos(angle) * distance;
    let squareY = this.y - sin(angle) * distance;

    let halfSize = squareSize / 2;
    return px > squareX - halfSize && px < squareX + halfSize &&
           py > squareY - halfSize && py < squareY + halfSize;
  }

  pop() {
    this.isPopped = true;
    score += 100;
    scoreFeedbacks.push(new ScoreFeedback(this.x, this.y, "+100"));
  }
}

class ScoreFeedback {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.alpha = 255;
    this.speed = 1;
  }

  update() {
    this.y -= this.speed;
    this.alpha -= 5;
    return this.alpha <= 0;
  }

  display() {
    fill(0, 0, 0, this.alpha);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(this.text, this.x, this.y);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  angleMode(RADIANS);

  for (let i = 0; i < NUM_CIRCLES; i++) {
    bubbles.push(new Bubble());
  }
}

function draw() {
  background(255, 10);

  for (let bubble of bubbles) {
    bubble.move();
    bubble.display();
  }

  for (let i = scoreFeedbacks.length - 1; i >= 0; i--) {
    let feedback = scoreFeedbacks[i];
    if (feedback.update()) {
      scoreFeedbacks.splice(i, 1);
    } else {
      feedback.display();
    }
  }

  fill(0);
  textSize(32);
  textAlign(LEFT, TOP);
  text("分數: " + score, 10, 10);
  
  textSize(20);
  text("學號: " + STUDENT_ID, 10, 50);
}

function mousePressed() {
  for (let bubble of bubbles) {
    if (bubble.contains(mouseX, mouseY)) {
      bubble.pop();
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(255);
}