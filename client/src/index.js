import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

// Set up redux
import { Provider } from 'react-redux'
import store from './redux/store'

// Setup Apollo-Client
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import 'bootstrap/dist/css/bootstrap.min.css'

const apolloLink = createHttpLink({ uri: 'http://localhost:4444/graphql' })

const client = new ApolloClient({
	link: apolloLink,
	cache: new InMemoryCache(),
})

ReactDOM.render(
	<ApolloProvider client={client}>
		<Provider store={store}>
			<App />
		</Provider>
	</ApolloProvider>,
	document.getElementById('root')
)
