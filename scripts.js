const canvas = document.getElementById("canvas").transferControlToOffscreen();
const worker = new Worker("worker.js");
const restartBtn = document.getElementById("restart");
const rules = document.getElementById("rules");
const timer = document.getElementById("time");

function main() {
  params = getParams();

  worker.postMessage({
    params,
    type: "reload",
  });
}

function getParams() {
  const width = window.innerWidth;
  const height = window.innerHeight - rules.clientHeight;

  const getValueById = (id) => Number(document.getElementById(id).value ?? 0);

  const cellSize = getValueById("cellSize") ?? 5;

  return {
    rule1: getValueById("rule1"),
    rule2: getValueById("rule2"),
    rule4: getValueById("rule4"),
    fps: getValueById("fps"),
    populationSeed: getValueById("populationSeed"),
    cellColor: "#57fcc5ff",
    cellSize,
    cols: Math.floor(width / cellSize),
    rows: Math.floor(height / cellSize),
    width,
    height,
  };
}

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", (x) => {
    input.nextSibling.textContent = x.target.value;

    worker.postMessage({
      params: getParams(),
      type: "update",
    });
  });
});

worker.postMessage({ canvas, type: "init" }, [canvas]);
main();

restartBtn.addEventListener("click", main);

window.addEventListener("resize", main);

worker.onmessage = (event) => {
  if (event.data.type === "status") {
    timer.textContent = `${event.data.timer} / ${event.data.fps}fps`;
  }

  if (event.data.type === "end") {
    timer.textContent = "end";
  }
};
