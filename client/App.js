import { ApolloClient, ApolloProvider, createNetworkInterface, graphql } from 'react-apollo';
import { render } from 'react-dom';
import React from 'react';

import Main from './imports/Main';

const client = new ApolloClient({
  addTypename: false,
  dataIdFromObject: ({ id }) => id,
});

const App = () => (
  <ApolloProvider client={client}>
    <Main />
  </ApolloProvider>
);

render(
  <App />
, document.getElementById('root'));


