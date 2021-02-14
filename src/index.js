import React, { render } from './React'

const root = document.getElementById('root')

const jsx = (
  <div>
    <p>Hello React</p>
    <p>Hi Fiber</p>
  </div>
)
console.log(
  '%c jsx: ',
  'font-size:12px;background-color: #465975;color:#fff;',
  jsx
)

render(jsx, root)
