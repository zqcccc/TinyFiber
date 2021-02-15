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

// render(jsx, root)

// setTimeout(() => {
//   const jsx = (
//     <div>
//       <div>奥利给</div>
//       <p>Hi Fiber</p>
//     </div>
//   )
//   render(jsx, root)
// }, 2000)

class Greeting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '张三',
    }
  }
  render() {
    return (
      <div>
        {this.props.title} hahahahha {this.state.name}
        <button onClick={() => this.setState({ name: '李四' })}>button</button>
      </div>
    )
  }
}

render(<Greeting title='Hello' />, root)

function FnComponent(props) {
  return <div>{props.title} FnComponent</div>
}

// render(<FnComponent title='Hello' />, root)
