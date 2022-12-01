
export function scheduleCallback(callback) {
  // 此处后面会实现优先队列
  requestIdleCallback(callback)
}