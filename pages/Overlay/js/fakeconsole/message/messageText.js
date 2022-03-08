import { Message, TextStyle } from './message.js'

export default class MessageText extends Message {
  constructor(options) {
    super(options)

    const params = {
      text: '',
      ...options
    }
    super.push(TextStyle.generate({ textContent: params.text, style: { color: 'white' }, className: 'text' }))
  }
}