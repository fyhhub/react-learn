import { indent } from 'shared/logger'
export function completeWork(current, workInProgress) {
  indent.number -= 2
  console.log(' '.repeat(indent.number) + 'completeWork', workInProgress);
}