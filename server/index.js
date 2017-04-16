import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphqlConnect, graphiqlConnect } from 'graphql-server-express';
import { json } from 'body-parser';
import { integer } from 'casual';
import { Mongo } from 'meteor/mongo';
import { PubSub, SubscriptionManager } from 'graphql-subscriptions';

import { Canvases, Cells } from './collections';
import typeDefs from './schema.graphql';
import resolvers from './resolvers';
import { colorUpdateTopic } from './topics';

const schema = makeExecutableSchema({ typeDefs, resolvers });

const pubsub = new PubSub();

WebApp.connectHandlers.use(json());

WebApp.connectHandlers.use('/graphql', graphqlConnect({
  schema,
  context: {
    Canvases,
    Cells,
    pubsub,
  }
}));

WebApp.connectHandlers.use('/graphiql', graphiqlConnect({
  endpointURL: Meteor.absoluteUrl('/graphql'),
}));

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    updateCellColor(options, { canvasId }) {
      // We use the canvasId to calculate the topic name
      const topicName = colorUpdateTopic(canvasId);

      return {
        [topicName]: {},
      };
    }
  }
});
