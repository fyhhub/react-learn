import { scheduleCallback } from 'scheduler'
import { createWorkInProgress } from './ReactFiber'
import { beginWork } from './ReactFiberBeginWork'
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
    // completeUnitOfWork(unitOfWork)
    workInProgress = null
  } else {
    // 有子节点，就把子节点作为下一个工作单元
    workInProgress = next
  }
}