import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Col, Button, Image } from 'react-bootstrap'

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
		handleSubmit = (e) => {
			console.log('clicked')
			e.preventDefault()
			let updatedUser = {
				_id: this.props.user._id,
				posts: this.props.user.posts,
				joinDate: this.props.user.joinDate,
				followings: this.props.user.followings,
				followers: this.props.user.followers,
				profileImage: this.state.profileImage,
				name: this.state.name,
				nickName: this.state.nickName,
				email: this.state.email,
				password: this.state.password,
				passwordConfirm: this.state.passwordConfirm,
				sexually: this.state.sexually,
			}
			this.props.currentUser(updatedUser)
			this.props.history.push('/')
		}
		handleChange = (e) => {
			const { value, name } = e.target
			this.setState({ [name]: value })
			this.setState({ isChange: true })
		}
		render() {
      const { user } = this.props
			return (
				<Form onSubmit={this.handleSubmit}>
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
							<option>Femail</option>
						</Form.Control>
					</Form.Group>
					<Button
						variant='dark'
						disabled={
							!this.state.isChange ||
							this.state.password !== this.state.passwordConfirm
						}
						type='submit'
					>
						Save Change
					</Button>
				</Form>
			)
		}
 }


export default connect(null, { currentUser })(withRouter(UserSelfProfile))