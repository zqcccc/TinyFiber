import { createTaskQueue } from '../Misc'

const taskQueue = createTaskQueue()
let subTask = null

function getFirstTask() {}

function executeTask(fiber) {}

function workLoop(deadline) {
  // 如果子任务不存在就去获取子任务
  if (!subTask) {
    subTask = getFirstTask()
  }

  // 如果任务存在并且浏览器有空余时间就调用
  while (subTask && deadline.timeRemaining() > 1) {
    subTask = executeTask(subTask)
  }
}

function performTask(deadline) {
  workLoop(deadline)
  if (subTask || !taskQueue.isEmpty()) {
    requestIdleCallback(performTask)
  }
}

export const render = (element, dom) => {
  /**
   * 1. 向任务队列中添加任务
   * 2. 指定在浏览器空闲时执行任务
   */
  /**
   * 任务就是通过 vdom 对象 构建 fiber 对象
   */
  taskQueue.push({
    dom,
    props: { children: element },
  })

  /**
   * 指定在浏览器空闲的时间去执行任务
   */
  requestIdleCallback(performTask)
}
