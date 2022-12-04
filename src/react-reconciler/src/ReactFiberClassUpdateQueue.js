import { markUpdateLaneFromFiberToRoot } from './ReactFiberConcurrentUpdates'
import assign from 'shared/assign'
export const UpdateState = 0
export function initialUpdateQueue(fiber) {
  const queue = {
    shared: {
      pending: null // 此处pending是个循环链表
    }
  }
  fiber.updateQueue = queue
}

export function createUpdate() {
  const update = { tag: UpdateState }

  return update
}

export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue.shared
  const pending = updateQueue.pending
  if (pending == null) {
    update.next = update
  } else {
    update.next = pending.next
    pending.next = update
  }
  fiber.updateQueue.shared.pending = update

  // 返回 FiberRoot
  return markUpdateLaneFromFiberToRoot(fiber)
}

// 根据老状态和更新队列中的更新计算最新的状态
export function processUpdateQueue(workInProgress) {
  const queue = workInProgress.updateQueue

  const pendingQueue = queue.shared.pending

  // 更新队列存在
  if (pendingQueue != null) {

    // 后面即将使用队列 先清空
    queue.shared.pending = null

    // pending默认指向最后一个
    const lastPendingQueue = pendingQueue
    // 获取第一个更新
    const firstPendingUpdate = lastPendingQueue.next

    // 切断循环链表
    lastPendingQueue.next = null

    let newState = workInProgress.memoizedState
    let update = firstPendingUpdate
    while(update) {
      // 根据老状态更新
      newState = getStateFromUpdate(update, newState)
      update = update.next
    }
    workInProgress.memoizedState = newState
  }
}

// 用新状态 更新老状态
function getStateFromUpdate(update, prevState) {
  switch (update.tag) {
    case UpdateState:
      const { payload } = update;
      return assign({}, prevState, payload)
  }
}