import { createFiberRoot } from './ReactFiberRoot'
import { enqueueUpdate, createUpdate } from 'react-reconciler/src/ReactFiberClassUpdateQueue'
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop'
export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo)
}


export function updateContainer(element, container) {
  // rootFiber 获取当前fiber
  const current = container.current

  // 创建更新
  const update = createUpdate()

  update.payload = { element }

  // 加入更新队列
  const root = enqueueUpdate(current, update)

  // 开始调度，从根fiber开始
  scheduleUpdateOnFiber(root)
}
