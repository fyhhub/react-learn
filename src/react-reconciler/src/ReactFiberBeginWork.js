import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import { processUpdateQueue } from './ReactFiberClassUpdateQueue'
import { mountChildFibers, reconcileChildFibers } from './ReactChildFiber'
import { shouldSetTextContent } from 'react-dom-bindings/src/ReactDOMHostConfig'
import { indent } from 'shared/logger'
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
  // 处理更新队列，会合并更新
  processUpdateQueue(workInProgress)
  // 获取最新的state
  const nextState = workInProgress.memoizedState
  // 获取最新state中的子节点
  const nextChildren = nextState.element

  // 调和子节点，创建子fiber
  reconcileChildren(current, workInProgress, nextChildren)

  // 开启下一个子节点的任务
  return workInProgress.child
}

function updateHostComponent(current, workInProgress) {
  const { type, pendingProps } = workInProgress

  // 获取最新的props
  const nextProps = pendingProps

  let nextChildren = nextProps.children
  const isDirectTextChild = shouldSetTextContent(type, nextProps)

  if (isDirectTextChild) {
    nextChildren = null
  }

  reconcileChildren(current, workInProgress, nextChildren)

  return workInProgress.child
}

export function beginWork(current, workInProgress) {
  console.log(' '.repeat(indent.number) + 'beginWork', workInProgress.type, workInProgress);
  indent.number += 2
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