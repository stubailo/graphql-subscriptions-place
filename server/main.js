import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { makeExecutableSchema } from 'graphql-tools';
import { graphqlConnect, graphiqlConnect } from 'graphql-server-express';
import { json } from 'body-parser';

const typeDefs = `
type Query {
  hello: String
}
`;

const resolvers = {
  Query: {
    hello: () => 'world'
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers });

WebApp.connectHandlers.use(json());

WebApp.connectHandlers.use('/graphql', graphqlConnect({
  schema
}));

WebApp.connectHandlers.use('/graphiql', graphiqlConnect({
  endpointURL: Meteor.absoluteUrl('/graphql'),
}));
