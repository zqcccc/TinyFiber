import React, { render, Component } from './React'

const root = document.getElementById('root')

const jsx = (
  <div>
    <p>Hello React</p>
    <p>Hi Fiber</p>
    <div>奥利给</div>
  </div>
)
// console.log(
//   '%c jsx: ',
//   'font-size:12px;background-color: #465975;color:#fff;',
//   jsx
// )

render(jsx, root)

setTimeout(() => {
  const jsx = (
    <div>
      <div>奥利给</div>
      <p>Hi Fiber</p>
    </div>
  )
  render(jsx, root)
}, 2000)

class Greeting extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <div>{this.props.title} hahahahha</div>
  }
}

// render(<Greeting title='Hello' />, root)

function FnComponent(props) {
  return <div>{props.title} FnComponent</div>
}

// render(<FnComponent title='Hello' />, root)
