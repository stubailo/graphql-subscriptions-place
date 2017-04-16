import { property } from 'lodash';

import { colorUpdateTopic } from './topics';

const DEFAULT_COLOR = { r: 255, g: 255, b: 255 };

const resolvers = {
  Query: {
    canvas(root, { id }, { Canvases }) {
      return Canvases.findOne(id);
    }
  },
  Mutation: {
    createCanvas(root, { size }, { Canvases }) {
      const canvasId = Canvases.insert({
        size: {
          x: size,
          y: size,
        }
      });

      for (let x=0; x<size; x++) {
        for (let y=0; y<size; y++) {
          Cells.insert({
            canvasId,
            color: DEFAULT_COLOR,
            location: { x, y },
          });
        }
      }

      return {
        canvas: Canvases.findOne(canvasId),
      };
    },
    updateCellColor(root, { input: { id, newColor }}, { Cells, pubsub }) {
      Cells.update(id, { $set: { color: newColor }});

      const cell = Cells.findOne(id);

      pubsub.publish(colorUpdateTopic(cell.canvasId), cell);

      return {
        cell,
      };
    }
  },
  Subscription: {
    cellColorChange(cell) {
      return {
        cell,
      };
    }
  },
  Canvas: {
    id: property('_id'),
    cells(canvas, {}, { Cells }) {
      return Cells.find({ canvasId: canvas._id }).fetch();
    }
  },
  Cell: {
    id: property('_id'),
  }
};

export default resolvers;
