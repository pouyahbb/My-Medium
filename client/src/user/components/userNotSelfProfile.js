import React, { Component } from 'react'
import { connect } from 'react-redux'
import { currentUser } from './../../redux/actions/index'
import { Image, Button, Card, Spinner, Alert } from 'react-bootstrap'

import { Mutation, Query } from 'react-apollo'
import { FOLLOW } from './../../queries/index'
import { withRouter } from 'react-router-dom'

import CardHeader from './../../shared/components/CardHeader'
import CardFooter from './../../shared/components/CardFooter'
import CardBody from './../../shared/components/CardBody'

class UserNotSelfProfile extends Component {
	state = {
		error: false,
		errorMessage: '',
		follow: this.props.user.followings.includes(this.props.match.params.userId)
			? true
			: false,
	}


	handleFollow = async (event, follow) => {
		event.preventDefault()
		await follow()
			.then(({ data }) => {
				let { follow } = data
				this.props.currentUser(follow[0]);

				this.setState({ follow: !this.state.follow })
			})
			.catch((err) => {
				this.setState({ follow: false })
				throw new Error(err.message)
			})
	}

	render() {
		const { targetUser, users } = this.props

		return (
			<React.Fragment key={targetUser._id}>
				{this.state.error && (
					<Alert variant='danger'> {this.state.errorMessage} </Alert>
				)}
				<div className='profile__notUserSelf--header'>
					<div className='profile__notUserSelf--headerLeft'>
						<Image
							src={targetUser.profileImage}
							alt={targetUser.name}
							thumbnail
							roundedCircle
							style={{ width: '40%' }}
						/>
						<strong> {targetUser.name} </strong>
					</div>
					<div className='profile__notUserSelf--headerRight'>
						<div className='profile__notUserSelf--headerRightTop'>
							<div className='profile__notUserSelf--data'>
								<strong>Followings </strong>
								<span> {targetUser.followings.length}</span>
							</div>
							<div className='profile__notUserSelf--data'>
								<strong>Followers </strong>
								<span> {targetUser.followers.length}</span>
							</div>
							<div className='profile__notUserSelf--data'>
								<strong>Posts </strong>
								<span> {targetUser.posts.length}</span>
							</div>
						</div>
						<div className='profile__notUserSelf--btn'>
							<Mutation
								variables={{
									currentUserId: this.props.user._id,
									targetUserId: this.props.match.params.userId,
									value: this.state.follow ? 'unFollow' : 'follow',
								}}
								mutation={FOLLOW}
							>
								{(follow, { data, error, loading }) => {
									return (
										<Button
											onClick={(event) => this.handleFollow(event, follow)}
											variant={this.state.follow ? 'danger' : 'success'}
										>
											{loading ? (
												<Spinner animation='border' />
											) : this.state.follow ? (
												'UnFollow'
											) : (
												'Follow'
											)}
										</Button>
									)
								}}
							</Mutation>
						</div>
					</div>
				</div>
				<div className='profile__notUserSelf--posts'>
					{targetUser.posts.length === 0 ? (
						<React.Fragment>
							<h4 style={{ color : "#333" }}>
								<strong>{targetUser.name}</strong> not shared any post yet.{' '}
							</h4>
						</React.Fragment>
					) : (
						targetUser.posts.map((post) => {
							return (
								<Card
									style={{ width: '50%' }}
									bg='dark'
									text='light'
									className='mb-2'
									key={post.postId}
								>
									<CardHeader
										users={users}
										user={targetUser}
										post={post}
										showDropDowns={false}
									/>
									<CardBody post={post} />
									<CardFooter users={users} post={post} user={targetUser} />
								</Card>
							)
						})
					)}
				</div>
			</React.Fragment>
		)
	}
}

const mapStateToProps = (state) => {
	return { user: state.currentUser.currentUser }
}

export default connect(mapStateToProps, { currentUser })(
	withRouter(UserNotSelfProfile)
)
