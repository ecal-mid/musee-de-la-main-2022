class Person {
  constructor({ pose, MATTER, width, height }) {
    this.dimensions = { width, height };
    const data = this.fitPose(pose);

    this.MATTER = MATTER;
    this.GROUP = this.MATTER.Body.nextGroup(false);
    this.boundaries = {};
    this.lerpTiming = 0.5;
    this.defaultSize = 150;
    this.HEAD_SIZE = 250;
    //
    /**
     * LA TETE EST JUSTE LA POSITION DU NEZ EN PLUS GRAND
     */
    const shouldersDist = this.dist(data[LEFT_EYE], data[RIGHT_EYE]);
    const ratio = map(shouldersDist, 0, 1280, 0, 1.5);

    Object.values(data).forEach(({ name, x, y }, index) => {
      let size = this.defaultSize * ratio;

      if (name === NOSE) {
        size = this.HEAD_SIZE * ratio;
      } else if (this.isOnFace(name)) {
        size = 1;
      }

      const boundary = new Boundary(x, y, size, this.GROUP, MATTER, ratio);

      this.boundaries[name] = boundary;
    });

    const length = 200;
    // GET BODY PARTS
    this.armRight1 = new BodyPart(0, 0, length, 40, this.GROUP, MATTER);
    this.armRight2 = new BodyPart(0, 0, length, 40, this.GROUP, MATTER);
    this.armLeft1 = new BodyPart(0, 0, length, -40, this.GROUP, MATTER);
    this.armLeft2 = new BodyPart(0, 0, length, -40, this.GROUP, MATTER);
    this.legRight1 = new BodyPart(0, 0, length, 40, this.GROUP, MATTER);
    this.legRight2 = new BodyPart(0, 0, length, 40, this.GROUP, MATTER);
    this.legLeft1 = new BodyPart(0, 0, length, -40, this.GROUP, MATTER);
    this.legLeft2 = new BodyPart(0, 0, length, -40, this.GROUP, MATTER);
    this.footLeft = new BodyPart(0, 0, length, -20, this.GROUP, MATTER);
    this.footRight = new BodyPart(0, 0, length, -20, this.GROUP, MATTER);
    
    // this.chest1 = new BodyPart(0, 0, parts, 40, this.GROUP, MATTER);

    let positionArray = createArray(4, { x: 0, y: 0 });
    this.neck = new ExtendBodyPart(positionArray, this.GROUP, MATTER);

    positionArray = createArray(4, { x: 0, y: 0 });
    this.chest = new ExtendBodyPart(positionArray, this.GROUP, MATTER);
  }

  fitPose(pose) {
    const { width, height } = this.dimensions;

    const data = {};

    Object.entries(pose).forEach(([name, landmark]) => {
      //! filter unused points from mediapipe
      if (!(name in CHOSEN_FEATURES)) return;

      const item = {
        name,
        x: landmark.x * width,
        y: landmark.y * height,
      };

      data[name] = item;
    });

    return data;
  }

  update(pose) {
    if (!pose) return;

    const data = this.fitPose(pose);
    const shouldersDist = this.dist(data[LEFT_EYE], data[RIGHT_EYE]);
    const scaleFactor = map(shouldersDist, 0, 1280, 0, 8);

    Object.entries(data).forEach(([name, { x, y }]) => {
      let size = this.defaultSize;
      let item = this.boundaries[name];

      if (!item) return;

      if (name === NOSE) {
        y -= 50 * scaleFactor;
        size = this.HEAD_SIZE;
      }

      let scale = 1;

      if (!this.isOnFace(name) || name === NOSE) {
        scale = (scaleFactor * size) / item.body.circleRadius;
      }

      this.MATTER.Body.setPosition(item.body, { x, y });
      this.MATTER.Body.scale(item.body, scale, scale);
    });

    /////////////////////
    //* RIGHT ARM
    this.positionBodyPart(
      this.armRight1,
      data[RIGHT_SHOULDER],
      data[RIGHT_ELBOW]
    );
    this.positionBodyPart(this.armRight2, data[RIGHT_ELBOW], data[RIGHT_WRIST]);

    //* LEFT ARM
    this.positionBodyPart(this.armLeft1, data[LEFT_SHOULDER], data[LEFT_ELBOW]);
    this.positionBodyPart(this.armLeft2, data[LEFT_ELBOW], data[LEFT_WRIST]);

    //* RIGHT LEG
    this.positionBodyPart(this.legRight1, data[RIGHT_HIP], data[RIGHT_KNEE]);
    this.positionBodyPart(this.legRight2, data[RIGHT_KNEE], data[RIGHT_HEEL]);

    //* LEFT LEG
    this.positionBodyPart(this.legLeft1, data[LEFT_HIP], data[LEFT_KNEE]);
    this.positionBodyPart(this.legLeft2, data[LEFT_KNEE], data[LEFT_HEEL]);

    //* LEFT Foot
    this.positionBodyPart(this.footLeft, data[LEFT_HEEL], data[LEFT_FOOT_INDEX]);
    //* RIGHT Foot
    this.positionBodyPart(this.footRight, data[RIGHT_HEEL], data[RIGHT_FOOT_INDEX]);

    this.neck.update([
      data[LEFT_EYE],
      data[RIGHT_EYE],
      data[RIGHT_SHOULDER],
      data[LEFT_SHOULDER],
    ]);

    this.chest.update([
      data[RIGHT_HIP],
      data[RIGHT_SHOULDER],
      data[LEFT_SHOULDER],
      data[LEFT_HIP],
    ]);
  }

  destroy() {
    Object.values(this.boundaries).forEach((item) => item.removeFromWorld());
    this.boundaries.length = 0;
    this.neck.removeFromWorld();
    this.chest.removeFromWorld();
    this.armRight1.removeFromWorld();
    this.armRight2.removeFromWorld();
    this.armLeft1.removeFromWorld();
    this.armLeft2.removeFromWorld();
    this.legRight1.removeFromWorld();
    this.legRight2.removeFromWorld();
    this.legLeft1.removeFromWorld();
    this.legLeft2.removeFromWorld();
    this.footLeft.removeFromWorld();
    this.footRight.removeFromWorld();
  }

  positionBodyPart(bodyPart, pos1, pos2) {
    const size = this.dist(pos1, pos2);
    const angle = this.getAngle(pos1, pos2);
    bodyPart.position(pos1.x, pos1.y);
    bodyPart.resize(size);
    bodyPart.rotate(angle);
  }

  isOnFace(name) {
    return name in FACIAL_FEATURES;
  }

  show(ctx) {
    Object.values(this.boundaries).forEach((item) => {
      item.show(ctx);
    });

    this.armRight1.show(ctx);
    this.armRight2.show(ctx);
    this.armLeft1.show(ctx);
    this.armLeft2.show(ctx);
    this.legRight1.show(ctx);
    this.legRight2.show(ctx);
    this.legLeft1.show(ctx);
    this.legLeft2.show(ctx);
    this.chest.show(ctx);
    this.neck.show(ctx);
    this.footLeft.show(ctx);
    this.footRight.show(ctx);
  }

  lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
  }
  dist(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
  getAngle(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  }
}

const NOSE = "NOSE";
const LEFT_EYE_INNER = "LEFT_EYE_INNER";
const LEFT_EYE = "LEFT_EYE";
const LEFT_EYE_OUTER = "LEFT_EYE_OUTER";
const RIGHT_EYE_INNER = "RIGHT_EYE_INNER";
const RIGHT_EYE = "RIGHT_EYE";
const RIGHT_EYE_OUTER = "RIGHT_EYE_OUTER";
const LEFT_EAR = "LEFT_EAR";
const RIGHT_EAR = "RIGHT_EAR";
const LEFT_RIGHT = "LEFT_RIGHT";
const RIGHT_LEFT = "RIGHT_LEFT";
const LEFT_SHOULDER = "LEFT_SHOULDER";
const RIGHT_SHOULDER = "RIGHT_SHOULDER";
const LEFT_ELBOW = "LEFT_ELBOW";
const RIGHT_ELBOW = "RIGHT_ELBOW";
const LEFT_WRIST = "LEFT_WRIST";
const RIGHT_WRIST = "RIGHT_WRIST";
const LEFT_PINKY = "LEFT_PINKY";
const RIGHT_PINKY = "RIGHT_PINKY";
const LEFT_INDEX = "LEFT_INDEX";
const RIGHT_INDEX = "RIGHT_INDEX";
const LEFT_THUMB = "LEFT_THUMB";
const RIGHT_THUMB = "RIGHT_THUMB";
const LEFT_HIP = "LEFT_HIP";
const RIGHT_HIP = "RIGHT_HIP";
const LEFT_KNEE = "LEFT_KNEE";
const RIGHT_KNEE = "RIGHT_KNEE";
const LEFT_ANKLE = "LEFT_ANKLE";
const RIGHT_ANKLE = "RIGHT_ANKLE";
const LEFT_HEEL = "LEFT_HEEL";
const RIGHT_HEEL = "RIGHT_HEEL";
const LEFT_FOOT_INDEX = "LEFT_FOOT_INDEX";
const RIGHT_FOOT_INDEX = "RIGHT_FOOT_INDEX";

const FACIAL_FEATURES = {
  NOSE: true,
  // LEFT_EYE_INNER: true,
  LEFT_EYE: true,
  // LEFT_EYE_OUTER: true,
  // RIGHT_EYE_INNER: true,
  RIGHT_EYE: true,
  // RIGHT_EYE_OUTER: true,
  LEFT_EAR: true,
  RIGHT_EAR: true,
  // LEFT_RIGHT: true,
  // RIGHT_LEFT: true,
};

const CHOSEN_FEATURES = {
  NOSE: true,
  // LEFT_EYE_INNER: true,
  LEFT_EYE: true,
  // LEFT_EYE_OUTER: true,
  // RIGHT_EYE_INNER: true,
  RIGHT_EYE: true,
  // RIGHT_EYE_OUTER: true,
  LEFT_EAR: true,
  RIGHT_EAR: true,
  // LEFT_RIGHT: true,
  // RIGHT_LEFT: true,
  LEFT_SHOULDER: true,
  RIGHT_SHOULDER: true,
  LEFT_ELBOW: true,
  RIGHT_ELBOW: true,
  LEFT_WRIST: true,
  RIGHT_WRIST: true,
  // LEFT_PINKY: true,
  // RIGHT_PINKY: true,
  LEFT_INDEX: true,
  RIGHT_INDEX: true,
  // LEFT_THUMB: true,
  // RIGHT_THUMB: true,
  LEFT_HIP: true,
  RIGHT_HIP: true,
  LEFT_KNEE: true,
  RIGHT_KNEE: true,
  // LEFT_ANKLE: true,
  // RIGHT_ANKLE: true,
  LEFT_HEEL: true,
  RIGHT_HEEL: true,
  LEFT_FOOT_INDEX: true,
  RIGHT_FOOT_INDEX: true,
};

function createArray(nElements, obj) {
  return Array(nElements)
    .fill()
    .map(() => weakCopy(obj));
}

function weakCopy(obj) {
  return { ...obj }; //? spread operator
}
