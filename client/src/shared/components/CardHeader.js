import React, { Component } from 'react'
import { Card, Image, Dropdown, Alert, Spinner } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { currentUser } from './../../redux/actions/index'

import { Mutation } from 'react-apollo'
import { FOLLOW } from './../../queries/index'

import Moment from 'react-moment'

class CardHeader extends Component {
	state = {
		unfollow: false,
	}

	handleUnfollowBtn = async (event, follow) => {
		console.log('clicked')
		await follow()
			.then(({ data }) => {
				this.setState({ unfollow: true })
				return data
			})
			.catch((err) => {
				this.setState({ unfollow: false })
				throw new Error(err.message)
			})
	}
	render() {
		return (
			<Card.Header
				style={{
					borderBottom: '1px solid #eaeaea',
					marginBottom: '1rem',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-around',
				}}
			>
				<div className='mainage__header--leftSide'>
					<Image
						onClick={() => {
							this.props.history.push(`/${this.props.user._id}/profile`)
						}}
						src={this.props.user.profileImage}
						thumbnail
						roundedCircle
						style={{ width: '20%', cursor: 'pointer' }}
					/>
					<span> {this.props.user.nickName} </span>
				</div>
				<div className='mainPage__header--rightSide'>
					<span>
						<Moment fromNow>{this.props.post.createdAt}</Moment>
					</span>
					{this.props.post.sharedUser === this.props.correctUser._id &&
					this.props.showDropDowns === true ? (
						<div className='mainPage__header--postInfo'>
							<Dropdown>
								<Dropdown.Toggle variant='primary' id='dropdown-basic' />
								<Dropdown.Menu>
									<Dropdown.Item>Delete Post</Dropdown.Item>
									<Dropdown.Item>Edit Post</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					) : this.props.post.sharedUser !== this.props.correctUser._id &&
					  this.props.showDropDowns === true ? (
						<div className='mainPage__header--postInfo'>
							<Dropdown>
								<Dropdown.Toggle variant='primary' id='dropdown-basic' />
								<Dropdown.Menu>
									<Mutation
										mutation={FOLLOW}
										variables={{
											currentUserId: this.props.correctUser._id,
											targetUserId: this.props.post.sharedUser,
											value: 'unFollow',
										}}
									>
										{(follow, { data, loading, error }) => {
											if (loading) {
												return <Spinner animation='border' />
											}
											if (error) {
												return <Alert variant='danger'> {error.message} </Alert>
											}
											return (
												<Dropdown.Item
													onClick={(event) => {
														this.handleUnfollowBtn(event, follow)
													}}
													disabled={this.state.unfollow ? true : false}
												>
													{this.state.unfollow ? (
														<span style={{ color: '#218838' }}>
															Not followed
														</span>
													) : (
														<span style={{ color: '#c82333' }}>
															UnFollow User
														</span>
													)}
												</Dropdown.Item>
											)
										}}
									</Mutation>

									<Dropdown.Item
										onClick={() =>
											this.props.history.push(`/${this.props.user._id}/profile`)
										}
									>
										User Profile
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					) : null}
				</div>
			</Card.Header>
		)
	}
}
const mapStateToProps = (state) => {
	return { correctUser: state.currentUser.currentUser }
}

export default connect(mapStateToProps, { currentUser })(withRouter(CardHeader))
