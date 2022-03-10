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

      if (this.is(Text.state.FADEOUT)) this.label.setAttributes({ textContent: 'success', classList: 'label--success' })
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
    super(opts)
    this.setAttributes({
      classList: 'title',
    })
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
    this.unshift(new TextLabel({ attributes: { textContent: 'warning', classList: 'label--warning' } }))
  }
}

export class TextFail extends _Text {
  constructor(opts) {
    super(opts)
    this.unshift(new TextLabel({ attributes: { textContent: 'fail', classList: 'label--fail' } }))
  }
}

export class TextSuccess extends _Text {
  constructor(opts) {
    super(opts)
    this.unshift(new TextLabel({ attributes: { textContent: 'success', classList: 'label--success' } }))
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