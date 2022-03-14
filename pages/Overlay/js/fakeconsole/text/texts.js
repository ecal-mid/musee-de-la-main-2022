import _Text from "./Text"

export class TextLoading extends _Text {
  constructor(opts) {
    super(opts)

    this.label = new TextLabel({ attributes: { textContent: 'chargement', classList: 'label--loading' } })
    this.progress = new Text({ attributes: { classList: 'slider' } })

    this.unshift(this.label)
    this.push(this.progress)

    this.completion = 0

    this.on('stateChange', (state) => {

      if (this.is(Text.state.FADEOUT)) this.label.setAttributes({ textContent: 'succès', classList: 'label--success' })
    })
  }
  update(time) {

    super.update(...arguments)

    const pass = Math.random() > 0.1

    if (this.is(Text.state.ALIVE) && !pass) this.completion = this.stateCompletion(time)
    else if (this.is(Text.state.FADEOUT)) this.completion = 1

    const textContent = `[${this.stringProgress(this.completion)}] ${Math.floor(this.completion * 100)}%`

    this.progress.setAttributes({ textContent })
  }

  stringProgress(completion, width = 20) {
    const progress = Math.floor(completion * width)
    return '#'.repeat(progress) + '_'.repeat(width - progress)
  }
}

export class TextTitle extends _Text {
  constructor(opts) {
    super({ ...opts, type: 'h1' })
    this.setAttributes({
      classList: 'title',
    })

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.elem.appendChild(svg)
    svg.outerHTML = `
    <svg class="svg-title">
      <text
        fill="transparent"
        x="50%" y="100%"
        text-anchor="middle"
        stroke-width="0.2"
        alignement-baseline="central"
        vector-effect="non-scaling-stroke"
        font-size="100%"
      >${opts.text}</text>
    </svg>`
  }
}

export class TextLog extends _Text {
  constructor(opts) {
    super(opts)

    this.unshift(
      new Text({ attributes: { textContent: 'Log:' } }),
      new Text({ attributes: { textContent: (new Date()).toDateString(), classList: 'log' } })
    )
  }
}

export class TextWarn extends _Text {
  constructor(opts) {
    super(opts)
    this.unshift(new TextLabel({ attributes: { textContent: 'alerte', classList: 'label--warning' } }))
  }
}

export class TextFail extends _Text {
  constructor(opts) {
    super(opts)
    this.unshift(new TextLabel({ attributes: { textContent: 'échec', classList: 'label--fail' } }))
  }
}

export class TextSuccess extends _Text {
  constructor(opts) {
    super(opts)
    this.unshift(new TextLabel({ attributes: { textContent: 'succès', classList: 'label--success' } }))
  }
}

export const Text = _Text

export class TextLabel extends _Text {

  // static WARN = { textContent: 'warning', classList: ['label', 'label--warning'] }

  constructor(opts) {
    super(opts)

    this.setAttributes({
      classList: 'label',
    })
  }
}