import React, { Component } from 'react'
import {
	Form,
	Button,
	Container,
	Col,
	Image,
	Spinner,
	Alert,
} from 'react-bootstrap'
import { withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import defaultImage from './../../assets/images/postImage.jpg'

import { Mutation } from 'react-apollo'
import { CREATE_POST } from './../../queries/index'

import './createPost.style.scss'

class CreatePost extends Component {
	state = {
		image: defaultImage,
		description: '',
	}

	postImage = (event) => {
		if (event.target.files && event.target.files[0]) {
			let reader = new FileReader()
			reader.onload = (e) => {
				this.setState({ image: e.target.result })
			}
			reader.readAsDataURL(event.target.files[0])
		}
	}

	handleChange = (e) => {
		const { value, name } = e.target
		this.setState({ [name]: value })
	}

	handleSubmit = async (event, addPost) => {
		event.preventDefault()
		await addPost()
			.then(async ({ data }) => {
				console.log(data)				
				this.props.history.push(`/${this.props.user._id}/posts`)
			})
			.catch((err) => {
				throw new Error(err.message)
			})
	}

	render() {
		const { image, description } = this.state
		return (
			<Container>
				<Mutation
					mutation={CREATE_POST}
					variables={{ image, description, sharedUser: this.props.user._id }}
				>
					{(addPost, { data, loading, error }) => {
						return (
							<React.Fragment>
								<h1> Create post </h1>
								<Form
									onSubmit={(event) => this.handleSubmit(event, addPost)}
									className='createPost__form'
								>
									{error && (
										<Alert variant='danger'>
											{error.message.split(':')[1]}
										</Alert>
									)}
									<Form.Row style={{ alignItems: 'center' }}>
										<Form.Group as={Col} style={{ marginTop: '2rem' }}>
											<Form.File
												className='position-relative'
												name='profileImage'
												label='Your Post Image'
												onChange={this.postImage}
												id='validationFormik107'
												feedbackTooltip
											/>
										</Form.Group>
										<Form.Group as={Col}>
											<Image
												style={{ width: '30%', marginTop: '2rem' }}
												src={image}
												alt={this.state.description}
												roundedCircle
											/>
										</Form.Group>
									</Form.Row>
									<Form.Group controlId='description'>
										<Form.Label>Description</Form.Label>
										<Form.Control
											value={description}
											name='description'
											as='textarea'
											rows={3}
											onChange={this.handleChange}
										/>
									</Form.Group>
									<Button
										disabled={loading ? true : false}
										variant='dark'
										type='submit'
									>
										{loading ? <Spinner animation='border' /> : 'Create'}
									</Button>
								</Form>
							</React.Fragment>
						)
					}}
				</Mutation>
			</Container>
		)
	}
}

const mapStateToProps = (state) => {
	return { user: state.currentUser.currentUser }
}

export default connect(mapStateToProps )(withRouter(CreatePost))
