import { createInterface } from 'readline';

const stepByStep = process.argv[2] === '--step-by-step';
const rl = createInterface(process.stdin, process.stdout);

export function waitForConfirmation() {
  return new Promise<void>(resolve => {
    if (!stepByStep) {
      resolve();
    } else {
      rl.question('Press any key to continue.', () => {
        resolve();
      });
    }
  });
}
