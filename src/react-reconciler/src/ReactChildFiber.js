import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { createFiberFromElement, createFiberFromText } from './ReactFiber'
import { Placement } from './ReactFiberFlags';
// shouldTrackSideEffects 是否跟踪副作用
function createChildReconciler(shouldTrackSideEffects) {

  function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
    // 没有老节点，直接创建新fiber节点
    const created = createFiberFromElement(element)

    created.return = returnFiber;

    return created
  }


  function createChild(returnFiber, currentFirstFiber, element) {
    if ((typeof element === 'string' && element !== '') || typeof element === 'number') {
      const created = createFiberFromText(element)
      created.return = returnFiber;
      return created
    }

    if (typeof element === 'object' && element != null) {
      switch (element.$$typeof) {
        case REACT_ELEMENT_TYPE:
          const created = createFiberFromElement(element)
          created.return = returnFiber;
          return created
      }
    }
  }

  function placeChild(newFiber, newIndex) {
    newFiber.index = newIndex

    if (shouldTrackSideEffects) {
      // 标记创建
      newFiber.flags |= Placement
    }
  }

  function reconcileChildrenArray(returnFiber, currentFirstFiber, newChildren) {
    // 后面要返回的第一个child
    let resultingFirstChild = null

    // 上一个新fiber
    let previousNewFiber = null

    let newIndex = 0
    for (;newIndex < newChildren.length;newIndex++) {
      const newFiber = createChild(returnFiber, currentFirstFiber, newChildren[newIndex])
      if (!newFiber) continue

      placeChild(newFiber, newIndex)

      // 为了找到 newChildren 中的一个fiber
      if (previousNewFiber == null) {
        // 这里只是用 resultingFirstChild 标记了一下第一个子fiber
        resultingFirstChild = newFiber
      } else {
        // previousNewFiber 永远都指向最新的fiber
        previousNewFiber.sibling = newFiber
      }
      previousNewFiber = newFiber
    }
    return resultingFirstChild
  }

  function placeSingleChild(newFiber) {
    // 如果为true, 说明必定是创建节点，需要标记插入
    if (shouldTrackSideEffects) {
      newFiber.flags |= Placement
    }
    return newFiber
  }
  /**
   * 此函数的作用：老fiber和新vdom diff
   * 1. 创建子vdom的 fiber
   * 2. place 标记fiber是创建还是其他的， 其实就是diff算法
   * @param {*} returnFiber 新父fiber
   * @param {*} currentFirstFiber 老父fiber的 第一个子fiber
   * @param {*} newChild 子vdom
   */
  function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
    if (typeof newChild === 'object' && newChild != null) {
      switch(newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstFiber, newChild))
        default:
          break
      }
    }

    if (Array.isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild)
    }
    return null
  }
  return reconcileChildFibers
}

// 有老fiber 更新的时候
export const mountChildFibers = createChildReconciler(true)

// 没有老fiber
export const reconcileChildFibers = createChildReconciler(false)