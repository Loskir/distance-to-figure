(function(t){function e(e){for(var n,a,o=e[0],u=e[1],c=e[2],l=0,g=[];l<o.length;l++)a=o[l],s[a]&&g.push(s[a][0]),s[a]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(t[n]=u[n]);h&&h(e);while(g.length)g.shift()();return i.push.apply(i,c||[]),r()}function r(){for(var t,e=0;e<i.length;e++){for(var r=i[e],n=!0,o=1;o<r.length;o++){var u=r[o];0!==s[u]&&(n=!1)}n&&(i.splice(e--,1),t=a(a.s=r[0]))}return t}var n={},s={app:0},i=[];function a(e){if(n[e])return n[e].exports;var r=n[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=t,a.c=n,a.d=function(t,e,r){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)a.d(r,n,function(e){return t[e]}.bind(null,n));return r},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/distance-to-square/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],u=o.push.bind(o);o.push=e,o=o.slice();for(var c=0;c<o.length;c++)e(o[c]);var h=u;i.push([0,"chunk-vendors"]),r()})({0:function(t,e,r){t.exports=r("56d7")},"034f":function(t,e,r){"use strict";var n=r("64a9"),s=r.n(n);s.a},"56d7":function(t,e,r){"use strict";r.r(e);var n=r("2b0e"),s=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"app"}},[r("svg",{ref:"svg",class:{"cursor-all-scroll":t.anyDragging},attrs:{viewBox:"0 0 20 20"},on:{mousemove:t.handleSVGMousemove,mouseup:t.cancelDrags,mouseleave:t.cancelDrags}},[r("g",[t._l(t.SIZE-1,(function(e){return[r("line",{key:"x"+e,staticClass:"grid",attrs:{x1:e,x2:e,y1:"0",y2:t.SIZE}}),r("line",{key:"y"+e,staticClass:"grid",attrs:{y1:e,y2:e,x1:"0",x2:t.SIZE}})]}))],2),r("text",{attrs:{x:"50%",y:"50%","dominant-baseline":"middle","text-anchor":"middle"}},[t._v(t._s(t.distanceRounded))]),r("line",{staticClass:"axis",attrs:{x1:t.SIZE/2,x2:t.SIZE/2,y1:"0",y2:t.SIZE}}),r("line",{staticClass:"axis",attrs:{y1:t.SIZE/2,y2:t.SIZE/2,x1:"0",x2:t.SIZE}}),r("path",{staticClass:"square",attrs:{d:t.squarePath}}),r("circle",{staticClass:"point",attrs:{cx:t.formatX(t.pointX),cy:t.formatY(t.pointY),r:".25"},on:{mousedown:function(e){t.pointDragging=!0}}}),r("circle",{staticClass:"point",attrs:{cx:t.formatX(t.squareCenterX),cy:t.formatY(t.squareCenterY),r:".25"},on:{mousedown:function(e){t.squareCenterDragging=!0}}}),r("circle",{staticClass:"point",attrs:{cx:t.formatX(t.squarePointX),cy:t.formatY(t.squarePointY),r:".15"},on:{mousedown:function(e){t.squarePointDragging=!0}}})])])},i=[];function a(t){return t?t.toFixed&&t.toFixed(2):"0.00"}function o(t,e){return Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2))}function u(t,e){return t.x*e.x+t.y*e.y}function c(t){return o(t.begin,t.end)}function h(t,e){return u(t,e)/(c(t)*c(e))}const l=20;class g{constructor(t,e){this.begin=t,this.end=e}get x(){return this.end.x-this.begin.x}get y(){return this.end.y-this.begin.y}}var p={name:"App",data:()=>({SIZE:l,pointX:-5,pointY:5,pointDragging:!1,squareCenterX:0,squareCenterY:0,squareCenterDragging:!1,squarePointRelativeX:0,squarePointRelativeY:3,squarePointDragging:!1}),methods:{formatX(t){return t+l/2},formatY(t){return l/2-t},getCoords(t){const{clientWidth:e,clientHeight:r}=this.$refs.svg,{offsetX:n,offsetY:s}=t,i=(n/e-.5)*l,a=(.5-s/r)*l;return{x:i,y:a}},handleSVGMousemove(t){let{x:e,y:r}=this.getCoords(t);const n=.15;Math.abs(e-Math.round(e))<n&&(e=Math.round(e)),Math.abs(r-Math.round(r))<n&&(r=Math.round(r)),this.pointDragging?(this.pointX=e,this.pointY=r):this.squareCenterDragging?(this.squareCenterX=e,this.squareCenterY=r):this.squarePointDragging&&(this.squarePointX=e,this.squarePointY=r)},cancelDrags(){this.pointDragging=!1,this.squareCenterDragging=!1,this.squarePointDragging=!1}},computed:{anyDragging(){return this.pointDragging||this.squareCenterDragging||this.squarePointDragging},point(){return{x:this.pointX,y:this.pointY}},squareCenter(){return{x:this.squareCenterX,y:this.squareCenterY}},squarePoint(){return{x:this.squarePointX,y:this.squarePointY}},squareAngle(){return Math.atan2(this.squarePointRelativeX,this.squarePointRelativeY)},squareSize(){return 2*o(this.squareCenter,this.squarePoint)},squarePointX:{get(){return this.squareCenterX+this.squarePointRelativeX},set(t){this.squarePointRelativeX=t-this.squareCenterX}},squarePointY:{get(){return this.squareCenterY+this.squarePointRelativeY},set(t){this.squarePointRelativeY=t-this.squareCenterY}},squareCorners(){const t=this.squareCenter,e=this.squareSize,r=-this.squareAngle,n=t=>Math.PI*t;return[{x:t.x+e/Math.sqrt(2)*Math.cos(r+n(.25)),y:t.y+e/Math.sqrt(2)*Math.sin(r+n(.25))},{x:t.x+e/Math.sqrt(2)*Math.cos(r+n(.75)),y:t.y+e/Math.sqrt(2)*Math.sin(r+n(.75))},{x:t.x+e/Math.sqrt(2)*Math.cos(r+n(5/4)),y:t.y+e/Math.sqrt(2)*Math.sin(r+n(5/4))},{x:t.x+e/Math.sqrt(2)*Math.cos(r+n(7/4)),y:t.y+e/Math.sqrt(2)*Math.sin(r+n(7/4))}]},squarePath(){const t=t=>({x:this.formatX(t.x),y:this.formatY(t.y)}),e=this.squareCorners.map(t);return[`M ${e[0].x}, ${e[0].y}`,`L ${e[1].x}, ${e[1].y}`,`L ${e[2].x}, ${e[2].y}`,`L ${e[3].x}, ${e[3].y}`,"Z"].join(" ")},distancesToCorners(){return this.squareCorners.map((t,e)=>({distance:o(t,this.point),point:e}))},twoNearestCorners(){return this.distancesToCorners.slice().sort((t,e)=>t.distance-e.distance).slice(0,2)},distance(){const t=this.twoNearestCorners,e=this.squareCorners[t[0].point],r=this.squareCorners[t[1].point],n=h(new g(e,this.point),new g(e,r)),s=h(new g(r,this.point),new g(r,e));if(n<=0||s<=0)return t[0].distance;const i=Math.sqrt(1-Math.pow(n,2));return t[0].distance*i},distanceRounded(){return a(this.distance)}}},d=p,f=(r("034f"),r("2877")),q=Object(f["a"])(d,s,i,!1,null,null,null),y=q.exports;n["a"].config.productionTip=!1,new n["a"]({render:t=>t(y)}).$mount("#app")},"64a9":function(t,e,r){}});
//# sourceMappingURL=app.f8a24b19.js.map