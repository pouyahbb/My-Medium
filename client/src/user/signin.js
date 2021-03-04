import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap'
import jwt from 'jsonwebtoken'

import { currentUser } from '../redux/actions/index'

import { Mutation } from 'react-apollo'
import { SIGNIN } from './../queries/index'

import './auth.style.scss'

class Signin extends Component {
	state = {
		email: '',
		password: '',
	}
	handleChange = (e) => {
		const { value, name } = e.target
		this.setState({ [name]: value })
	}

	handleSubmit = (event, signin) => {
		event.preventDefault()
		signin().then(async ({ data }) => {
      console.log(data)
			let user = jwt.verify(
				data.signin.token,
				'FDSAFMASP;MF EWIOM1N2OI3M1KL3 MCV XZVCX ZEWMKPEROWAIM R'
			)
			this.props.currentUser(user)
			this.props.history.push('/')
		})
	}

	render() {
		const { email, password } = this.state
		return (
			<Container>
				<div className='signin'>
					<h1> Sign in with your email and password </h1>
					<Mutation variables={{ email, password }} mutation={SIGNIN}>
						{(signin, { data, loading, error }) => {
							return (
								<Form onSubmit={(event) => this.handleSubmit(event, signin)}>
									{error && (
										<Alert variant='danger'>
											{error.message.split(':')[1]}
										</Alert>
									)}

									<Form.Group controlId='formBasicEmail'>
										<Form.Label>Email address</Form.Label>
										<Form.Control
											onChange={this.handleChange}
											value={this.state.email}
											name='email'
											type='email'
											placeholder='Enter email'
											autoFocus
										/>
										<Form.Text className='text-muted'>
											We'll never share your email with anyone else.
										</Form.Text>
									</Form.Group>

									<Form.Group controlId='formBasicPassword'>
										<Form.Label>Password</Form.Label>
										<Form.Control
											onChange={this.handleChange}
											value={this.state.password}
											name='password'
											type='password'
											placeholder='Password'
										/>
									</Form.Group>
									<Button
										disabled={loading ? true : false}
										variant='dark'
										type='submit'
									>
										{loading ? <Spinner animation='border' /> : 'Submit'}
									</Button>
									<span
										onClick={this.handleClick}
										className='signin__singupBtn'
									>
										{' '}
										Not already have an account ? Create one{' '}
									</span>
								</Form>
							)
						}}
					</Mutation>
				</div>
			</Container>
		)
	}
}
const mapStateToProps = (state) => {
	return { user: state.currentUser.currentUser }
}

export default connect(mapStateToProps, { currentUser })(withRouter(Signin))
