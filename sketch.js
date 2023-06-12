let rows, cols;
let fields = [];
let noise;
let a, b, c, d;

const cellSize = 8;
const noiseScale = 20;
const noiseSpeed = 0.002;

function setup() {
  createCanvas(windowWidth, windowHeight);
  fill(255);
  stroke(255);
  strokeWeight(2);
  textSize(24);

  a = createVector();
  b = createVector();
  c = createVector();
  d = createVector();

  noise = new OpenSimplexNoise(Date.now());
  rows = ceil(windowWidth  / cellSize) + 2;
  cols = ceil(windowHeight / cellSize) + 2;

  for(let i = 0; i < rows; i++) {
    fields[i] = [];
    for(let j = 0; j < cols; j++) {
      fields[i][j] = 0;
    }
  }
}

function draw() {
  background(20);
  text("FPS: " + frameRate().toFixed(2), 20, 30);

  for(let i = 0; i < rows - 1; i++) {
    for(let j = 0; j < cols - 1; j++) {
      fields[i][j] = noise.noise3D(i / noiseScale, j / noiseScale, frameCount * noiseSpeed);  // Between -1 and 1

      let x = i * cellSize;
      let y = j * cellSize;
    
      let A = fields[i  ][j  ];
      let B = fields[i+1][j  ];
      let C = fields[i+1][j+1];
      let D = fields[i  ][j+1];

      a.set( x + cellSize * (A/(A-B)), y                        );
      b.set( x + cellSize            , y + cellSize * (B/(B-C)) );
      c.set( x + cellSize * (D/(D-C)), y + cellSize             );
      d.set( x                       , y + cellSize * (A/(A-D)) );

      let state = getState(ceil(A), ceil(B), ceil(C), ceil(D));

      switch (state) {
        case 0:                   break;
        case 1:   drawLine(d, a); break;
        case 2:   drawLine(a, b); break;
        case 3:   drawLine(d, b); break;
        case 4:   drawLine(c, b); break;
        case 5:   drawLine(d, a);
                  drawLine(c, b); break;
        case 6:   drawLine(a, c); break;
        case 7:   drawLine(d, c); break;
        case 8:   drawLine(c, d); break;
        case 9:   drawLine(a, c); break;
        case 10:  drawLine(d, c);
                  drawLine(a, b); break;
        case 11:  drawLine(c, b); break;
        case 12:  drawLine(d, b); break;
        case 13:  drawLine(a, b); break;
        case 14:  drawLine(d, a); break;
        case 15:                  break;
      }
    }
  }
}

function getState(A, B, C, D) {
  // Converts binary corner values to decimal state of the cell defined by A, B, C, D
  return 8 * D + 4 * C + 2 * B + A;
}

function drawLine(a, b) {
  line(a.x, a.y, b.x, b.y);
}
