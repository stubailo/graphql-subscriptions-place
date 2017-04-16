import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphqlConnect, graphiqlConnect } from 'graphql-server-express';
import { json } from 'body-parser';
import { integer } from 'casual';
import { Mongo } from 'meteor/mongo';

import { Canvases, Cells } from './collections';
import typeDefs from './schema.graphql';
import resolvers from './resolvers';

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
