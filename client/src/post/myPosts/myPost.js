import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Button, Alert, Spinner } from 'react-bootstrap'

import { Query } from 'react-apollo'
import { GET_ALL_POSTS, GET_CURRENT_USER_POSTS } from './../../queries/index'

import CardHeader from './../../shared/components/CardHeader'
import CardBody from './../../shared/components/CardBody'
import CardFooter from './../../shared/components/CardFooter'

import './myPost.style.scss'

class MyPost extends Component {
	handleNewPost = () => {
		this.props.history.push(`/${this.props.user._id}/new/post`)
	}

	render() {
		const { user } = this.props
		return (
			<div className='myposts'>
				{user.posts.length > 0 && (
					<div
						onClick={this.handleNewPost}
						className='myposts__stickyBtn'
						title='Click to create new post'
					>
						+
					</div>
				)}
				{user.posts.length === 0 ? (
					<React.Fragment>
						<h1> You are not add a post yet. </h1>
						<Button variant='primary' onClick={this.handleNewPost}>
							{' '}
							Add New Post{' '}
						</Button>
					</React.Fragment>
				) : (
					<Query
						query={GET_CURRENT_USER_POSTS}
						variables={{ _id: this.props.user._id }}
					>
						{/* when create new post the mypost page not show new post  */}
						{({ data, loading, error }) => {
							if (loading) {
								return <Spinner animation='border' />
							}
							return data.getCurrentUserPosts.map((post) => {
								return (
									<Card
										style={{ width: '50%' }}
										bg='dark'
										text='light'
										className='mb-2'
										key={post._id}
									>
										{error && <Alert variant='danger'> {error.message} </Alert>}
										<CardHeader
											showDropDowns={true}
											user={user}
											post={post}
										/>
										<CardBody post={post} />
										<CardFooter post={post} user={user} />
									</Card>
								)
							})
						}}
					</Query>
				)}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return { user: state.currentUser.currentUser }
}

export default connect(mapStateToProps)(MyPost)
