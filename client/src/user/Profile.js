import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Query } from 'react-apollo'
import { GET_ALL_USERS } from './../queries/index'

import { Spinner, Alert } from 'react-bootstrap'

import UserSelfProfile from './components/userSelfProfile'
import UserNotProfileSelf from './components/userNotSelfProfile'

import './Profile.style.scss'

class Profile extends Component {
	// when follow or unfollow a user the followers from targetUser not update => the problem come from resolver that return currentUser not targetUser ,we need both
	render() {
		const { user } = this.props
		return (
			<div className='profile'>
				{user._id === this.props.match.params.userId ? (
					<UserSelfProfile user={user} />
				) : (
					<div className='profile__notUserSefl'>
						<Query query={GET_ALL_USERS}>
							{({ data, loading, error }) => {
								const { getAllUsers } = data
								if (loading) {
									return <Spinner animation='border' />
								}
								if (error) {
									return <Alert variant='danger'> {error.message} </Alert>
								}

								return getAllUsers
									.filter((data) => {
										return data._id === this.props.match.params.userId
									})
									.map((targetUser) => {
										return (
											<UserNotProfileSelf
												users={getAllUsers}
												targetUser={targetUser}
												key={targetUser._id}
											/>
										)
									})
							}}
						</Query>
					</div>
				)}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return { user: state.currentUser.currentUser }
}

export default connect(mapStateToProps)(Profile)
