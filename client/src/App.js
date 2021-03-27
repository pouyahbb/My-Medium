import React from 'react'
import { connect } from 'react-redux'

import {
	Switch,
	BrowserRouter as Router,
	Route,
	Redirect,
} from 'react-router-dom'

import MainPage from './mainPage'
import NavBar from './shared/NavBar'
import Signup from './user/signup'
import Signin from './user/signin'
import Profile from './user/Profile'
import MyPost from './post/myPosts/myPost'
import CreatePost from './post/myPosts/createPost'

class App extends React.Component {
	render() {
		const { user } = this.props
		const RouterProtected = (props) => {
			return user ? (
				<Route
					path={props.path}
					exact={props.exact}
					component={props.component}
				/>
			) : (
				<Redirect to='/signin' />
			)
		}
		return (
			<div>
				<Router>
					<NavBar />
					<Switch>
						<RouterProtected exact path='/' component={MainPage} />
						<Route exact path='/signup' component={Signup} />
						<Route exact path='/signin' component={Signin} />
						<RouterProtected
							exact
							path='/:userId/new/post'
							component={CreatePost}
						/>
						<RouterProtected
							exact
							path={`/:userId/profile`}
							component={Profile}
						/>
						<RouterProtected exact path={'/:userId/posts'} component={MyPost} />
						<Redirect to='/' />
					</Switch>
				</Router>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return { user: state.currentUser.currentUser }
}

export default connect(mapStateToProps)(App)
