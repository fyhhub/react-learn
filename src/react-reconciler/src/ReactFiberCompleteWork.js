import { indent } from 'shared/logger'
import { HostComponent, HostText } from './ReactWorkTags';
import { NoFlags } from './ReactFiberFlags';
import { createInstance, createTextInstance, appendInitialChild } from 'react-dom-bindings/src/ReactDOMHostConfig';

function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child

  while(node) {
    appendInitialChild(parent, child)
    node = node.sibling
  }
}

/**
 * 
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 */
export function completeWork(current, workInProgress) {
  indent.number -= 2
  console.log(' '.repeat(indent.number) + 'completeWork', workInProgress);

  const newProps = workInProgress.pendingProps

  switch (workInProgress.tag) {
    case HostComponent:
      const { type } = workInProgress
      // 创建真实dom节点
      const instance = createInstance(type, newProps, workInProgress)

      workInProgress.stateNode = instance

      appendAllChildren(instance, workInProgress)
      // 把儿子添加到自己身上
    case HostText:
      const newText = newProps
      // 创建真实dom节点
      workInProgress.stateNode = createTextInstance(newText)
      // 向上冒泡属性
      bubbleProperties(workInProgress)
      break
  }
}

function bubbleProperties(completedWork) {
  let subtreeFlags = NoFlags
  let child = completeWork.child
  while (child != null) {
    // 孙子节点的副作用
    subtreeFlags |= child.subtreeFlags
    // 孩子的副作用
    subtreeFlags |= child.flags
    child = child.sibling
  }
  completedWork.subtreeFlags = subtreeFlags
}