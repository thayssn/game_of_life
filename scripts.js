const canvas = document.getElementById("canvas");
const restartBtn = document.getElementById("restart");
const rules = document.getElementById("rules");
const ctx = canvas.getContext("2d");
const backgroundColor = "teal";
const cellColor = "#57fcc5ff";
const cellSize = 15;
const rulesHeight = rules.clientHeight;
console.log(rulesHeight);
const width = window.innerWidth;
const height = window.innerHeight - rulesHeight;
const cols = Math.floor(width / cellSize);
const rows = Math.floor(height / cellSize);

let updateRate, duration, populationSeed, rule1, rule2, rule4, interval;

const getNeighbors = (index, cells) => {
  const neighborsIndexes = [
    index - cols - 1, // up left
    index - cols, // up
    index - cols + 1, // up right
    index - 1, // left
    index + 1, // right
    index + cols - 1, // bottom left
    index + cols, // bottom
    index + cols + 1, // bottom right
  ];

  const validNeighbors = neighborsIndexes.filter(
    (x) => x >= 0 && x < cells.length
  );
  return validNeighbors.map((x) => cells[x]);
};

function updateCells(cells) {
  const newCells = Array(cells.length);
  for (let i = 0; i < cells.length; i++) {
    const currentCell = cells[i];
    const neighbors = getNeighbors(i, cells);
    const aliveNeighbors = neighbors.filter((x) => x > 0).length;
    if (currentCell === 1) {
      if (aliveNeighbors < rule1) {
        newCells[i] = 0;
        continue;
      }

      if (aliveNeighbors <= rule2) {
        newCells[i] = 1;
        continue;
      }

      newCells[i] = 0;
    } else {
      if (aliveNeighbors === rule4) {
        newCells[i] = 1;
      } else {
        newCells[i] = 0;
      }
    }
  }

  return newCells;
}

function draw(cells) {
  ctx.clearRect(0, 0, width, height);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (cells[row * cols + col] === 1) {
        ctx.fillStyle = cellColor;
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }
}

function seed() {
  return Array.from({ length: rows * cols }, () =>
    Math.random() >= populationSeed ? 1 : 0
  );
}

function update(cells) {
  const updatedCells = updateCells(cells);
  requestAnimationFrame(() => draw(updatedCells));
  return updatedCells;
}

function main() {
  rule1 = Number(document.getElementById("rule1").value);
  rule2 = Number(document.getElementById("rule2").value);
  rule4 = Number(document.getElementById("rule4").value);
  updateRate = Number(document.getElementById("updateRate").value);
  duration = Number(document.getElementById("duration").value);
  populationSeed = Number(document.getElementById("populationSeed").value);

  canvas.width = width;
  canvas.height = height;
  clearInterval(interval);
  let cells = seed();
  interval = setInterval(() => {
    cells = update(cells);
  }, updateRate);

  setTimeout(() => {
    clearInterval(interval);
  }, duration);
}

main();

restartBtn.addEventListener("click", main);

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", (x) => {
    input.nextSibling.textContent = x.target.value;
  });
});
