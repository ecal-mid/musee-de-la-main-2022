class ExtendBodyPart {
    constructor(positionArray,group, MATTER) {
      this.MATTER = MATTER;
      const options = {
        friction: 0,
        restitution: 0.5,
        isStatic: true,
      };
      this.positions = positionArray;
      let centerMass = this.centerMass(positionArray);
  
      if (group) options.collisionFilter = { group };
      this.body = this.MATTER.Bodies.fromVertices(centerMass.x, centerMass.y, positionArray, options);
      //   Matter.Body.setCentre(this.body, { x: -0 / 2, y: -0 / 2 }, true);
      this.MATTER.World.add(this.MATTER.engine.world, this.body);
    }

    update(vertices) {
        this.positions = vertices;
        this.MATTER.Body.setVertices(this.body, vertices);
        this.MATTER.Body.setPosition(this.body, this.centerMass(vertices));
    }

    show(ctx) {
      ctx.save();
      ctx.lineWidth = 5;
      ctx.strokeStyle = `rgb(255,204,0)`;
      ctx.beginPath();
      for(var vertex of this.positions) {
          ctx.lineTo(vertex.x, vertex.y);
      }
      
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    centerMass(vertices) {
        let x = 0;
        let y = 0;
        let count = 0;
        for(let position of vertices) {
            x += position.x;
            y += position.y;
            count++;
        }
        x /= count;
        y /= count;
        return {x: x, y: y};
    }
    removeFromWorld() {
      this.MATTER.World.remove(this.MATTER.engine.world, this.body);
      // MATTER.World.remove(MATTER.engine.world, this.body);
    }
  }
  