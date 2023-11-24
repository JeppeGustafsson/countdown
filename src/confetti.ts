import confetti from "canvas-confetti";

const myCanvas = document.getElementById('canvas');

const myConfetti = confetti.create(myCanvas, {
  resize: true,
  useWorker: true,
});

export { myConfetti };
