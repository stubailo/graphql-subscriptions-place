import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphqlConnect, graphiqlConnect } from 'graphql-server-express';
import { json } from 'body-parser';
import { integer } from 'casual';
import { Mongo } from 'meteor/mongo';
import { property } from 'lodash';

import { Canvases, Cells } from './collections';
import typeDefs from './schema.graphql';

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
    colorCell(root, { input: { id, newColor }}, { Cells }) {
      Cells.update(id, { $set: { color: newColor }});

      return {
        cell: Cells.findOne(id),
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

const schema = makeExecutableSchema({ typeDefs, resolvers });

WebApp.connectHandlers.use(json());

WebApp.connectHandlers.use('/graphql', graphqlConnect({
  schema,
  context: {
    Canvases,
    Cells,
  }
}));

WebApp.connectHandlers.use('/graphiql', graphiqlConnect({
  endpointURL: Meteor.absoluteUrl('/graphql'),
}));
