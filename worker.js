let canvas, ctx, animation;
let params = {};

function getNeighbors(index, cells) {
  const neighborsIndexes = [
    index - params.cols - 1, // up left
    index - params.cols, // up
    index - params.cols + 1, // up right
    index - 1, // left
    index + 1, // right
    index + params.cols - 1, // bottom left
    index + params.cols, // bottom
    index + params.cols + 1, // bottom right
  ];

  const validNeighbors = neighborsIndexes.filter(
    (x) => x >= 0 && x < cells.length
  );
  return validNeighbors.map((x) => cells[x]);
}

function updateCells(cells) {
  const newCells = Array(cells.length);
  for (let i = 0; i < cells.length; i++) {
    const currentCell = cells[i];
    const neighbors = getNeighbors(i, cells);
    const aliveNeighbors = neighbors.filter((x) => x > 0).length;
    if (currentCell === 1) {
      if (aliveNeighbors < params.rule1) {
        newCells[i] = 0;
        continue;
      }

      if (aliveNeighbors <= params.rule2) {
        newCells[i] = 1;
        continue;
      }

      newCells[i] = 0;
    } else {
      if (aliveNeighbors === params.rule4) {
        newCells[i] = 1;
      } else {
        newCells[i] = 0;
      }
    }
  }

  return newCells;
}

function draw(cells) {
  ctx.clearRect(0, 0, params.width, params.height);

  for (let row = 0; row < params.rows; row++) {
    for (let col = 0; col < params.cols; col++) {
      if (cells[row * params.cols + col] === 1) {
        ctx.fillStyle = params.cellColor;
        ctx.fillRect(
          col * params.cellSize,
          row * params.cellSize,
          params.cellSize,
          params.cellSize
        );
      }
    }
  }
}

function seed() {
  return Array.from({ length: params.rows * params.cols }, () =>
    Math.random() >= params.populationSeed ? 1 : 0
  );
}

function update(cells) {
  const updatedCells = updateCells(cells);
  draw(updatedCells);
  return updatedCells;
}

function getAnimation() {
  cancelAnimationFrame(animation);
  animation = null;
  let cells = seed();
  let start,
    elapsed,
    totalElapsed = 0,
    lastFrame = Date.now();

  const animate = (time) => {
    if (!start) start = time;
    totalElapsed = time - start;
    elapsed = Date.now() - lastFrame;

    if (elapsed > 1000 / params.fps) {
      cells = update(cells);
      lastFrame = Date.now();
      this.postMessage({
        timer: Math.floor(totalElapsed / 1000),
        fps: Math.max(1, Math.floor(1000 / elapsed)),
        type: "status",
      });
    }

    animation = requestAnimationFrame(animate);
  };

  animation = requestAnimationFrame(animate);
}

onmessage = (event) => {
  if (event.data.type === "init") {
    canvas = event.data.canvas;
    ctx = canvas.getContext("2d");
    return;
  }

  if (event.data.type === "reload") {
    params = event.data.params;
    canvas.width = params.width;
    canvas.height = params.height;
    getAnimation();
    return;
  }

  if (event.data.type === "update") {
    params = event.data.params;
  }
};
