import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Button } from 'react-bootstrap'
import CardHeader from './../../shared/components/CardHeader'
import CardBody from './../../shared/components/CardBody'
import CardFooter from './../../shared/components/CardFooter'

import './myPost.style.scss'

class MyPost extends Component {
	render() {
		const { user } = this.props
		return (
			<div className='myposts'>
				{user.posts.length === 0 ? (
					<React.Fragment>
						<h1> You are not add a post yet. </h1>
						<Button variant='primary'> Add New Post </Button>
					</React.Fragment>
				) : (
					user.posts.map((post) => {
						return (
							<Card
								style={{ width: '50%' }}
								bg='dark'
								text='light'
								className='mb-2'
								key={post._id}
							>
								<CardHeader showDropDowns={true} user={user} post={post} />
								<CardBody post={post} />
								<CardFooter post={post} user={user} />
							</Card>
						)
					})
				)}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return { user: state.currentUser.currentUser }
}

export default connect(mapStateToProps)(MyPost)
