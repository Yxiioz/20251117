/*
By Okazz
*/

// 將 palette 移至頂部，確保所有類別都能存取
let palette = ['#ff4d00', '#2abde4', '#fdb50e', '#2864b8', '#EAEDF1'];

// --- 新增：背景粒子類別 ---
class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-1, -0.1); // 讓粒子緩慢向上漂浮
    this.alpha = 0; // 初始為透明
    this.alphaTarget = random(100, 220); // 增加亮度
    this.size = random(2, 5); // 增加尺寸
    this.color = color(random(palette));
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    // 慢慢變亮，然後再慢慢變暗
    this.alpha = lerp(this.alpha, this.alphaTarget, 0.05);
    if (this.y < 0 || this.x < 0 || this.x > width) {
      this.y = random(height, height + 50); // 從底部重生
      this.x = random(width);
    }
  }

  show() {
    noStroke();
    this.color.setAlpha(this.alpha);
    fill(this.color);
    circle(this.x, this.y, this.size);
  }
}
// --- 新增結束 ---

function easeInOutQuint(x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

/*------------------------------------------------------------------------------------------*/

/* 保留您原本的 Motion 類別實作（下方不變動） */

class Motion1_1_01 {
	/*
	円四角モーフィング
	*/
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.toggle = int(random(2));
		this.clr = random(palette);
		this.initialize();
		this.duration = 80;
		this.currentW = w;
		this.colors = palette.slice();
		shuffle(this.colors, true);
		this.color1 = color(this.colors[0]);
		this.color2 = color(this.colors[1]);
		this.currentW = this.w;

		if (this.toggle) {
			this.currentColor = this.color1;
			this.corner = this.w;
		} else {
			this.currentColor = this.color2;
			this.corner = 0;
		}
	}

	show() {
		noStroke();
		fill(this.currentColor);
		square(this.x, this.y, this.currentW, this.corner);
	}

	update() {
		if (0 < this.timer && this.timer < this.duration) {
			let nrm = norm(this.timer, 0, this.duration - 1);
			let n = nf(easeInOutQuint(nrm), 0, 4);
			if (this.toggle) {
				this.corner = lerp(this.w, 0, n);
				this.currentColor = lerpColor(this.color1, this.color2, n);
			} else {
				this.corner = lerp(0, this.w, n);
				this.currentColor = lerpColor(this.color2, this.color1, n);
			}
			this.currentW = lerp(this.w, this.w / 2, sin(n * PI));
		}

		if (this.timer > this.duration) {
			if (this.toggle) {
				this.toggle = 0;
			} else {
				this.toggle = 1;
			}
			this.initialize();
		}

		this.timer++;
	}

	initialize() {
		if (this.toggle) {
		} else {
		}
		this.timer = -int(random(restTime));
	}

	run() {
		this.show();
		this.update();
	}
}

class Motion1_1_02 {
	/*
	惑星衛星
	*/
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.colors = palette.slice();
		shuffle(this.colors, true);
		this.satelliteSize = this.w * 0.2;
		this.orbitW = this.w * 0.4;
		this.orbitH = this.w * 0.1;
		this.timer = int(-random(100));
		this.currentaAngle = random(10);
		this.angleStep = random([1, -1]) * 0.01;
		this.coin = random([-1, 1])
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.currentaAngle);
		noStroke();
		fill(this.colors[0]);
		circle(0, 0, this.w * 0.5);

		fill(this.colors[1]);
		circle(this.orbitW * cos(this.timer / 50 * this.coin), this.orbitH * sin(this.timer / 50 * this.coin), this.satelliteSize);
		pop();
	}

	update() {
		this.timer++;
		this.currentaAngle += this.angleStep;
	}

	run() {
		this.show();
		this.update();
	}
}

class Motion1_1_03 {
	/*
	チェック＆ポルカドット
	*/
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.toggle = int(random(2));
		this.initialize();
		this.duration = 150;
		this.colors = palette.slice();
		shuffle(this.colors, true);



		this.gridCount = 4;
		this.cellW = this.w / this.gridCount;

		this.squareW = 0;
		this.circleD = 0;

		if (this.toggle) {
			this.squareW = this.cellW;
		} else {
			this.circleD = this.cellW * 0.75;
		}
	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		for (let i = 0; i < this.gridCount; i++) {
			for (let j = 0; j < this.gridCount; j++) {
				let cellX = - (this.w / 2) + i * this.cellW + (this.cellW / 2);
				let cellY = - (this.w / 2) + j * this.cellW + (this.cellW / 2);
				if ((i + j) % 2 == 0) {
					fill(this.colors[0]);
					square(cellX, cellY, this.squareW);
				} else {

				}

				fill(this.colors[1]);
				circle(cellX, cellY, this.circleD);
			}
		}
		pop();
	}

	update() {
		if (0 < this.timer && this.timer < this.duration) {
			let nrm = norm(this.timer, 0, this.duration - 1);
			let n = nf(easeInOutQuint(nrm), 0, 4);
			if (this.toggle) {
				this.squareW = lerp(this.cellW, 0, n);
				this.circleD = lerp(0, this.cellW * 0.75, n);

			} else {
				this.squareW = lerp(0, this.cellW, n);

				this.circleD = lerp(this.cellW * 0.75, 0, n);
			}
		}

		if (this.timer > this.duration) {
			if (this.toggle) {
				this.toggle = 0;
			} else {
				this.toggle = 1;
			}
			this.initialize();
		}
		this.timer++;
	}

	initialize() {
		if (this.toggle) {
		} else {
		}
		this.timer = -int(random(restTime));
	}

	run() {
		this.show();
		this.update();
	}
}

class Motion1_1_04 {
	/*
	4半円合体
	*/
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.toggle = int(random(2));
		this.initialize();
		this.duration = 80;
		this.colors = palette.slice();
		shuffle(this.colors, true);

		this.arcD = this.w / 2;
		if (this.toggle) {
			this.shiftX = 0;
			this.shiftY = 0;
			this.arcA = 0;
		} else {
			this.shiftX = this.w / 2;
			this.shiftY = this.w / 2;
			this.arcA = PI;
		}

	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		for (let i = 0; i < 4; i++) {
			push();
			translate(this.shiftX, this.shiftY);
			rotate(this.arcA);
			fill(this.colors[i]);
			arc(0, 0, this.arcD, this.arcD, 0, PI / 2);
			pop();
			rotate(TAU / 4);
		}
		pop();
	}

	update() {
		if (0 < this.timer && this.timer < this.duration) {
			let nrm = norm(this.timer, 0, this.duration - 1);
			let n = nf(easeInOutQuint(nrm), 0, 4);
			if (this.toggle) {
				this.shiftX = lerp(0, this.w / 2, n);
				this.shiftY = lerp(0, this.w / 2, n);
				this.arcA = lerp(0, PI, n);
			} else {
				this.shiftX = lerp(this.w / 2, 0, n);
				this.shiftY = lerp(this.w / 2, 0, n);
				this.arcA = lerp(PI, 0, n);
			}
		}

		if (this.timer > this.duration) {
			if (this.toggle) {
				this.toggle = 0;
			} else {
				this.toggle = 1;
			}
			this.initialize();
		}
		this.timer++;
	}

	initialize() {
		if (this.toggle) {
		} else {
		}
		this.timer = -int(random(restTime));
	}

	run() {
		this.show();
		this.update();
	}
}

class Motion1_1_05 {
	/*
	四色四角
	*/
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.toggle = int(random(2));
		this.initialize();
		this.duration = 120;
		this.colors = palette.slice();
		shuffle(this.colors, true);
		this.squareW = this.w * 0.4;
		this.counter = 0;
		this.timer++;
	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		fill(this.colors[this.counter % this.colors.length]);
		square(this.w * 0.25, -this.w * 0.25, this.squareW);
		fill(this.colors[(this.counter + 1) % this.colors.length]);
		square(this.w * 0.25, this.w * 0.25, this.squareW);
		fill(this.colors[(this.counter + 2) % this.colors.length]);
		square(-this.w * 0.25, this.w * 0.25, this.squareW);
		fill(this.colors[(this.counter + 3) % this.colors.length]);
		square(-this.w * 0.25, -this.w * 0.25, this.squareW);
		pop();
	}

	update() {
		if (this.timer % 15 == 0) {
			this.counter++
		}
		this.timer++;
	}

	initialize() {
		if (this.toggle) {
		} else {
		}
		this.timer = -int(random(1200));
	}

	run() {
		this.show();
		this.update();
	}
}


/*------------------------------------------------------------------------------------------*/

class Motion2_1_01 {
	/*
	〜
	*/
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.angle = int(random(2)) * PI;
		if (this.w < this.h) {
			this.angle += PI / 2;
		}
		this.minS = min(this.w, this.h);
		this.st = this.minS * 0.15;
		this.color = random(palette);
		this.timer = 0;
		this.speed = 0.025 * random([-1, 1]);
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.angle);
		noFill();
		stroke(this.color);
		strokeWeight(this.st);
		beginShape();
		let num = 100;
		for (let i = 0; i < num; i++) {
			let theta = map(i, 0, num, 0, PI * 5);
			let r = lerp(0, this.minS * 0.4, sin(map(i, 0, num, 0, PI)));
			let xx = map(i, 0, num - 1, -this.minS, this.minS);
			let yy = r * sin(theta + (this.timer * this.speed));
			vertex(xx, yy);
		}
		endShape();
		pop();
	}

	update() {
		this.timer++;
	}
	run() {
		this.show();
		this.update();
	}
}

class Motion2_1_02 {
	/*
	4円背の順
	*/
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.angle = int(random(2)) * PI;
		if (this.w < this.h) {
			this.angle += PI / 2;
		}
		this.minS = min(this.w, this.h);

		this.toggle = int(random(2));
		this.color = random(palette);
		this.initialize();
		this.duration = 120;
		this.targetSize = [];
		this.targetSize[0] = this.minS * 0.5;
		this.targetSize[1] = this.minS * 0.4;
		this.targetSize[2] = this.minS * 0.3;
		this.targetSize[3] = this.minS * 0.2;

		this.circleD = [];
		if (this.toggle) {
			this.circleD[0] = this.targetSize[0];
			this.circleD[1] = this.targetSize[1];
			this.circleD[2] = this.targetSize[2];
			this.circleD[3] = this.targetSize[3];
		} else {
			this.circleD[0] = this.targetSize[3];
			this.circleD[1] = this.targetSize[2];
			this.circleD[2] = this.targetSize[1];
			this.circleD[3] = this.targetSize[0];
		}

	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.angle);
		noStroke();
		fill(this.color);
		circle(this.minS / 4 * 3, 0, this.circleD[0]);
		circle(this.minS / 4, 0, this.circleD[1]);
		circle(-this.minS / 4, 0, this.circleD[2]);
		circle(-this.minS / 4 * 3, 0, this.circleD[3]);
		pop();
	}

	update() {
		if (0 < this.timer && this.timer < this.duration) {
			let nrm = norm(this.timer, 0, this.duration - 1);
			let n = nf(easeInOutQuint(nrm), 0, 4);
			if (this.toggle) {
				this.circleD[0] = lerp(this.targetSize[0], this.targetSize[3], n);
				this.circleD[1] = lerp(this.targetSize[1], this.targetSize[2], n);
				this.circleD[2] = lerp(this.targetSize[2], this.targetSize[1], n);
				this.circleD[3] = lerp(this.targetSize[3], this.targetSize[0], n);
			} else {
				this.circleD[0] = lerp(this.targetSize[3], this.targetSize[0], n);
				this.circleD[1] = lerp(this.targetSize[2], this.targetSize[1], n);
				this.circleD[2] = lerp(this.targetSize[1], this.targetSize[2], n);
				this.circleD[3] = lerp(this.targetSize[0], this.targetSize[3], n);
			}
		}

		if (this.timer > this.duration) {
			if (this.toggle) {
				this.toggle = 0;
			} else {
				this.toggle = 1;
			}
			this.initialize();
		}

		this.timer++;
	}

	initialize() {
		this.timer = int(-random(restTime));
	}

	run() {
		this.show();
		this.update();
	}
}

class Motion2_1_03 {
	/*
	←←←
	*/
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.angle = int(random(2)) * PI;
		if (this.w < this.h) {
			this.angle += PI / 2;
		}
		this.minS = min(this.w, this.h);
		this.toggle = int(random(2));
		this.colors = palette.slice();
		shuffle(this.colors, true);
		this.initialize();
		this.duration = 150;
		this.shift = 0;
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.angle);
		stroke(0);
		strokeWeight(0);
		noFill();
		rect(0, 0, this.minS * 2, this.minS);
		ctx.clip();
		fill(this.colors[1]);

		for (let i = 0; i < 8; i++) {
			let xx = map(i, 0, 8, -this.minS, this.minS * 2.5);
			this.tri(xx - this.shift, 0, this.minS * 0.5);
		}

		pop();
	}

	update() {
		if (0 < this.timer && this.timer < this.duration) {
			let nrm = norm(this.timer, 0, this.duration - 1);
			let n = nf(easeInOutQuint(nrm), 0, 4);
			this.shift = lerp(0, this.minS * 1.3125, n);
			if (this.toggle) {
			} else {
			}
		}

		if (this.timer > this.duration) {
			if (this.toggle) {
				this.toggle = 0;
			} else {
				this.toggle = 1;
			}
			this.initialize();
		}

		this.timer++;
	}

	initialize() {
		this.timer = int(-random(restTime));
	}

	run() {
		this.show();
		this.update();
	}

	tri(x, y, w) {
		beginShape();
		vertex(x, y);
		vertex(x + (w / 2), y - (w / 2));
		vertex(x + (w / 2), y + (w / 2));
		endShape();
	}
}

class Motion2_1_04 {
	/*
	ボール
	*/
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.angle = int(random(2)) * PI;
		if (this.w < this.h) {
			this.angle += PI / 2;
		}
		this.minS = min(this.w, this.h);
		this.toggle = int(random(2));
		this.colors = palette.slice();
		shuffle(this.colors, true);
		this.initialize();
		this.duration = 30;

		this.circleW = this.minS / 4;
		this.circleH = this.minS / 2;

		if (this.toggle) {
			this.shift = -(this.minS - this.circleW / 2);
		} else {
			this.shift = (this.minS - this.circleW / 2);
		}
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.angle);
		stroke(0);
		strokeWeight(0);
		fill(this.colors[0]);
		fill(this.colors[1]);
		ellipse(this.shift, 0, this.circleW, this.circleH);

		pop();
	}

	update() {
		if (0 < this.timer && this.timer < this.duration) {
			let nrm = norm(this.timer, 0, this.duration - 1);
			let n = nf(easeInOutQuint(nrm), 0, 4);
			this.circleW = lerp(this.minS / 4, this.minS / 2, sin(n * PI));
			this.circleH = lerp(this.minS / 2, this.minS / 4, sin(n * PI));
			if (this.toggle) {
				this.shift = lerp(-(this.minS - this.circleW / 2), (this.minS - this.circleW / 2), n);
			} else {
				this.shift = lerp((this.minS - this.circleW / 2), -(this.minS - this.circleW / 2), n);
			}

		}

		if (this.timer > this.duration) {
			if (this.toggle) {
				this.toggle = 0;
			} else {
				this.toggle = 1;
			}
			this.initialize();
		}

		this.timer++;
	}

	initialize() {
		this.timer = int(-random(restTime));
	}

	run() {
		this.show();
		this.update();
	}
}
/*------------------------------------------------------------------------------------------*/
let ctx;
let centerX, centerY;
let motions = [];
let restTime = 300;
let rects = [];
let backgroundParticles = []; // 新增：背景粒子陣列

// 選單相關
let menuX = -200; // 選單的初始X位置（左邊界）
let targetMenuX = -200; // 選單的目標X位置
let menuWidth = 200; // 選單寬度
let menuItems = ['第一單元作品', '第一單元講義', '期中考筆記', '測驗系統', '淡江大學', '教科系', '回到首頁'];

// --- 新增：姓名學號彈出動畫變數 ---
let nameAnim = {
  state: 'start', // 動畫狀態: start, pop, hold, move, finished
  timer: 0,
  pos: null,      // 目前位置
  scale: 0,       // 目前縮放
  alpha: 0,       // 目前透明度
  // 新增：顏色動畫變數
  colorTimer: 0,
  colorIndex: 0,
  fromColor: null,
  toColor: null,
};

// 全螢幕 / 作品圖
let isFullScreen = false;
let workImg;               // 作品 gif（使用 loadImage，若要確保動畫可用可改用 createImg）
let profileImg;            // 用於顯示您的照片
let iframeElement = null;  // 用於顯示網頁內容的 iframe
let isShowingIframe = false; // 是否正在顯示 iframe
let isShowingWork = false; // 是否正在顯示作品

function preload() {
  // 載入 GIF（若想在外部新分頁開啟可改為不 preload）
  // workImg = loadImage('path/to/your/image.gif');

  // 載入您的照片，請確認照片檔案 (此處為 'profile.jpg') 與 index.html 在同一資料夾
  // 如果載入失敗，會在主控台顯示錯誤，但程式仍會繼續執行
  profileImg = loadImage('profile.jpg', () => {}, () => console.error("照片載入失敗！"));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  ctx = drawingContext;
  centerX = width / 2;
  centerY = height / 2;
  textSize(32);
  select('canvas').style('z-index', '2'); // 確保 p5.js 畫布在 iframe 上方
  textAlign(LEFT, CENTER);

  // 初始排列
  motions = [];
  rects = [];
  tiling();

  // 初始化背景粒子
  for (let i = 0; i < 200; i++) { // 增加粒子數量
    backgroundParticles.push(new Particle());
  }

  // 初始化姓名動畫的位置
  nameAnim.pos = createVector(width / 2, height / 2);
  // 初始化顏色動畫
  nameAnim.colorIndex = 0;
  nameAnim.fromColor = color(palette[0]);
  nameAnim.toColor = color(palette[1]);
  nameAnim.colorTimer = 0;

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;

  // 重新排列並重建元素
  motions = [];
  rects = [];
  tiling();

  // 重設姓名動畫，使其在視窗改變後能重新播放
  nameAnim.state = 'start';
}

function keyPressed() {
  if (key === 'f' || key === 'F') {
    fullscreen(!fullscreen());
  }
}

function draw() {
  background('#21212b');

  // --- 新增：繪製背景粒子 ---
  for (const p of backgroundParticles) {
    p.update();
    p.show();
  }

  // 更新選單目標位置（當滑鼠在最左側100px 時滑出）
  if (mouseX < 100) {
    targetMenuX = 0;
  } else {
    targetMenuX = -menuWidth;
  }
  menuX = lerp(menuX, targetMenuX, 0.1);

  // 處理並繪製姓名學號動畫
  handleNameAnimation();

  // 繪製動態圖形（在選單之下）
  if (!isShowingIframe) {
    for (let m of motions) {
      m.run();
    }
  }

  // 顯示作品覆蓋（若被選中）
  if (isShowingWork && workImg) {
    push();
    // 半透明遮罩
    fill(0, 200);
    noStroke();
    rectMode(CORNER);
    rect(0, 0, width, height);

    // 縮放圖片以適應畫布並保持比例
    let imgW = workImg.width;
    let imgH = workImg.height;
    let scaleF = min(width / imgW, height / imgH) * 0.9;
    imageMode(CENTER);
    // 若 loadImage 對 GIF 只顯示第一張，可改用 createImg 並 draw workImg.elt
    image(workImg, width / 2, height / 2, imgW * scaleF, imgH * scaleF);
    pop();
  }

  // 繪製選單（放在最上層）
  push();
  rectMode(CENTER);
  noStroke();
  fill(33, 33, 43, 200);
  // menuX 為左邊界，rect 的 x 要加上寬度一半
  rect(menuX + menuWidth / 2, height / 2, menuWidth, height);

  fill(255);
  textSize(32);
  textAlign(LEFT, CENTER);
  for (let i = 0; i < menuItems.length; i++) {
    let itemY = height / 4 + i * 80;
    // 懸停效果判斷以實際選單區域為基準
    if (mouseX > menuX && mouseX < menuX + menuWidth &&
        mouseY > itemY - 20 && mouseY < itemY + 20) {
      fill(200);
    } else {
      fill(255);
    }
    text(menuItems[i], menuX + 20, itemY);
  }
  pop();
}

function handleNameAnimation() {
  // --- 新增：顏色漸變邏輯 ---
  nameAnim.colorTimer += 0.005; // 控制顏色變化的速度
  if (nameAnim.colorTimer >= 1.0) {
    nameAnim.colorTimer = 0; // 重置計時器
    // 切換到下一個顏色
    nameAnim.colorIndex = (nameAnim.colorIndex + 1) % palette.length;
    nameAnim.fromColor = nameAnim.toColor;
    let nextColorIndex = (nameAnim.colorIndex + 1) % palette.length;
    nameAnim.toColor = color(palette[nextColorIndex]);
  }
  // 計算當前的漸變色
  let currentColor = lerpColor(nameAnim.fromColor, nameAnim.toColor, nameAnim.colorTimer);
  currentColor.setAlpha(nameAnim.alpha); // 套用整體的透明度


  // --- 動畫邏輯狀態機 ---
  switch (nameAnim.state) {
    case 'start':
      nameAnim.timer = 0;
      nameAnim.pos.set(width / 2, height / 2);
      nameAnim.scale = 0;
      nameAnim.alpha = 0;
      nameAnim.state = 'pop';
      break;

    case 'pop':
      nameAnim.timer++;
      // 彈出動畫 (0 -> 1.2 -> 1.0)
      let popDuration = 40;
      let n = norm(nameAnim.timer, 0, popDuration);
      let easedN = easeInOutQuint(n);
      nameAnim.scale = lerp(0, 1.2, easedN) - 0.2 * sin(easedN * PI);
      nameAnim.alpha = lerp(0, 255, n);

      if (nameAnim.timer > popDuration) {
        nameAnim.state = 'hold';
        nameAnim.timer = 0;
      }
      break;

    case 'hold':
      nameAnim.timer++;
      if (nameAnim.timer > 60) { // 停留 60 幀
        nameAnim.state = 'move';
        nameAnim.timer = 0;
      }
      break;

    case 'move':
      nameAnim.timer++;
      let moveDuration = 60;
      let nMove = norm(nameAnim.timer, 0, moveDuration);
      let easedNMove = easeInOutQuint(nMove);

      // 目標位置和大小
      let targetPos = createVector(width - 120, 50);
      let targetScale = 0.6;

      nameAnim.pos = p5.Vector.lerp(createVector(width / 2, height / 2), targetPos, easedNMove);
      nameAnim.scale = lerp(1, targetScale, easedNMove);

      if (nameAnim.timer > moveDuration) {
        nameAnim.state = 'finished';
      }
      break;
  }

  // --- 繪製 ---
  push();
  translate(nameAnim.pos.x, nameAnim.pos.y);
  scale(nameAnim.scale);
  
  // 設定光暈
  ctx.shadowBlur = 15;
  ctx.shadowColor = `rgba(234, 237, 241, ${nameAnim.alpha / 255})`;

  fill(currentColor); // 使用漸變的顏色
  textSize(48); // 使用較大的字體
  textAlign(CENTER, CENTER);
  text("謝昀儒", 0, -30);
  text("412730946", 0, 30);

  // 重置光暈並清晰地重繪文字
  ctx.shadowBlur = 0;
  text("謝昀儒", 0, -30);
  text("412730946", 0, 30);
  pop();

  // 動畫結束後，在右上角繪製照片
  if (nameAnim.state === 'finished' && profileImg) {
    image(profileImg, width - 100 - 20, 80, 100, 100);
  }
}

function mousePressed() {
    if (mouseX > menuX && mouseX < menuX + menuWidth) {
        for (let i = 0; i < menuItems.length; i++) {
            let itemY = height / 4 + i * 80;
            if (mouseY > itemY - 20 && mouseY < itemY + 20) {
                if (i === 0) { // 第一單元作品
                    showIframe('bubble.html');
                } else if (i === 1) { // 第一單元講義
                    showIframe('https://hackmd.io/@3Txj8LDkSweloJ-ccpJWaQ/rk_rU7Rseg');
                } else if (i === 2) { // 期中考筆記
                    showIframe('https://hackmd.io/@3Txj8LDkSweloJ-ccpJWaQ/SJY0ipAk-x');
                } else if (i === 3) { // 測驗系統
                    // 新增測驗系統連結
                    window.open('https://yxiioz.github.io/20251103/', '_blank');
                } else if (i === 4) { // 淡江大學
                    window.open('https://www.tku.edu.tw/', '_blank');
                } else if (i === 5) { // 教科系
                    window.open('https://www.et.tku.edu.tw/', '_blank');
                } else if (i === 6) {
                    resetToHome();
                }
                break;
            }
        }
        return;
    }
}

function resetToHome() {
  motions = [];
  rects = [];
  tiling();
  menuX = -menuWidth;
  targetMenuX = -menuWidth;
  isShowingIframe = false;
  isShowingWork = false;
  if (iframeElement) {
    iframeElement.remove();
    iframeElement = null;
  }
}

function showIframe(url) {
  if (iframeElement) {
    iframeElement.remove();
  }
  isShowingIframe = true;
  iframeElement = createAndStyleIframe(url);
}

function createAndStyleIframe(src) {
  let iframe = createElement('iframe');
  iframe.attribute('src', src);
  iframe.style('position', 'fixed'); // 保持固定定位，相對於視窗
  iframe.style('top', '0'); // 頂部對齊
  iframe.style('left', menuWidth + 'px'); // 從選單寬度（200px）的右側開始
  iframe.style('width', 'calc(100% - ' + menuWidth + 'px)'); // 佔據剩餘的寬度
  iframe.style('height', '100%'); // 佔據全部高度
  iframe.style('border', 'none');
  iframe.style('z-index', '1'); // 設定較低的 z-index，確保在畫布下方
  return iframe;
}

function tiling() {
  // 清空 rects 與 motions（確保不會累積）
  rects = [];
  motions = [];

  let margin = 0;
  let columns = 30;
  let rows = columns;
  let cellW = (width - (margin * 2)) / columns;
  let cellH = (height - (margin * 2)) / rows;
  let emp = columns * rows;
  let grids = [];

  for (let j = 0; j < columns; j++) {
    let arr = [];
    for (let i = 0; i < rows; i++) {
      arr[i] = false;
    }
    grids[j] = arr;
  }

  while (emp > 0) {
    let w = random([1, 2]);
    let h = random([1, 2]);
    let x = int(random(columns - w + 1));
    let y = int(random(rows - h + 1));
    let lap = true;
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        if (grids[x + i][y + j]) {
          lap = false;
          break;
        }
      }
    }

    if (lap) {
      for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
          grids[x + i][y + j] = true;
        }
      }
      let xx = margin + x * cellW;
      let yy = margin + y * cellH;
      let ww = w * cellW;
      let hh = h * cellH;
      rects.push({ x: xx + ww / 2, y: yy + hh / 2, w: ww, h: hh });
      emp -= w * h;
    } else {
      // 若找不到位置跳出避免無限迴圈
      // 但通常不會觸發
      break;
    }
  }

  for (let i = 0; i < rects.length; i++) {
    let r = rects[i];
    if (r.w == r.h) {
      let rnd = int(random(5));
      if (rnd == 0) {
        motions.push(new Motion1_1_01(r.x, r.y, r.w * 0.75));
      } else if (rnd == 1) {
        motions.push(new Motion1_1_02(r.x, r.y, r.w));
      } else if (rnd == 2) {
        motions.push(new Motion1_1_03(r.x, r.y, r.w));
      } else if (rnd == 3) {
        motions.push(new Motion1_1_04(r.x, r.y, r.w));
      } else if (rnd == 4) {
        motions.push(new Motion1_1_05(r.x, r.y, r.w * 0.5));
      }
    } else {
      let rnd = int(random(4));
      if (rnd == 0) {
        motions.push(new Motion2_1_01(r.x, r.y, r.w * 0.9, r.h * 0.9));
      } else if (rnd == 1) {
        motions.push(new Motion2_1_02(r.x, r.y, r.w, r.h));
      } else if (rnd == 2) {
        motions.push(new Motion2_1_03(r.x, r.y, r.w, r.h));
      } else if (rnd == 3) {
        motions.push(new Motion2_1_04(r.x, r.y, r.w, r.h));
      }
    }
  }
}