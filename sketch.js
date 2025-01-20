let numPoints = 23;
let points = [];
let central = [];
let metroLines = [];
let connectedOuterPoints = new Set();

function setup() {
  createCanvas(800, 800);
  strokeCap(ROUND);

  generateCity();
}

function generateCity() {
  points = [];
  central = [];
  metroLines = [];
  connectedOuterPoints = new Set();

  generateOuter(22);
  generateCentral(21);
  while (connectedOuterPoints.size < points.length) {
    generateMetroLine();
  }

  redraw();
}

function generateOuter(lineAmount) {
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = random(width / 2, width / 2);

  for (let i = 0; i < lineAmount; i++) {
    let angle = TAU / lineAmount;
    let x = centerX + cos(angle * i) * random(width / 4, radius);
    let y = centerY + sin(angle * i) * random(width / 4, radius);
    points.push(createVector(x, y));
  }
}

function generateCentral(numCentralPoints) {
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = random(width / 6, width / 5);

  for (let i = 0; i < numCentralPoints; i++) {
    let angle = TAU / numCentralPoints;
    let x = centerX + cos(angle * i) * random(radius);
    let y = centerY + sin(angle * i) * random(radius);
    central.push(createVector(x, y));
  }
}

function generateMetroLine() {
  let startIndex = floor(random(points.length - 3));
  let outerStartPoint = points[startIndex];

  let closestIndex = 0;
  let furthestIndex = 0;
  let closestDistance = Infinity;
  let furthestDistance = 0;

  for (let i = 0; i < central.length; i++) {
    let distance = p5.Vector.dist(outerStartPoint, central[i]);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
    if (distance > furthestDistance) {
      furthestDistance = distance;
      furthestIndex = i;
    }
  }

  let closestPoint = central[closestIndex];
  let furthestPoint = central[furthestIndex];

  let outerFinishPoint;
  let finishIndex = (startIndex + 2 + floor(random(points.length - 4))) % points.length;
  outerFinishPoint = points[finishIndex];

  metroLines.push([outerStartPoint, closestPoint, furthestPoint, outerFinishPoint]);
  connectedOuterPoints.add(outerStartPoint);
  connectedOuterPoints.add(outerFinishPoint);
}

function draw() {
  background(0);
  drawMetroLines();
  drawCentral();
  drawStations();
  noLoop();
}

function drawStations() {
  noStroke();
  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    fill(random([color(255, 238, 204), color(255, 221, 204), color(255, 204, 204), color(254, 187, 204)]));
    ellipse(point.x, point.y, 10, 10);
  }
}

function drawCentral() {
  noStroke();
  for (let i = 0; i < central.length; i++) {
    let centralStation = central[i];
    fill(random([color(255, 243, 199), color(254, 199, 180), color(252, 129, 158), color(247, 65, 143)]));
    ellipse(centralStation.x, centralStation.y, 10, 10);
  }
}

function drawMetroLines() {
  for (let i = 0; i < metroLines.length; i++) {
    let linePoints = metroLines[i];
    let metroColor = color(random([255, 243, 199]), random([254, 199, 180]), random([252, 129, 158]));
    drawMetroLine(linePoints, metroColor);
  }
}

function drawMetroLine(linePoints, metroColor) {
  stroke(metroColor);
  strokeWeight(5);

  for (let i = 0; i < linePoints.length - 1; i++) {
    let currentPoint = linePoints[i];
    let nextPoint = linePoints[i + 1];
    let dx = nextPoint.x - currentPoint.x;
    let dy = nextPoint.y - currentPoint.y;

    let absDX = abs(dx);
    let absDY = abs(dy);

    let dirX = dx > 0 ? 1 : -1;
    let dirY = dy > 0 ? 1 : -1;

    let startX = currentPoint.x;
    let startY = currentPoint.y;
    let endX = startX + dirX * min(absDX, absDY);
    let endY = startY + dirY * min(absDX, absDY);

    line(startX, startY, endX, endY);

    if (absDX > absDY) {
      line(endX, endY, endX + dirX * (absDX - absDY), endY);
      line(endX + dirX * (absDX - absDY), endY, endX + dirX * (absDX - absDY), nextPoint.y);
      line(endX + dirX * (absDX - absDY), nextPoint.y, nextPoint.x, nextPoint.y);
    } else if (absDY > absDX) {
      line(endX, endY, endX, endY + dirY * (absDY - absDX));
      line(endX, endY + dirY * (absDY - absDX), nextPoint.x, endY + dirY * (absDY - absDX));
      line(nextPoint.x, endY + dirY * (absDY - absDX), nextPoint.x, nextPoint.y);
    }
  }
}
