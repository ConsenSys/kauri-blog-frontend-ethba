import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'isomorphic-fetch'

function createApolloClient({ ssrMode }) {
  return new ApolloClient({
    ssrMode,
    link: createHttpLink({
      uri: 'http://35.153.74.129:80/graphql',
      credentials: 'include',
      fetch
    }),
    cache: ssrMode ? new InMemoryCache() : new InMemoryCache().restore(window.__APOLLO_STATE__)
  })
}

export default createApolloClient
