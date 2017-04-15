import { ApolloClient, ApolloProvider, createNetworkInterface, graphql } from 'react-apollo';
import { render } from 'react-dom';
import React from 'react';

import Canvas from './imports/Canvas';

const client = new ApolloClient({
  addTypename: false,
  dataIdFromObject: ({ id }) => id,
});

const App = () => (
  <ApolloProvider client={client}>
    <Canvas />
  </ApolloProvider>
);

render(
  <App />
, document.getElementById('root'));


