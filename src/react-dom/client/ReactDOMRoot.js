import { createContainer, updateContainer } from 'react-reconciler/src/ReactFiberReconciler'

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot
}

ReactDOMRoot.prototype.render = function(children) {
  const root = this._internalRoot

  // 更新container
  updateContainer(children, root)
}

export function createRoot(container) {
  // 1. 创建FiberRoot
  // 2. 创建RootFiber
  // 3. 建立 current 和 stateNode关联
  const root = createContainer(container)

  // 把FiberRoot再包一层
  return new ReactDOMRoot(root)
}