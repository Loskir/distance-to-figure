<template>
  <div id="app">
    <svg
      ref="svg"
      viewBox="0 0 20 20"
      @mousemove="handleSVGMousemove"
      @mouseup="cancelDrags"
      @mouseleave="cancelDrags"
      :class="{'cursor-all-scroll': anyDragging}"
    >
      <g>
        <template v-for="i in SIZE-1">
          <line :key="`x${i}`" class="grid" :x1="i" :x2="i" y1="0" :y2="SIZE"/>
          <line :key="`y${i}`" class="grid" :y1="i" :y2="i" x1="0" :x2="SIZE"/>
        </template>
      </g>

      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">{{distanceRounded}}</text>

      <line class="axis" :x1="SIZE/2" :x2="SIZE/2" y1="0" :y2="SIZE"/>
      <line class="axis" :y1="SIZE/2" :y2="SIZE/2" x1="0" :x2="SIZE"/>

      <path class="square" :d="squarePath"/>
      <circle
        class="point"
        :cx="formatX(pointX)"
        :cy="formatY(pointY)"
        r=".25"
        @mousedown="pointDragging = true"
      />
      <circle
        class="point"
        :cx="formatX(squareCenterX)"
        :cy="formatY(squareCenterY)"
        r=".25"
        @mousedown="squareCenterDragging = true"
      />
      <circle
        class="point"
        :cx="formatX(squarePointX)"
        :cy="formatY(squarePointY)"
        r=".15"
        @mousedown="squarePointDragging = true"
      />
    </svg>
    <input type="number" v-model="sides" min="3"/>
  </div>
</template>

<script>
import {
  roundWithPrecision,
  getDistanceBetweenPoints,
  getVectorsCosine
} from "@/utils";

const SIZE = 20;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Vector {
  constructor(begin, end) {
    this.begin = begin;
    this.end = end;
  }

  get x() {
    return this.end.x - this.begin.x;
  }
  get y() {
    return this.end.y - this.begin.y;
  }
}

export default {
  name: "App",
  data: () => ({
    SIZE,
    pointX: -5,
    pointY: 5,
    pointDragging: false,

    squareCenterX: 0,
    squareCenterY: 0,
    squareCenterDragging: false,

    squarePointRelativeX: 0,
    squarePointRelativeY: 3,
    squarePointDragging: false,

    sides: 5,
  }),
  methods: {
    formatX(x) {
      return x + SIZE / 2;
    },
    formatY(y) {
      return SIZE / 2 - y;
    },
    getCoords(e) {
      const { clientWidth, clientHeight } = this.$refs.svg;
      const { offsetX, offsetY } = e;
      const x = (offsetX / clientWidth - 0.5) * SIZE;
      const y = (0.5 - offsetY / clientHeight) * SIZE;
      return { x, y };
    },
    handleSVGMousemove(e) {
      let { x, y } = this.getCoords(e);
      const threshold = 0.15;
      if (Math.abs(x - Math.round(x)) < threshold) {
        x = Math.round(x);
      }
      if (Math.abs(y - Math.round(y)) < threshold) {
        y = Math.round(y);
      }
      if (this.pointDragging) {
        this.pointX = x;
        this.pointY = y;
      } else if (this.squareCenterDragging) {
        this.squareCenterX = x;
        this.squareCenterY = y;
      } else if (this.squarePointDragging) {
        this.squarePointX = x;
        this.squarePointY = y;
      }
    },
    cancelDrags() {
      this.pointDragging = false;
      this.squareCenterDragging = false;
      this.squarePointDragging = false;
    }
  },
  computed: {
    anyDragging() {
      return (
        this.pointDragging ||
        this.squareCenterDragging ||
        this.squarePointDragging
      );
    },

    point() {
      return {
        x: this.pointX,
        y: this.pointY
      };
    },
    squareCenter() {
      return {
        x: this.squareCenterX,
        y: this.squareCenterY
      };
    },
    squarePoint() {
      return {
        x: this.squarePointX,
        y: this.squarePointY
      };
    },

    vertexAngle() {
      return Math.PI * (this.sides - 2) / this.sides
    },

    squareAngle() {
      return -Math.atan2(this.squarePointRelativeX, this.squarePointRelativeY);
    },
    distanceToSide() {
      return getDistanceBetweenPoints(this.squareCenter, this.squarePoint)
    },
    distanceToVertex() {
      return this.distanceToSide / Math.sin(this.vertexAngle/2)
    },
    squareSize() {
      return 2* this.distanceToSide / Math.cos(this.vertexAngle/2);
    },

    squarePointX: {
      get() {
        return this.squareCenterX + this.squarePointRelativeX;
      },
      set(v) {
        this.squarePointRelativeX = v - this.squareCenterX;
      }
    },
    squarePointY: {
      get() {
        return this.squareCenterY + this.squarePointRelativeY;
      },
      set(v) {
        this.squarePointRelativeY = v - this.squareCenterY;
      }
    },

    squareCorners() {
      const c = this.squareCenter;
      const a = this.distanceToVertex;
      // const al = -this.squareAngle + Math.PI/2 - Math.PI/(this.sides/2);
      const al = this.squareAngle + Math.PI/2 - Math.PI/this.sides;

      const pify = f => Math.PI * f;

      let points = []

      const n = this.sides

      for (let i = 0; i < n; i++) {
        points.push({
          x: c.x + a * Math.cos(al + pify(i*2 / n)),
          y: c.y + a * Math.sin(al + pify(i*2 / n))
        })
      }

      return points
    },

    squarePath() {
      const formatPoint = point => ({
        x: this.formatX(point.x),
        y: this.formatY(point.y)
      });

      const points = this.squareCorners.map(formatPoint);

      points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}, ${p.y}`)

      return [
        ...points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}, ${p.y}`),
        "Z"
      ].join(" ");
    },

    distancesToCorners() {
      return this.squareCorners.map((point, i) => ({
        distance: getDistanceBetweenPoints(point, this.point),
        point: i
      }));
    },
    twoNearestCorners() {
      return this.distancesToCorners
        .slice()
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2);
    },
    distance() {
      const tnc = this.twoNearestCorners;
      const a = this.squareCorners[tnc[0].point];
      const b = this.squareCorners[tnc[1].point];

      const cosAlpha = getVectorsCosine(
        new Vector(a, this.point),
        new Vector(a, b)
      );
      const cosBeta = getVectorsCosine(
        new Vector(b, this.point),
        new Vector(b, a)
      );

      if (cosAlpha <= 0 || cosBeta <= 0) {
        return tnc[0].distance;
      }

      const sinAlpha = Math.sqrt(1 - Math.pow(cosAlpha, 2));

      return tnc[0].distance * sinAlpha;
    },
    distanceRounded() {
      return roundWithPrecision(this.distance);
    }
  }
};
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

svg {
  width: 800px;
}

line.grid {
  stroke: #cbd5e0;
  stroke-width: 0.05;
}
line.axis {
  stroke: black;
  stroke-width: 0.05;
}
.point {
  fill: #d53f8c;
  cursor: all-scroll;
}
.square {
  fill: none;
  stroke: #ed64a6;
  stroke-width: 0.1;
  stroke-linejoin: round;
}
.cursor-all-scroll {
  cursor: all-scroll;
}

.distance-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

text {
  font: bold 8px monospace;
  fill: #fed7e2;
  user-select: none;
}
</style>
