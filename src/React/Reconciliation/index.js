import { createTaskQueue } from '../Misc'

const taskQueue = createTaskQueue()

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
  console.log(
    '%c taskQueue: ',
    'font-size:12px;background-color: #6EC1C2;color:#fff;',
    taskQueue
  )
  console.log(
    '%c taskQueue.pop(): ',
    'font-size:12px;background-color: #FFDD4D;color:#fff;',
    taskQueue.pop()
  )

  /**
   * 指定在浏览器空闲的时间去执行任务
   */
  // requestIdleCallback(performTask)
}
