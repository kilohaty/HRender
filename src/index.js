// stage
import Stage from './stage/stage';
// shapes
import Element from './shapes/element';
import Polygon from './shapes/polygon';
import RegularPolygon from './shapes/regular-polygon';
import Text from './shapes/text';
import Img from './shapes/img';
import Sprite from './shapes/sprite';
// utils
import Animator from './utils/animator';
import Easing from './utils/easing';
import EventTypes from './utils/event-types';

window.requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame;

const H = {
  Stage,
  Shapes: {
    Element,
    Polygon,
    RegularPolygon,
    Text,
    Img,
    Sprite,
  },
  Utils: {
    Animator,
    Easing,
    EventTypes,
  },
};

module.exports = H;
