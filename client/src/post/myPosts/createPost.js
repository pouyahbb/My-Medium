import React, { Component } from 'react'
import { Form, Button, Container, Col, Image } from 'react-bootstrap'
import defaultImage from './../../assets/images/postImage.jpg'

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

	render() {
		return (
			<Container>
				<h1> Create post </h1>
				<Form className="createPost__form">
					<Form.Row style={{ alignItems: 'center'}} >
						<Form.Group as={Col} style={{ marginTop: '2rem' }}>
							<Form.File
								className='position-relative'
								name='profileImage'
								label='Your Profile Image'
								onChange={this.postImage}
								id='validationFormik107'
								feedbackTooltip
							/>
						</Form.Group>
						<Form.Group as={Col}>
							<Image
								style={{ width: '30%', marginTop: '2rem' }}
								src={this.state.image}
								alt='POST IMAGE'
								roundedCircle
							/>
						</Form.Group>
					</Form.Row>
					<Form.Group controlId='description'>
						<Form.Label>Description</Form.Label>
						<Form.Control
							value={this.state.description}
							name='description'
							as='textarea'
							rows={3}
							onChange={this.handleChange}
						/>
					</Form.Group>
					<Button
						// disabled={loading ? true : false}
						variant='dark'
						type='submit'
					>
						{/* {loading ? <Spinner animation='border' /> : 'Signup'} */}
						Create
					</Button>
				</Form>
			</Container>
		)
	}
}

export default CreatePost
