import React from 'react'
import {
	Switch,
	BrowserRouter as Router,
	Route,
	Redirect,
} from 'react-router-dom'

import NavBar from './shared/NavBar'
import Signup from './user/signup'
import Signin from './user/signin'
import MainPage from './mainPage'

function App() {
	return (
		<div>
			<Router>
        <NavBar />
				<Switch>
					<Route exact path='/' component={MainPage} />
					<Route exact path='/signup' component={Signup} />
					<Route exact path='/signin' component={Signin} />
					<Redirect to='/' />
				</Switch>
			</Router>
		</div>
	)
}

export default App
