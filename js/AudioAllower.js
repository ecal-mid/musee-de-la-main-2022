export default class AudioAllower {
  constructor() {}

  static async getP5Microphone() {
    return new Promise((resolve) => {
      const myp5 = new window.p5((p) => {
        p.setup = function () {
          const p5Microphone = new p5.AudioIn();
          p.getAudioContext().resume().then(() => {
              p5Microphone.start();
              resolve(p5Microphone)
          });
          p.noLoop()        
        };
      });

    });
  }

  static async allow({
    parent = document.body,
    audioCtx = new AudioContext(),
  } = {}) {
    if (audioCtx.state === "running") return;

    const button = document.createElement("button");
    button.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: block;
            z-index: 1000;
        `;

    button.classList.add("button__allowAudio");
    button.textContent = "Enabling audio (click if this message persist)";
    parent.appendChild(button);

    await new Promise((resolve) => (button.onclick = resolve));

    parent.removeChild(button);
    await audioCtx.resume();

    await this.allow({ parent, audioCtx });
  }
}
