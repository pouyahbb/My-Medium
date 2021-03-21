import React, { Component } from 'react'

import { connect } from 'react-redux'
import { currentUser } from './../redux/actions/index'

import {
	Nav,
	Navbar,
	Image,
	NavDropdown,
	FormControl,
	Button,
	Modal,
	OverlayTrigger,
	Popover,
	Alert,
	Spinner,
} from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'

import { Query, Mutation } from 'react-apollo'
import { GET_ALL_USERS, FOLLOW } from './../queries/index'

import './navBar.style.scss'

class NavBar extends Component {
	state = {
		searchTerm: '',
		modal: false,
		modalHeader: '',
		modalBody: null,
		hideTooltip: false,
		followingsModal: false,
	}

	handleFollow = async (event, follow) => {
		event.preventDefault()
		await follow()
			.then(({ data }) => {
				let { follow } = data
				console.log(follow[0])
				this.props.currentUser(follow[0])
			})
			.catch((err) => {
				throw new Error(err.message)
			})
	}

	handleHideTooltip = () => {
		if (this.state.searchTerm.length > 0) {
			return this.setState({ hideTooltip: false })
		}
		return this.setState({ hideTooltip: true })
	}
	handleSignout = () => {
		this.props.currentUser(null)
	}

	handleChange = (e) => {
		const { value, name } = e.target
		this.setState({ [name]: value })
	}

	FollowersAndFollowingsModal = (followType) => {
		return followType.map((type) => {
			return (
				<Query query={GET_ALL_USERS}>
					{({ data, loading, error }) => {
						const { getAllUsers } = data
						if (loading) {
							return <Spinner animation='border' />
						}
						return getAllUsers
							.filter((data) => {
								return data._id === type
							})
							.map((user) => {
								return (
									<div key={user._id} className='navBar__modal'>
										{error ? (
											<Alert variant='danger'> {error.message} </Alert>
										) : (
											<React.Fragment>
												<div className='navBar__modal--userInfo'>
													<Image
														src={user.profileImage}
														alt={user.nickName}
														roundedCircle
														thumbnail
														style={{ width: '20%', cursor: 'pointer' }}
														onClick={() => {
															this.props.history.push(`/${user._id}/profile`)
															this.setState({ modal: false })
														}}
													/>
													<div className='navBar__modal--userName'>
														<strong
															onClick={() => {
																this.props.history.push(`/${user._id}/profile`)
																this.setState({ modal: false })
															}}
														>
															{user.name}
														</strong>
														<span> {user.nickName} </span>
													</div>
												</div>
												<div className='navBar__modal--btn'>
													{this.state.followingsModal ? (
														<Mutation
															mutation={FOLLOW}
															variables={{
																currentUserId: this.props.user._id,
																targetUserId: user._id,
																value: 'unFollow',
															}}
														>
															{(follow, { data, loading, error }) => {
																return (
																	<Button
																		variant='danger'
																		disabled={
																			this.props.user.followings.includes(
																				user._id
																			) ||
																			(data &&
																				data.follow[0].followings.includes(
																					user._id
																				))
																				? true
																				: false
																		}
																		onClick={(event) =>
																			this.handleFollow(event, follow)
																		}
																	>
																		{loading ? (
																			<Spinner animation='border' />
																		) : (data &&
																				data.follow[0].followings.includes(
																					data.follow[1]._id
																				)) ||
																		  this.props.user.followings.includes(
																				user._id
																		  ) ? (
																			'UnFollow'
																		) : (
																			'UnFollowed'
																		)}
																	</Button>
																)
															}}
														</Mutation>
													) : (
														<Mutation
															mutation={FOLLOW}
															variables={{
																currentUserId: this.props.user._id,
																targetUserId: user._id,
																value: 'follow',
															}}
														>
															{/* fix the problem about the followers and followings when unfollow the user model that text now show correct
															 */}
															{(follow, { data, loading, error }) => {
																return (
																	<Button
																		variant={
																			this.props.user.followings.includes(
																				user._id
																			) ||
																			(data &&
																				data.follow[0].followings.includes(
																					user._id
																				))
																				? 'success'
																				: 'info'
																		}
																		onClick={(event) =>
																			this.handleFollow(event, follow)
																		}
																		disabled={
																			this.props.user.followings.includes(
																				user._id
																			) ||
																			(data &&
																				data.follow[0].followings.includes(
																					user._id
																				))
																				? true
																				: false
																		}
																	>
																		{console.log(data && data.follow[0])}
																		{loading ? (
																			<Spinner animation='border' />
																		) : (data &&
																				data.follow[0].followings.includes(
																					data.follow[1]._id
																				)) ||
																		  this.props.user.followings.includes(
																				user._id
																		  ) ? (
																			'Following'
																		) : (
																			'FollowBack'
																		)}
																	</Button>
																)
															}}
														</Mutation>
													)}
												</div>
											</React.Fragment>
										)}
									</div>
								)
							})
					}}
				</Query>
			)
		})
	}

	showModal = (e) => {
		const { name } = e.target

		this.setState({ modal: true })
		if (name === 'followings') {
			this.setState({
				modalHeader: 'Followings',
				modalBody: this.FollowersAndFollowingsModal(this.props.user.followings),
				followingsModal: true,
			})
		} else if (name === 'followers') {
			this.setState({
				modalHeader: 'Followers',
				modalBody: this.FollowersAndFollowingsModal(this.props.user.followers),
				followingsModal: false,
			})
		}
	}

	handleClose = () => {
		this.setState({ modal: false })
	}

	showContent = () => {
		if (!this.props.user) {
			return (
				<LinkContainer
					to={
						this.props.location.pathname === '/signin' ? '/signup' : '/signin'
					}
				>
					<Nav.Link>
						<i className='fas fa-user'></i>{' '}
						{this.props.location.pathname === '/signin' ? 'Sing up' : 'Sign in'}
					</Nav.Link>
				</LinkContainer>
			)
		} else {
			return (
				<React.Fragment>
					<Query query={GET_ALL_USERS}>
						{({ data, loading, error }) => {
							if (loading) {
								return <Spinner animation='border' />
							}
							if (error) {
								return <Alert variant='danger'> {error.message} </Alert>
							}
							const { getAllUsers } = data
							return (
								<OverlayTrigger
									show={this.state.searchTerm.length > 0 ? true : false}
									onHide={this.handleHideTooltip}
									overlay={
										<Popover>
											{getAllUsers
												.filter((data) => {
													let users = data.nickName
														.toLowerCase()
														.includes(this.state.searchTerm.toLowerCase())
													return users
												})
												.map((user) => {
													return (
														<Popover.Content
															onClick={() => {
																this.props.history.push(`${user._id}/profile`)
																this.setState({ searchTerm: '' })
															}}
															key={user.nickName}
														>
															<Image
																style={{ width: '20%' }}
																src={user.profileImage}
																alt={user.name}
																thumbnail
																roundedCircle
															/>
															<div className='navBar__tooltip--rightSide'>
																<strong> {user.name} </strong>
																<span> {user.nickName} </span>
															</div>
														</Popover.Content>
													)
												})}
										</Popover>
									}
									placement='bottom'
								>
									<FormControl
										onChange={this.handleChange}
										value={this.state.searchTerm}
										name='searchTerm'
										type='text'
										placeholder='Username'
										className='mr-sm-2'
										style={{ width: '40%' }}
									/>
								</OverlayTrigger>
							)
						}}
					</Query>

					<Nav.Link name='followers' onClick={this.showModal}>
						Followers
					</Nav.Link>
					<Nav.Link name='followings' onClick={this.showModal}>
						Followings
					</Nav.Link>
					<LinkContainer to={`/${this.props.user._id}/posts`}>
						<Nav.Link>My Posts</Nav.Link>
					</LinkContainer>
					<NavDropdown title={this.props.user.name} id='basic-nav-dropdown'>
						<NavDropdown.Item onClick={this.handleSignout}>
							Sign Out
						</NavDropdown.Item>
					</NavDropdown>
					<LinkContainer to='/notification'>
						<Nav.Link>
							<div className='navBar__notification'>
								<i className='far fa-bell'></i>
							</div>
						</Nav.Link>
					</LinkContainer>
					<LinkContainer
						to={`/${this.props.user._id}/profile`}
						style-={{ width: '5%', cursor: 'pointer' }}
					>
						<Image
							src={this.props.user.profileImage}
							alt={this.props.user.name}
							roundedCircle
						/>
					</LinkContainer>
				</React.Fragment>
			)
		}
	}
	render() {
		return (
			<div className='navBar'>
				{this.state.modal ? (
					<Modal show={this.state.modal} onHide={this.handleClose}>
						<Modal.Header closeButton>
							<div className='navBar__modal--header'>
								<div className='navBar__modal--heaederText'>
									<Modal.Title> {this.state.modalHeader} </Modal.Title>
								</div>
								<div className='navBar__modal--headerSearch'>
									{/* <Form inline> */}
									<FormControl
										type='text'
										placeholder='Search'
										className='mr-sm-2'
										onChange={this.followSearchHandler}
										name='followSearchTerm'
										value={this.state.followSearchTerm}
									/>
									{/* </Form> */}
								</div>
							</div>
						</Modal.Header>
						<Modal.Body>{this.state.modalBody}</Modal.Body>
					</Modal>
				) : (
					<Navbar bg='dark' variant='dark' expand='lg' sticky='top'>
						<LinkContainer to='/'>
							<Navbar.Brand>
								<span className='navBar__brand'>My</span>-Medium
							</Navbar.Brand>
						</LinkContainer>

						<div className='navBar__links'>
							<Nav className='justify-content-end'>{this.showContent()}</Nav>
						</div>
					</Navbar>
				)}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return { user: state.currentUser.currentUser }
}

export default connect(mapStateToProps, { currentUser })(withRouter(NavBar))
