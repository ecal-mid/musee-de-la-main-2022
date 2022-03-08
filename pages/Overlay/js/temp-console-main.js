import '../styles/main.scss'
import FakeConsole from './fakeconsole/index.js'

const console = new FakeConsole({
  parent: document.body,
})

requestAnimationFrame(update)

function update() {
  requestAnimationFrame(update)

  console.update()
}