import React, { Component } from 'react'
import {
	Card,
	Accordion,
	Button,
	Image,
	Form,
	Spinner,
	Alert,
} from 'react-bootstrap'

import { Query, Mutation } from 'react-apollo'
import { GET_ALL_USERS, LIKE, ADD_COMMENT } from './../../queries/index'
import { withRouter } from 'react-router-dom'

import Moment from 'react-moment'

class CardFooter extends Component {
	state = {
		addComment: '',
		like: false,
	}

	componentDidMount() {
		this.props.post.likes.map((like) => {
			if (like === this.props.user._id) {
				return this.setState({ like: true })
			}
			return this.setState({ like: false })
		})
	}

	handleLike = async (event, like) => {
		this.setState({ like: !this.state.like })
		await like()
			.then(({ data }) => {
				console.log(data)
			})
			.catch((err) => {
				throw new Error(err.message)
			})
	}
	handleChange = (e) => {
		const { value } = e.target
		this.setState({ addComment: value })
	}

	addCommentHandler = async (comment) => {
		await comment()
			.then(({ data }) => {
				console.log(data)
				this.setState({ addComment: '' })
			})
			.catch((err) => {
				throw new Error(err.message)
			})
	}

	render() {
		return (
			<Card.Footer>
				<Mutation
					mutation={LIKE}
					variables={{
						_id: this.props.post._id,
						userId: this.props.user._id,
						term: this.state.like ? 'unLike' : 'like',
					}}
				>
					{(like, { data, loading, error }) => {
						return (
							<i
								onClick={(event) => this.handleLike(event, like)}
								className={this.state.like ? 'fas fa-heart' : 'far fa-heart'}
								style={this.state.like ? { color: 'red' } : null}
							></i>
						)
					}}
				</Mutation>

				<Card.Title>
					{this.props.post.likes && this.props.post.likes.length}
					{this.props.post.likes.length > 1 ? ' Likes' : ' Like'}
				</Card.Title>
				<Card.Text>
					<Query query={GET_ALL_USERS}>
						{({ data, loading, error }) => {
							if (loading) {
								return <Spinner animation='border' />
							}
							if (error) {
								return <Alert variant='danger'> {error.message} </Alert>
							}
							return data.getAllUsers
								.filter((usr) => {
									return usr._id === this.props.post.sharedUser
								})
								.map((shared) => {
									return (
										<strong key={this.props.post._id}> {shared.name} : </strong>
									)
								})
						}}
					</Query>
					{this.props.post.description}
				</Card.Text>
				<div className='mainPage__data--cmtStuff'>
					<Accordion defaultActiveKey='0'>
						<Accordion.Toggle
							as={Button}
							variant='light'
							style={{ marginBottom: '1rem' }}
							eventKey='1'
						>
							{this.props.post.comments && this.props.post.comments.length > 1
								? `Tap to view all ${this.props.post.comments.length} comments`
								: this.props.post.comments &&
								  this.props.post.comments.length === 1
								? ` Tap to view ${this.props.post.comments.length} comment`
								: 'No comment added yet'}
						</Accordion.Toggle>
						<Accordion.Collapse eventKey='1'>
							<Card.Body>
								{console.log(this.props.post)}
								{this.props.post.comments &&
								this.props.post.comments.length === 0 ? (
									'No comment added here. '
								) : (
									<div className='mainPage__comments'>
										{this.props.post.comments &&
											this.props.post.comments.map((comment) => {
												return (
													<React.Fragment key={comment.createdAt}>
														<div className='mainPage__comments--userInfo'>
															<Query query={GET_ALL_USERS}>
																{({ data, loading, error }) => {
																	if (loading) {
																		return <Spinner animation='border' />
																	}
																	if (error) {
																		return (
																			<Alert variant='danger'>
																				{error.message}
																			</Alert>
																		)
																	}
																	return data.getAllUsers
																		.filter((user) => {
																			return user._id === comment.userId
																		})
																		.map((usr) => {
																			return (
																				<React.Fragment key={usr._id}>
																					<Image
																						style={{
																							width: '10%',
																							cursor: 'pointer',
																						}}
																						src={usr.profileImage}
																						alt={usr.name}
																						thumbnail
																						roundedCircle
																						onClick={() => {
																							this.props.history.push(
																								`${usr._id}/profile`
																							)
																						}}
																					/>
																					<strong>{usr.name} - </strong>
																					<p>{comment.text}</p>
																				</React.Fragment>
																			)
																		})
																}}
															</Query>
														</div>
														<div className='mainPage__comments--commentInfo'>
															<span>
																<Moment fromNow>{comment.createdAt}</Moment>
															</span>
															<span> Reply </span>
														</div>
													</React.Fragment>
												)
											})}
									</div>
								)}
							</Card.Body>
						</Accordion.Collapse>
					</Accordion>
					<div className='mainPage__comments--input'>
						<Mutation
							mutation={ADD_COMMENT}
							variables={{
								userId: this.props.user._id,
								postId: this.props.post._id,
								text: this.state.addComment,
								term: 'add',
							}}
						>
							{(addComment, { data, loading, error }) => {
								if (error) {
									return <Alert variant='danger'> {error.message} </Alert>
								}
								return (
									<React.Fragment>
										<Form.Group style={{ width: '100%' }} controlId='comment'>
											<Form.Control
												onChange={this.handleChange}
												value={this.state.addComment}
												style={{
													backgroundColor: 'transparent',
													color: '#eaeaea',
													borderBottom: '1px solid #eaeaea',
													padding: '.5rem',
													borderRadius: '3px',
												}}
												name='addComment'
												type='text'
												placeholder='Add Comment'
											/>
										</Form.Group>
										<Button
											onClick={() => this.addCommentHandler(addComment)}
											variant='light'
											style={
												(loading ? { cursor: 'not-allowed' } : null,
												{ marginBottom: '16px' })
											}
										>
											{loading ? <Spinner animation='border' /> : 'Add'}
										</Button>
									</React.Fragment>
								)
							}}
						</Mutation>
					</div>
				</div>
			</Card.Footer>
		)
	}
}
export default withRouter(CardFooter)
