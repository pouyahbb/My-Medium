import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
	Form,
	Col,
	Button,
	Image,
	Modal,
	FormControl,
	Spinner,
	Alert
} from 'react-bootstrap'
import jwt from 'jsonwebtoken'

import { Mutation } from 'react-apollo'
import { UPDATE_USER, DELETE_USER } from './../../queries/index'

import { currentUser } from './../../redux/actions/index'

class UserSelfProfile extends Component {
	state = {
		profileImage: this.props.user.profileImage,
		name: this.props.user.name,
		nickName: this.props.user.nickName,
		password: '',
		passwordConfirm: '',
		sexually: this.props.user.sexually,
		email: this.props.user.email,
		isChange: false,
		modal: false,
		usernameForModal: '',
		nameIsTrue: false,
	}

	modalHandleChange = (e) => {
		let userName = e.target.value
		this.setState({ usernameForModal: userName })
	}
	profileImageHandler = (event) => {
		if (event.target.files && event.target.files[0]) {
			let reader = new FileReader()
			reader.onload = (e) => {
				this.setState({ profileImage: e.target.result })
			}
			reader.readAsDataURL(event.target.files[0])
		}
		this.setState({ isChange: true })
	}

	deleteUserHandler = (e , deleteUser) => {
		e.preventDefault()
		deleteUser().then(async({data}) => {
			const { deleteUser } =data;
			this.props.history.push('/signin')
			this.props.currentUser(null)
		}).catch(err => {
			throw new Error(err.message)
		})
	}
	handleSubmit = (event, updateUserProfile) => {
		event.preventDefault()
		updateUserProfile()
			.then(async ({ data }) => {
				const { updateUserProfile } = data
				let user = await jwt.verify(
					updateUserProfile.token,
					'FDSAFMASP;MF EWIOM1N2OI3M1KL3 MCV XZVCX ZEWMKPEROWAIM R'
				)
				this.props.currentUser(user)
				this.props.history.push('/')

				// show alert in main page that about profile update
			})
			.catch((err) => {
				throw new Error(err.message)
			})
	}
	handleChange = (e) => {
		const { value, name } = e.target
		this.setState({ [name]: value })
		this.setState({ isChange: true })
	}

	modalContent = () => {
		return <div>modal</div>
	}

	showModal = () => {
		this.setState({ modal: true })
	}
	handleClose = () => {
		this.setState({ modal: false })
	}

	render() {
		const { user } = this.props
		const {
			name,
			email,
			nickName,
			password,
			passwordConfirm,
			profileImage,
			sexually,
		} = this.state

		return (
			<React.Fragment>
				{this.state.modal ? (
					<Modal show={this.state.modal} onHide={this.handleClose}>
						<Modal.Header closeButton>
							<Modal.Title> Delete Your Account </Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Modal.Title
								style={{
									borderBottom: '1px solid #3333',
									padding: '1rem',
									marginBottom: '2rem',
								}}
							>
								<strong
									style={{ textTransform: 'capitalize', marginRight: '.5rem' }}
								>
									{user.name}
								</strong>
								are you sure want to delete your account?
							</Modal.Title>
							<h5>
								Please write your name(<strong>{user.name}</strong>) that we be
								sure you don't do any wrong thing.
							</h5>
						</Modal.Body>
						<Modal.Footer>
							<Mutation
								mutation={DELETE_USER}
								variables={{ _id: this.props.user._id }}
							>
								{(deleteUser, { data, loading, error }) => {
									return (
										<Form
											style={{
												display: 'flex',
												alignItems: 'center',
												width: ' 100%',
											}}
											onSubmit={(event) =>
												this.deleteUserHandler(event, deleteUser)
											}
										>
											{error && (
												<Alert variant='danger'>
													{error.message.split(':')[1]}
												</Alert>
											)}
											<FormControl
												type='text'
												placeholder='Write your name'
												className='mr-sm-2'
												onChange={this.modalHandleChange}
												name='usernameForModal'
												value={this.state.usernameForModal}
												autoFocus
												style={{ width: '67%' }}
											/>
											<Button
												disabled={
													this.state.usernameForModal === user.name
														? false
														: true
												}
												variant='danger'
												type='submit'
												onSubmit={this.userDeleteHandler}
											>
												{loading ? (
													<Spinner animation='border' />
												) : (
													'Delete Account'
												)}
											</Button>
										</Form>
									)
								}}
							</Mutation>

							{/* )
									}}
								</Mutation> */}
						</Modal.Footer>
					</Modal>
				) : (
					<Mutation
						variables={{
							name,
							nickName,
							_id: user._id,
							email,
							password,
							passwordConfirm,
							sexually,
							profileImage,
						}}
						mutation={UPDATE_USER}
					>
						{(updateUserProfile, { data, loading, error }) => {
							return (
								<Form
									onSubmit={(event) =>
										this.handleSubmit(event, updateUserProfile)
									}
								>
									{error && (
										<Alert variant='danger'>
											{error.message.split(':')[1]}
										</Alert>
									)}
									<h1 className='profile__text'> Your Profile Information </h1>
									<div className='profile__header'>
										<div className='profile__header--info'>
											<strong> Followings </strong>
											<span> {user.followings.length} </span>
										</div>
										<div className='profile__header--info'>
											<strong> Followers </strong>
											<span> {user.followers.length} </span>
										</div>
										<div className='profile__header--info'>
											<strong
												onClick={() => {
													this.props.history.push(`/${user._id}/posts`)
												}}
											>
												posts
											</strong>
											<span> {user.posts.length} </span>
										</div>
									</div>
									<div className='profile__image'>
										<Form.Row>
											<Form.Group as={Col}>
												<Form.File
													className='position-relative'
													name='profileImage'
													label='Change Your Image'
													onChange={this.profileImageHandler}
													id='validationFormik107'
													feedbackTooltip
												/>
											</Form.Group>
											<Form.Group as={Col}>
												<Image
													style={{ width: '30%', marginTop: '2rem' }}
													src={this.state.profileImage}
													alt={this.state.name}
													roundedCircle
													thumbnail
												/>
											</Form.Group>
										</Form.Row>
									</div>
									<Form.Row>
										<Form.Group as={Col}>
											<Form.Label>name</Form.Label>
											<Form.Control
												onChange={this.handleChange}
												type='text'
												placeholder='Name'
												value={this.state.name}
												name='name'
											/>
										</Form.Group>
										<Form.Group as={Col}>
											<Form.Label>NickName</Form.Label>
											<Form.Control
												type='text'
												placeholder='NickName'
												value={this.state.nickName}
												onChange={this.handleChange}
												name='nickName'
											/>
										</Form.Group>
									</Form.Row>
									<Form.Group>
										<Form.Label> Email </Form.Label>
										<Form.Control
											type='eamil'
											placeholder='Email'
											value={this.state.email}
											onChange={this.handleChange}
											name='email'
										/>
									</Form.Group>
									<Form.Row>
										<Form.Group as={Col}>
											<Form.Label> Password </Form.Label>
											<Form.Control
												type='password'
												placeholder='Password'
												value={this.state.password}
												onChange={this.handleChange}
												name='password'
											/>
										</Form.Group>
										<Form.Group as={Col}>
											<Form.Label> Password Confirm </Form.Label>
											<Form.Control
												type='password'
												placeholder='Password Confirm'
												value={this.state.passwordConfirm}
												onChange={this.handleChange}
												name='passwordConfirm'
											/>
										</Form.Group>
									</Form.Row>
									<Form.Text
										style={{ marginBottom: '2rem', marginTop: '-1rem' }}
										className='text-muted'
									>
										Password and passwordConfirm should be same.
									</Form.Text>

									<Form.Group>
										<Form.Label>Sexually</Form.Label>
										<Form.Control
											onChange={this.handleChange}
											as='select'
											value={this.state.sexually}
											name='sexually'
										>
											<option>None</option>
											<option>Male</option>
											<option>Female</option>
										</Form.Control>
									</Form.Group>
									<div className='profile__footer'>
										<Button
											variant='dark'
											disabled={
												!this.state.isChange ||
												this.state.password !== this.state.passwordConfirm
											}
											type='submit'
										>
											{loading ? <Spinner animation='border' /> : 'Save Change'}
										</Button>
										<Button onClick={this.showModal} variant='danger'>
											Delete Account
										</Button>
									</div>
								</Form>
							)
						}}
					</Mutation>
				)}
			</React.Fragment>
		)
	}
}

export default connect(null, { currentUser })(withRouter(UserSelfProfile))
