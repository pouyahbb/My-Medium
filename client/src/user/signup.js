import React, { Component } from 'react'
import { Form, Button, Col, Image, Spinner, Alert } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import jwt from 'jsonwebtoken'

import { connect } from 'react-redux'
import { currentUser } from './../redux/actions/index'
 
import { Mutation } from 'react-apollo'
import { SIGN_UP } from './../queries/index'
import defaultImage from './../assets/images/default.jpg'


import './auth.style.scss'

class Signup extends Component {
	state = {
		name: '',
		profileImage: defaultImage,
		password: '',
		passwordConfirm: '',
		email: '',
		sexually: 'None',
		nickName: '',
	}

	profileImageHandler = (event) => {
		if (event.target.files && event.target.files[0]) {
			let reader = new FileReader()
			reader.onload = (e) => {
				this.setState({ profileImage: e.target.result })
			}
			reader.readAsDataURL(event.target.files[0])
		}
	}

	handleChange = (e) => {
		const { value, name } = e.target
		this.setState({ [name]: value })
	}

	handleSubmit = (event, signup) => {
		event.preventDefault()
		signup()
			.then(async ({ data }) => {
				console.log(data)
				let user = jwt.verify(
					data.signup.token,
					'FDSAFMASP;MF EWIOM1N2OI3M1KL3 MCV XZVCX ZEWMKPEROWAIM R'
				)
				this.props.currentUser(user)
				this.props.history.push('/')
			})
			.catch((err) => {
				throw new Error(err.message)
			})
	}

	render() {
		const {
			email,
			name,
			nickName,
			password,
			passwordConfirm,
			profileImage,
			sexually,
		} = this.state
		return (
			<Mutation
				mutation={SIGN_UP}
				variables={{
					email,
					name,
					nickName,
					password,
					passwordConfirm,
					profileImage,
					sexually,
				}}
			>
				{(signup, { data, loading, error }) => {
					return (
						<Form
							className='signup'
							onSubmit={(event) => this.handleSubmit(event, signup)}
						>
							<h1> Create your own account </h1>
							{error && (
								<Alert variant='danger'> {error.message.split(':')[1]} </Alert>
							)}
							<Form.Row>
								<Form.Group as={Col} controlId='name'>
									<Form.Label>Name</Form.Label>
									<Form.Control
										required
										name='name'
										value={name}
										onChange={this.handleChange}
										type='text'
										placeholder='Enter name'
										autoFocus
									/>
								</Form.Group>
								<Form.Group as={Col} controlId='name'>
									<Form.Label>NickName</Form.Label>
									<Form.Control
										required
										name='nickName'
										value={nickName}
										onChange={this.handleChange}
										type='text'
										placeholder='Enter nickName'
									/>
									<Form.Text className='text-muted'>
										NickName must be unique.
									</Form.Text>
								</Form.Group>
							</Form.Row>

							<Form.Group controlId='formBasicEmail'>
								<Form.Label>Email address</Form.Label>
								<Form.Control
									name='email'
									required
									value={email}
									onChange={this.handleChange}
									type='email'
									placeholder='Enter email'
								/>
								<Form.Text className='text-muted'>
									We'll never share your email with anyone else.
								</Form.Text>
							</Form.Group>

							<Form.Row>
								<Form.Group as={Col} controlId='formBasicPassword'>
									<Form.Label>Password</Form.Label>
									<Form.Control
										name='password'
										required
										value={password}
										onChange={this.handleChange}
										type='password'
										placeholder='Password'
									/>
								</Form.Group>
								<Form.Group as={Col} controlId='formBasicPassword'>
									<Form.Label>Reapet your password</Form.Label>
									<Form.Control
										name='passwordConfirm'
										value={passwordConfirm}
										required
										onChange={this.handleChange}
										type='password'
										placeholder='Password Confirm'
									/>
								</Form.Group>
							</Form.Row>

							<Form.Label
								as={Col}
								className='my-1 mr-2'
								htmlFor='inlineFormCustomSelectPref'
							>
								Sexually
							</Form.Label>
							<Form.Control
								name='sexually'
								value={sexually}
								onChange={this.handleChange}
								as='select'
								className='mr-sm-2'
								id='inlineFormCustomSelect'
								custom
							>
								<option value='None'>None</option>
								<option value='Male'>Male</option>
								<option value='Female'>Female</option>
							</Form.Control>

							<Form.Row>
								<Form.Group as={Col} style={{ marginTop: '2rem' }}>
									<Form.File
										className='position-relative'
										name='profileImage'
										label='Your Profile Image'
										onChange={this.profileImageHandler}
										id='validationFormik107'
										feedbackTooltip
									/>
								</Form.Group>
								<Form.Group as={Col}>
									<Image
										style={{ width: '30%', marginTop: '2rem' }}
										src={profileImage}
										alt={name}
										roundedCircle
									/>
								</Form.Group>
							</Form.Row>

							<Button
								disabled={loading ? true : false}
								variant='dark'
								type='submit'
							>
								{loading ? <Spinner animation='border' /> : 'Signup'}
							</Button>
						</Form>
					)
				}}
			</Mutation>
		)
	}
}
export default connect(null , { currentUser })(withRouter(Signup))
