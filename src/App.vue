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
          <line :key="`x${i}`" class="grid" :x1="i" :x2="i" y1="0" :y2="SIZE"></line>
          <line :key="`y${i}`" class="grid" :y1="i" :y2="i" x1="0" :x2="SIZE"></line>
        </template>
      </g>

      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">{{distanceRounded}}</text>

      <line class="axis" :x1="SIZE/2" :x2="SIZE/2" y1="0" :y2="SIZE"></line>
      <line class="axis" :y1="SIZE/2" :y2="SIZE/2" x1="0" :x2="SIZE"></line>

      <path class="square" :d="squarePath"></path>
      <circle
        class="point"
        :cx="formatX(pointX)"
        :cy="formatY(pointY)"
        r=".25"
        @mousedown="pointDragging = true"
      ></circle>
      <circle
        class="point"
        :cx="formatX(squareCenterX)"
        :cy="formatY(squareCenterY)"
        r=".25"
        @mousedown="squareCenterDragging = true"
      ></circle>
      <circle
        class="point"
        :cx="formatX(squarePointX)"
        :cy="formatY(squarePointY)"
        r=".15"
        @mousedown="squarePointDragging = true"
      ></circle>
    </svg>
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
    squarePointDragging: false
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

    squareAngle() {
      return Math.atan2(this.squarePointRelativeX, this.squarePointRelativeY);
    },
    squareSize() {
      return 2 * getDistanceBetweenPoints(this.squareCenter, this.squarePoint);
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
      const a = this.squareSize;
      const al = -this.squareAngle;

      const pify = f => Math.PI * f;
      return [
        {
          x: c.x + (a / Math.sqrt(2)) * Math.cos(al + pify(1 / 4)),
          y: c.y + (a / Math.sqrt(2)) * Math.sin(al + pify(1 / 4))
        },
        {
          x: c.x + (a / Math.sqrt(2)) * Math.cos(al + pify(3 / 4)),
          y: c.y + (a / Math.sqrt(2)) * Math.sin(al + pify(3 / 4))
        },
        {
          x: c.x + (a / Math.sqrt(2)) * Math.cos(al + pify(5 / 4)),
          y: c.y + (a / Math.sqrt(2)) * Math.sin(al + pify(5 / 4))
        },
        {
          x: c.x + (a / Math.sqrt(2)) * Math.cos(al + pify(7 / 4)),
          y: c.y + (a / Math.sqrt(2)) * Math.sin(al + pify(7 / 4))
        }
      ];
    },

    squarePath() {
      const formatPoint = point => ({
        x: this.formatX(point.x),
        y: this.formatY(point.y)
      });

      const points = this.squareCorners.map(formatPoint);

      return [
        `M ${points[0].x}, ${points[0].y}`,
        `L ${points[1].x}, ${points[1].y}`,
        `L ${points[2].x}, ${points[2].y}`,
        `L ${points[3].x}, ${points[3].y}`,
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
