import { scheduleCallback } from 'scheduler'
import { createWorkInProgress } from './ReactFiber'
import { beginWork } from './ReactFiberBeginWork'
import { completeWork } from './ReactFiberCompleteWork'
let workInProgress = null


export function scheduleUpdateOnFiber(root) {
  // 确保调度执行 root上的更新
  ensureRootIsScheduled(root)
}


function ensureRootIsScheduled(root) {

  // 告诉浏览器 要执行 performConcurrentWorkOnRoot
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root))
}

function performConcurrentWorkOnRoot(root) {
  // 以同步的方式渲染根节点
  renderRootSync(root)
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null)
}

function renderRootSync(root) {
  prepareFreshStack(root)

  workLoopSync()
}

function workLoopSync() {
  while(workInProgress != null) {
    performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(unitOfWork) {
  // 获取老fiber
  const current = unitOfWork.alternate

  const next = beginWork(current, unitOfWork)

  unitOfWork.memoizedProps = unitOfWork.pendingProps

  // 没有子节点
  if (next == null) {
    completeUnitOfWork(unitOfWork)
  } else {
    // 有子节点，就把子节点作为下一个工作单元
    workInProgress = next
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork

  do {
    const current = completedWork.alternate
    const returnFiber = completedWork.return
    // 1. 先去完成自己
    completeWork(current, completedWork)

    // 2. 找兄弟节点, 去完成
    const siblingFiber = completedWork.sibling
    if (siblingFiber != null) {
      workInProgress = siblingFiber
      return
    }

    // 3. 如果兄弟节点都处理完了，就完成父fiber
    completedWork = returnFiber
    workInProgress = completedWork
  } while(completedWork != null)
}