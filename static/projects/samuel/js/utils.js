let fitImage = function (
  p5Image,
  x,
  y,
  w,
  h,
  fit = "cover" /* "contain" | "fill" */,
  ay = "center" /* "left" | "right" | 0-1 */,
  ax = "center" /* "top" | "bottom" | 0-1 */
) {
  const alignments = {
    ["center"]: 0.5,
    ["top"]: 0,
    ["bottom"]: 1,
    ["left"]: 0,
    ["right"]: 1,
  };

  let dx = x,
    dy = y,
    dw = w,
    dh = h;
  const iw = p5Image.width,
    ih = p5Image.height;
  let sx = 0,
    sy = 0,
    sw = iw,
    sh = ih;
  let ir = ih / iw,
    dr = dh / dw;

  ax = ax in alignments ? alignments[ax] : ax;
  ay = ay in alignments ? alignments[ay] : ay;

  switch (fit) {
    case "contain":
      let b = 0;

      if (_curElement._imageMode === CORNERS) {
        w = abs(w - x);
        h = abs(h - y);
        dr = h / w;
        b = 1;
      }

      if (dr > ir) {
        let p = w * ir;
        let o = (h - p) * ay;
        dy = y + o;
        dh = p + dy * b;
      } else {
        let p = h / ir;
        let o = (w - p) * ax;
        dx = x + o;
        dw = p + dx * b;
      }

      break;
    case "cover":
      if (dr > ir) {
        sw = ih / dr;
        sx = (iw - sw) * ax;
      } else {
        sh = iw * dr;
        sy = (ih - sh) * ay;
      }
      break;
    case "fill":
    default:
  }

  return [p5Image, dx, dy, dw, dh, sx, sy, sw, sh];
};
