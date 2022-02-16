class Sparkle{
  
  constructor(_x,_y,_d,_vx,_vy) {
    this.x = _x;
    this.y = _y;
    this.d = _d;
    this.vx = _vx;
    this.vy = _vy;
    
  }
  
  display () {
    ellipse(this.x, this.y, this.d);
    fill(255,204,0);
    stroke(255,150,0);
  }
  
  move () {
    this.x = this.x + this.vx;
    this.y = this.y + this.vy;
  
    
    if (this.x > width || this.x < 0) { // || is an or statement
      this.vx = this.vx * -1; //trick to flip directions
    }

    if (this.y > height || this.y < 0) {
      this.vy = this.vy * -1;
  }
  }
}
  