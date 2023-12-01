import { storeToRefs } from 'pinia';
import { useCanvasStateStore } from '@/store';
import { Shapes } from '@/shared/interfaces';
const canvasStateStore = useCanvasStateStore();
const { selectedShape } = storeToRefs(canvasStateStore);
import { fabric } from 'fabric';

import { startRectangle, rectangle, endRectangle } from './shapes/rectangle';
import { startEllipse, ellipse, endEllipse } from './shapes/ellipse';
import { startLine, line, endLine } from './shapes/line';
import { startArrow, arrow, endArrow } from './shapes/arrow';

export function startShape(evt: fabric.IEvent): void {
  switch (selectedShape.value) {
    case Shapes.Rectangle:
      startRectangle(evt);
      break;
    case Shapes.Ellipse:
      startEllipse(evt);
      break;
    case Shapes.Line:
      startLine(evt);
      break;
    case Shapes.Arrow:
      startArrow(evt);
      break;
  }
}

export function shape(evt: fabric.IEvent): void {
  switch (selectedShape.value) {
    case Shapes.Rectangle:
      rectangle(evt);
      break;
    case Shapes.Ellipse:
      ellipse(evt);
      break;
    case Shapes.Line:
      line(evt);
      break;
    case Shapes.Arrow:
      arrow(evt);
      break;
  }
}

export function endShape(evt: fabric.IEvent): void {
  switch (selectedShape.value) {
    case Shapes.Rectangle:
      endRectangle(evt);
      break;
    case Shapes.Ellipse:
      endEllipse(evt);
      break;
    case Shapes.Line:
      endLine(evt);
      break;
    case Shapes.Arrow:
      endArrow(evt);
      break;
  }
}
