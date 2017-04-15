import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphqlConnect, graphiqlConnect } from 'graphql-server-express';
import { json } from 'body-parser';
import { integer } from 'casual';

const typeDefs = `
type Query {
  canvas(id: ID!): Canvas!
}

type Canvas {
  id: ID!
  size: XYPair!
  cells: [Cell!]!
}

type XYPair {
  x: Int!
  y: Int!
}

type Cell {
  id: ID!
  color: Color!
  location: XYPair!
}

# Color value in RGB, values from 0-255
type Color {
  r: Int!
  g: Int!
  b: Int!
}
`;

// const resolvers = {
//   Query: {
//     hello: () => 'world'
//   }
// }

const schema = makeExecutableSchema({ typeDefs });

const mocks = {
  Int: () => integer(0, 255)
};

addMockFunctionsToSchema({ schema, mocks });

WebApp.connectHandlers.use(json());

WebApp.connectHandlers.use('/graphql', graphqlConnect({
  schema
}));

WebApp.connectHandlers.use('/graphiql', graphiqlConnect({
  endpointURL: Meteor.absoluteUrl('/graphql'),
}));
