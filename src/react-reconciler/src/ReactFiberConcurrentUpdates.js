import { HostRoot } from "./ReactWorkTags"


export function markUpdateLaneFromFiberToRoot(sourceFiber) {
  // 当前fiber
  let node = sourceFiber

  // 当前节点的父fiber
  let parent = sourceFiber.parent

  // 不断找父fiber, 一直找到根fiber
  while(parent != null) {
    node = parent
    parent = parent.return
  }
  if (node.tag === HostRoot) {
    // 返回 FiberRoot
    return node.stateNode
  }


  return null
}