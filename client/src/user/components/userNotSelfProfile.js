import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Image, Button, Card, Spinner, Alert } from 'react-bootstrap'

import { Mutation } from 'react-apollo'
import { FOLLOW } from './../../queries/index'
import { withRouter } from 'react-router-dom'

import CardHeader from './../../shared/components/CardHeader'
import CardFooter from './../../shared/components/CardFooter'
import CardBody from './../../shared/components/CardBody'

class UserNotSelfProfile extends Component {
	state = {
		error: false,
		errorMessage: '',
		follow: this.props.currentUser.followings.includes(
			this.props.match.params.userId
		)
			? true
			: false,
	}

	// when change the follow type the DOM not updated. fix it
	// handleUnFollow = async (event, unfollow) => {
	// 	event.preventDefault()
	// 	await unfollow()
	// 		.then(({ data }) => {
	// 			console.log(data)
	// 		})
	// 		.catch((err) => {
	// 			throw new Error(err.message)
	// 		})
	// }

	handleFollow = async (event, follow) => {
		event.preventDefault()
		await follow()
			.then(({ data }) => {
				console.log(data)
				this.setState({ follow: !this.state.follow })
			})
			.catch((err) => {
				throw new Error(err.message)
			})
	}

	render() {
		const { user, users } = this.props
		console.log(this.props)
		return (
			<React.Fragment key={user._id}>
				{this.state.error && (
					<Alert variant='danger'> {this.state.errorMessage} </Alert>
				)}
				<div className='profile__notUserSelf--header'>
					<div className='profile__notUserSelf--headerLeft'>
						<Image
							src={user.profileImage}
							alt={user.name}
							thumbnail
							roundedCircle
							style={{ width: '40%' }}
						/>
						<strong> {user.name} </strong>
					</div>
					<div className='profile__notUserSelf--headerRight'>
						<div className='profile__notUserSelf--headerRightTop'>
							<div className='profile__notUserSelf--data'>
								<strong>Followings </strong>
								<span> {user.followings.length}</span>
							</div>
							<div className='profile__notUserSelf--data'>
								<strong>Followers </strong>
								<span> {user.followers.length}</span>
							</div>
							<div className='profile__notUserSelf--data'>
								<strong>Posts </strong>
								<span> {user.posts.length}</span>
							</div>
						</div>
						<div className='profile__notUserSelf--btn'>
							{/* {this.props.currentUser.followings.includes(user._id) ? (
								<Mutation
									variables={{
										currentUserId: this.props.currentUser._id,
										targetUserId: this.props.match.params.userId,
									}}
									mutation={UNFOLLOW}
								>
									{(unfollow, { data, loading, error }) => {
										if (error) {
											this.setState({
												error: true,
												errorMessage: error.message,
											})
										}
										return (
											<Button
												onClick={(event) =>
													this.handleUnFollow(event, unfollow)
												}
												variant='danger'
											>
												{loading ? <Spinner animation='border' /> : 'UnFollow'}
											</Button>
										)
									}}
								</Mutation>
							) : (
								<Mutation
									variables={{
										currentUserId: this.props.currentUser._id,
										targetUserId: this.props.match.params.userId,
									}}
									mutation={FOLLOW}
								>
									{(follow, { data, loading, error }) => {
										if (error) {
											this.setState({
												error: true,
												errorMessage: error.message,
											})
										}
										return (
											<Button
												onClick={(event) => this.handleFollow(event, follow)}
												variant='success'
											>
												{loading ? <Spinner animation='border' /> : 'Follow'}
											</Button>
										)
									}}
								</Mutation>
							)} */}

							<Mutation
								variables={{
									currentUserId: this.props.currentUser._id,
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
					{user.posts.map((post) => {
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
									user={user}
									post={post}
									showDropDowns={false}
								/>
								<CardBody post={post} />
								<CardFooter users={users} post={post} user={user} />
							</Card>
						)
					})}
				</div>
			</React.Fragment>
		)
	}
}

const mapStateToProps = (state) => {
	return { currentUser: state.currentUser.currentUser }
}

export default connect(mapStateToProps)(withRouter(UserNotSelfProfile))
