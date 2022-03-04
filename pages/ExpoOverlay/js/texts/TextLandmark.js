import SpriteText from 'three-spritetext';
import { toPercentString, clamp } from '../utils.js';

import Color from "colorjs.io";
window.Color = Color

const TEXT_SIZE = 0.015

const color = new Color("red");
const color2 = new Color("srgb", [0, 1, 1]);
const gradient = color.range(color2);

export default class TextLandmark {
    constructor() {
        this.sprite = new SpriteText('', TEXT_SIZE)
        this.sprite.center.x = 0
        this.sprite.fontFace = 'Courier, mono';
        this.sprite.backgroundColor = 'black'
    }

    addTo(parent) {
        parent.add(this.sprite)
    }

    update({ visibility, point }) {
        if (visibility === null) return;

        this.sprite.text = toPercentString(visibility)
        this.sprite.color = gradient(clamp(visibility, 0, 1));
        this.sprite.position.copy(point)
    }
}