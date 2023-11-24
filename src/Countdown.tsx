import { createSignal } from 'solid-js';
import styles from './Countdown.module.css';
import { myConfetti } from './confetti';

export const Countdown = () => {
  const [timerOrMessage, setTimerOrMessage] =
    createSignal('Loading...');
  const date = new Date('Dec 8, 2023, 17:00').getTime();

  var duration = 60 * 10000;
  var end = Date.now() + duration;

  const start = () => {
    // launch a few confetti from the left edge
    myConfetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    // and launch a few from the right edge
    myConfetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    // keep going until we are out of time
    if (Date.now() < end) {
      requestAnimationFrame(start);
    }
  };

  const counter = setInterval(() => {
    const now = new Date().getTime();
    const distance = date - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setTimerOrMessage(
      days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's '
    );

    if (distance < 0) {
      clearInterval(counter);
      setTimerOrMessage('JULBORD!!!!');
      start();
    }
  }, 1000);
  return (
    <div class={styles.Countdown}>
      <h1>{timerOrMessage()}</h1>
    </div>
  );
};
