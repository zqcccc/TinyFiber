import { createTaskQueue, arrified, createStateNode, getTag } from '../Misc'

/**
 * 任务队列
 */
const taskQueue = createTaskQueue()
/**
 * 子任务 fiber
 */
let subTask = null
/**
 * 等待提交的根 fiber
 */
let pendingCommit = null

/**
 * 这里的 task 其实是一个 fiber 对象
 */
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

/**
 * 这里的 fiber 其实是根节点对象，直接拿 effects 数组就是所有的 fiber
 */
function commitAllWork(fiber) {
  fiber.effects.forEach((item) => {
    if (item.effectTag === 'placement') {
      let fiber = item
      let parentFiber = item.parent
      while (
        parentFiber.tag === 'class_component' ||
        parentFiber.tag === 'function_component'
      ) {
        parentFiber = parentFiber.parent
      }
      if (fiber.tag === 'host_component') {
        parentFiber.stateNode.appendChild(fiber.stateNode)
      } // 类组件本身也是个节点，但是是不处理的，因为它不能追加节点，只能向类组件父级中不是类组件的那个节点去 appendChild 添加类组件里的内容
    }
  })
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
      effectTag: 'placement',
      parent: fiber,
    }

    newFiber.stateNode = createStateNode(newFiber)
    console.log(
      '%c newFiber: ',
      'font-size:12px;background-color: #FCA650;color:#fff;',
      newFiber
    )

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
  if (fiber.tag === 'class_component') {
    reconcileChildren(fiber, fiber.stateNode.render())
  } else if (fiber.tag === 'function_component') {
    reconcileChildren(fiber, fiber.stateNode(fiber.props))
  } else {
    reconcileChildren(fiber, fiber.props.children)
  }
  if (fiber.child) {
    return fiber.child
  }
  let currentExecutedFiber = fiber
  while (currentExecutedFiber.parent) {
    /**
     * 父级 effects 数组等于 父级 effects 合并当前 fiber 的 effects 再加当前 fiber，这样父级 effects 数组就有了所有的子级对象
     * 这样在最外层的 fiber 对象的 effects 数组中就会有所有的子级 fiber
     */
    currentExecutedFiber.parent.effects = currentExecutedFiber.parent.effects.concat(
      currentExecutedFiber.effects.concat(currentExecutedFiber)
    )
    if (currentExecutedFiber.sibling) {
      return currentExecutedFiber.sibling
    }
    // 这个循环如果能走到这步，说明没有同级没有兄弟元素了，需要不停的往上找父级了，最后会走到根节点
    currentExecutedFiber = currentExecutedFiber.parent
  }
  pendingCommit = currentExecutedFiber
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

  // 能走到这就是第二阶段了，所有的 fiber 都整理好了
  if (pendingCommit) {
    // 等待提交的 commit 就是根节点fiber
    commitAllWork(pendingCommit)
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
