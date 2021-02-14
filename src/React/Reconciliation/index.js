import { createTaskQueue, arrified, createStateNode, getTag } from '../Misc'

const taskQueue = createTaskQueue()
let subTask = null

// 这里的 task 其实是一个 fiber 对象
function getFirstTask() {
  const task = taskQueue.pop()
  return {
    props: task.props,
    stateNode: task.dom,
    tag: 'host_root',
    effects: [],
    child: null,
  }
}

function reconcileChildren(fiber, children) {
  // children 有可能是对象也有可能是数组，需要将 children 转成数组
  const arrifiedChildren = arrified(children)

  let index = 0
  let numberOfElements = arrifiedChildren.length
  let element = null
  let newFiber = null
  let preFiber = null

  while (index < numberOfElements) {
    element = arrifiedChildren[index]
    newFiber = {
      type: element.type,
      props: element.props,
      tag: getTag(element),
      effects: [],
      effectTag: '',
      parent: fiber,
    }

    newFiber.stateNode = createStateNode(newFiber)

    if (index === 0) {
      fiber.child = newFiber
    } else {
      preFiber.sibling = newFiber
    }

    preFiber = newFiber

    index++
  }
}

function executeTask(fiber) {
  reconcileChildren(fiber, fiber.props.children)
  console.log(
    '%c fiber: ',
    'font-size:12px;background-color: #4b4b4b;color:#fff;',
    fiber
  )
}

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
