import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Button } from 'react-bootstrap'
import CardHeader from './../../shared/components/CardHeader'
import CardBody from './../../shared/components/CardBody'
import CardFooter from './../../shared/components/CardHeader'

import { Query } from 'react-apollo'
import { GET_USER_POSTS } from './../../queries/index'

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
						console.log(post)
						return (
							<Query
								query={GET_USER_POSTS}
								variables={{ _id: this.props.user._id }}
							>
								{({ data, loading, error }) => {
                  if(loading) {
                    return console.log('Loading...')
                  }
                  if(error){
                    return console.log(error.message)
                  }
                  let { getUserPosts } = data
                  console.log(data)
									return (
										<Card
											style={{ width: '50%' }}
											bg='dark'
											text='light'
											className='mb-2'
											key={getUserPosts._id}
										>
											<CardHeader
												showDropDowns={true}
												user={user}
												post={getUserPosts}
											/>
											<CardBody post={getUserPosts} />
											<CardFooter post={getUserPosts} user={user} />
										</Card>
									)
								}}
							</Query>
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
