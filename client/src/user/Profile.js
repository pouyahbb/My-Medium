import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Query } from 'react-apollo'
import { GET_ALL_USERS } from './../queries/index'

import { Spinner, Alert } from 'react-bootstrap'

import UserSelfProfile from './components/userSelfProfile'
import UserNotProfileSelf from './components/userNotSelfProfile'

import './Profile.style.scss'

class Profile extends Component {
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
									.map((user) => {
										return <UserNotProfileSelf users={getAllUsers} user={user} key={user._id} />
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
