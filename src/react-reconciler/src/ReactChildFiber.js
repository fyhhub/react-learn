import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { createFiberFromElement } from './ReactFiber'
import { Placement } from './ReactFiberFlags';
// shouldTrackSideEffects 是否跟踪副作用
function createChildReconciler(shouldTrackSideEffects) {

  function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
    // 没有老节点，直接创建新fiber节点
    const created = createFiberFromElement(element)

    created.return = returnFiber;

    return created
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
   * @param {*} returnFiber 新父fiber
   * @param {*} currentFirstFiber 老父fiber的 第一个子fiber
   * @param {*} newChild 子vdom
   */
  function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
    if (typeof newChild === 'object' && newChild != null) {
      switch(newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstFiber, newChild))
      }
    }
  }
  return reconcileChildFibers
}

// 有老fiber 更新的时候
export const mountChildFibers = createChildReconciler(true)

// 没有老fiber
export const reconcileChildFibers = createChildReconciler(false)