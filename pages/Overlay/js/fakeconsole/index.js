import './style.scss'
import { random, deleteFromArray, NO_OP } from '../utils/object'
import { TextWarn, TextSuccess, TextLabel, TextFail, TextLoading } from './text/texts.js'

import { generateEntry } from './fake-logs.js'

// const typeList = Object.values(Types)
// typeList.push(...new Array(10).fill(Types.NORMAL))

export default class FakeConsole {
  constructor(options) {
    this.params = {
      attributes: {},
      parent: document.body,
      maxMessages: 20,
      entriesInterval: () => Infinity,
      ...options
    }

    this.elem = document.createElement('div')
    this.elem.classList.add('fakeConsole')
    this.params.parent.appendChild(this.elem)
    this.nextTrigger = performance.now() + this.params.entriesInterval()

    this.setAttributes(this.params.attributes)
    this.setVisibility(true)

    this.messages = []
  }
  update() {
    const timeNow = performance.now()
    if (this.nextTrigger < timeNow && this.messages.length < this.params.maxMessages) {
      this.nextTrigger = timeNow + this.params.entriesInterval()
      this.addEntry()
    }

    for (let i = this.messages.length; i--;) {
      const message = this.messages[i]

      message.update(timeNow)
    }
  }

  setVisibility(visible, delay) {
    if (this.pendingVisibility === visible) return;
    this.pendingVisibility = visible
    clearTimeout(this.visibilityTimeout)
    this.visibilityTimeout = setTimeout(() => {
      this.setAttributes({ dataset: { hidden: !visible } })
    }, delay)
  }

  addEntry(textInstance = generateEntry()) {

    this.elem.append(textInstance.elem)

    textInstance.on('destroy', elem => {
      deleteFromArray(this.messages, elem)
    })
    this.messages.push(textInstance)
  }

  setAttributes(options, elem = this.elem) {
    Object.entries(options).forEach(([name, value]) => {
      const prop = elem[name]

      if (prop instanceof CSSStyleDeclaration) return this.setAttributes(value, prop)
      else if (prop instanceof DOMTokenList) prop.add(value)
      else if (prop instanceof DOMStringMap) return this.setAttributes(value, prop)
      else elem[name] = value
      //   elem.add(value)
      // } else elem[name] = value
    })
  }
}
