import { HostComponent, HostRoot, HostText, IndeterminateComponent } from './ReactWorkTags'
import { NoFlags } from './ReactFiberFlags'

/**
 * @param {*} tag fiber类型 0 函数组件  1 类组件  5 原生组件 3 根元素
 * @param {*} pendingProps 新props
 * @param {*} key 
 */
export function FiberNode(tag, pendingProps, key) {
  this.tag = tag;
  this.key = key
  this.type = null
  this.stateNode = null // 一般指向dom节点，根root指向的是fiberRoot

  this.return = null
  this.child = null
  this.sibling = null

  this.pendingProps = pendingProps // 新props
  this.memoizedProps = null // 旧props

  // 类组件存的是实例的状态
  // hostRoot存储的是要渲染的dom元素
  this.memoizedState = null

  // 存储更新的队列
  this.updateQueue = null

  // 副作用标识
  this.flags = NoFlags

  // 子节点的副作用标识
  this.subtreeFlags = NoFlags

  this.alternate = null
}

export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key)
}

export function createHostRootFiber() {
  return createFiber(HostRoot)
}


// 基于老fiber 创建新属性 新的fiber
export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate

  // 创建新fiber
  if (workInProgress == null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key)
    workInProgress.type = current.type
    workInProgress.stateNode = current.stateNode
    workInProgress.alternate = current
  } else {
    // 复用老fiber
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type
    workInProgress.flags = NoFlags
    workInProgress.subtreeFlags = NoFlags
  }
  workInProgress.child = current.child
  workInProgress.memoizedProps = current.memoizedProps
  workInProgress.memoizedState = current.memoizedState
  workInProgress.updateQueue = current.updateQueue
  workInProgress.sibling = current.sibling
  workInProgress.index = current.index
  return workInProgress
}

/**
 * 根据虚拟dom创建fiber节点
 * @param {*} element 
 */
export function createFiberFromElement(element) {
  const { type, key, props } = element

  return createFiberFromTypeAndProps(type, key, props)
}

function createFiberFromTypeAndProps(type, key, pendingProps) {
  let tag = IndeterminateComponent;

  if (typeof type === 'string') {
    tag = HostComponent
  }
  const fiber = createFiber(tag, pendingProps, key)
  fiber.type = type
  return fiber
}

export function createFiberFromText(content) {
  return createFiber(HostText, content, null)
}
