import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { config } from './config';

// Create the Apollo client instance
const client = new ApolloClient({
  link: new HttpLink({
    uri: `${config.API_BASE_URL}/query`,  // Your GraphQL endpoint
    credentials: 'include',  // Enable cookies for authentication
  }),
  cache: new InMemoryCache(),
});

export default client;
