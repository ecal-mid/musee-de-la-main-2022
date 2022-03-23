//! Requires global Tone.js
/*
<script src="/scripts/tone.js"></script>
<script src="/scripts/Audio.js"></script>
*/

const REQUIRED = null
const OPTIONAL = undefined

Tone.context.resume()

function lerpInv(start, stop, amount) {
    return (amount - start) / (stop - start)
}

function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value))
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

class AudioGain {
    constructor(options) {
        this.params = {
            gain: 1,
            pitch: 0,
            decay: 1,
            preDelay: 0.1,
            reverb: 0,
            cooldown: OPTIONAL,
            ...options
        }

        const { gain, pitch, decay, preDelay, reverb } = this.params

        this.nodes = []

        this.reverbNode = new Tone.Reverb(decay)

        this.setReverb(reverb)
        this.reverbNode.preDelay = preDelay

        this.gainNode = new Tone.Gain(gain).connect(this.reverbNode);
        this.pitchNode = new Tone.PitchShift().connect(this.gainNode);
        this.pitchNode.pitch = pitch

        this.connect([this.reverbNode, this.gainNode, this.pitchNode])
    }

    connect(newNodes, toArray = true) {
        while (newNodes.length > 0) {
            const node = newNodes.shift()
            const last = this.nodes[this.nodes.length - 1]
            if (last) node.connect(last)
            else node.toDestination()
            if (toArray) this.nodes.push(node)
        }
    }

    dispose() {
        const [firstNode] = this.nodes
        if (firstNode) firstNode.dispose()
    }

    setGain(amount, duration = 1 / 60) {
        this.gainNode.gain.rampTo(clamp(amount, 0, 1), duration)
    }

    setReverb(amount, duration = 1 / 60) {
        this.reverbNode.wet.rampTo(amount, duration)
    }

    setRate(amount) {
        this.player.playbackRate = clamp(amount, 0.5, 2)
        // // if (Math.sign(oldPitch) !== Math.sign(newPitch) && oldPitch !== 0) amount = 0
        // // console.log(this.pitchNode)
        // this.pitchNode.pitch = clamp(amount, -7, 7);
    }
    setPitch(amount) {
        this.pitchNode.pitch = amount;
    }
}

class AudioPlayer extends AudioGain {
    constructor(options) {
        super({
            file: REQUIRED,
            loop: false,
            volume: 0, //DB
            autostart: false,
            onload: OPTIONAL,
            cooldown: OPTIONAL,
            ...options
        })

        const { autostart, volume, loop, onload, cooldown } = this.params
        let { file } = this.params

        if (typeof file === 'string') file = this.constructor.baseUrl + file

        this.player = new Tone.Player(file, onload)
        this.player.autostart = autostart;
        this.player.loop = loop;


        if (cooldown !== OPTIONAL) {
            this.setVolume(-50)
            this.setVolume(volume, 1, Tone.now() + cooldown)
        } else {
            this.setVolume(volume);
        }

        this.connect([this.player], false)
    }

    enable(boolean) {
        this.player.mute = boolean
    }

    setVolume() {
        this.player.volume.rampTo(...arguments)
    }

    static setBaseURL(url) {
        AudioPlayer.baseUrl = url
    }

    clone(options) {
        return new this.constructor({ ...this.params, ...options, file: this.player.buffer })
    }

    getDuration() {
        return this.player.buffer.duration
    }
}
//! static
AudioPlayer.baseUrl = ''

class AudioLoop extends AudioPlayer {
    constructor(options) {
        super({
            gain: 1,
            loop: true,
            autostart: true,
            loopEnd: OPTIONAL,
            loopStart: OPTIONAL,
            ...options
        })

        const { loopEnd, loopStart } = this.params
        if (loopEnd !== OPTIONAL) this.player.loopEnd = loopEnd
        if (loopStart !== OPTIONAL) this.player.loopStart = loopStart

        this.oldValue = 0
    }

    wooshRange(value, { min = 0, max = 1, amplitude = 100 } = {}) {
        value = lerpInv(min, max, value)
        const velocity = value - this.oldValue
        this.oldValue = value
        this.woosh(velocity * amplitude)
    }

    woosh(velocity) {
        velocity = Math.abs(velocity)
        this.setRate((velocity - 0) * 0.5)
        this.setGain(velocity)
    }
}

class AudioTrigger extends AudioPlayer {
    constructor(options) {
        super({
            ...options
        })
    }

    play({ volume = 1, speed = 1 } = {}, ...args) {
        const { player } = this
        const source = new Tone.ToneBufferSource(player.buffer)
        const vol = new Tone.Volume(player.volume.value + volume)
        source.playbackRate.value = player.playbackRate * speed
        source.connect(vol)
        this.connect([vol], false)
        source.onended = () => {
            source.dispose()
            vol.dispose()
        }
        source.start(...args)
    }
    playVariation(...args) {
        this.play({
            volume: randomRange(-2, 2),
            speed: randomRange(0.8, 1.2),
        }, ...args)
    }
    // playVariant(, startOptions) {
    //     this.player.start(startOptions)
    // }

}

class Microphone {
    constructor() {
        this.meter = new Tone.Meter();
        this.mic = new Tone.UserMedia().connect(this.meter);
        this.start()
    }
    isOpened() {
        return this.mic.state === "started"
    }
    start() {
        if (this.isOpened()) return

        return this.mic.open().then(() => {
            console.log('mic open')
        }).catch(e => {
            // promise is rejected when the user doesn't have or allow mic access
            console.log("mic not open");
        });
    }
    getLevel() {
        //! can be above 1
        return Tone.dbToGain(this.meter.getValue())
    }
}