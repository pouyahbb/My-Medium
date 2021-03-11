import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Card, Button , Spinner , Alert } from 'react-bootstrap'

import { Query } from 'react-apollo'
import { GET_ALL_USERS } from './queries/index'

import CardHeader from './shared/components/CardHeader'
import CardBody from './shared/components/CardBody'
import CardFooter from './shared/components/CardFooter'

import './mainPage.style.scss'

class MainPage extends Component {
	handleClick = () => {
		this.props.history.push('/suggest')
	}

	render() {
		const { user } = this.props
		return (
			<div className='mainPage'>
				{user.followings.length === 0 ? (
					<React.Fragment>
						<h1> You not following anybody yet. </h1>
						<Button onClick={this.handleClick} variant='primary'>
							Suggest me people i might want to follow them
						</Button>
					</React.Fragment>
				) : (
					<Query query={GET_ALL_USERS}>
						{({ data, loading, error }) => {
							if (loading) {
								return <Spinner animation='border' />
							}
							if (error) {
								return <Alert variant='danger'> {error.message} </Alert>
							}
							return user.followings.map((flw) => {
								return data.getAllUsers
									.filter((usr) => {
										return usr._id === flw
									})
									.map((usr) => {
										return usr.posts.map((post) => {
											return (
												<Card
													style={{ width: '50%' }}
													bg='dark'
													text='light'
													className='mb-2'
													key={post.postId}
												>
													<CardHeader
														showDropDowns={true}
														post={post}
														user={usr}
													/>
													<CardBody post={post} />
													<CardFooter post={post} user={user} />
												</Card>
											)
										})
									})
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

export default connect(mapStateToProps)(withRouter(MainPage))
