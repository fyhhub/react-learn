import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import { processUpdateQueue } from './ReactFiberClassUpdateQueue'
import { mountChildFibers, reconcileChildFibers } from './ReactChildFiber'

function reconcileChildren(current, workInProgress, nextChildren) {
  // 没有老fiber 说明是新创建的
  if (current == null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren)
  } else {
    // 此处说明有老fiber  要进行diff算法，用老fiber和新vdom进行对比
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren)
  }
}

function updateHostRoot(current, workInProgress) {
  processUpdateQueue(workInProgress)
  const nextState = workInProgress.memoizedState
  const nextChildren = nextState.element
  debugger
  reconcileChildren(current, workInProgress, nextChildren)

  // 开启下一个子节点的任务
  return workInProgress.child
}

function updateHostComponent(current, workInProgress) {

}

export function beginWork(current, workInProgress) {
  console.log('beginWork', workInProgress);
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress)

    case HostComponent:
      return updateHostComponent(current, workInProgress)
    case HostText:
      return null
    default:
      return null
  }
}