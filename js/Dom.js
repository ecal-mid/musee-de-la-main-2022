export default class Dom {

  constructor(type, attributes = {}) {
    this.elem = document.createElement(type)
    this.attr(attributes)
  }

  appendTo(parent) {
    parent.append(this.elem)
  }

  prependTo(parent) {
    parent.prepend(this.elem)
  }

  destroy() {
    this.elem.remove()
  }

  query(queryString) {
    return this.elem.querySelector(queryString)
  }

  append(...domInstances) {
    domInstances.forEach(domInstance => this.elem.pushTo(domInstance.elem))
  }

  prepend(...domInstances) {
    domInstances.reverse().forEach(domInstance => this.elem.prepend(domInstance.elem))
  }

  attr(options, elem = this.elem) {
    Object.entries(options).forEach(([name, value]) => {
      const prop = elem[name]

      if (prop instanceof CSSStyleDeclaration) return this.attr(value, prop)
      else if (prop instanceof DOMTokenList) prop.add(value)
      else if (prop instanceof DOMStringMap) return this.attr(value, prop)
      else elem[name] = value
      //   elem.add(value)
      // } else elem[name] = value
    })
  }
}