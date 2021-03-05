import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Image, Button, Card , Spinner } from 'react-bootstrap'

import { Query } from 'react-apollo'
import { GET_ALL_USERS } from './../../queries/index'


import CardHeader from './../../shared/components/CardHeader'
import CardFooter from './../../shared/components/CardFooter'
import CardBody from './../../shared/components/CardBody'

class UserNotSelfProfile extends Component {
  render() {
    const { user , users } = this.props
    console.log(user)
		return (
			<React.Fragment key={user._id}>
				<div className='profile__notUserSelf--header'>
					<div className='profile__notUserSelf--headerLeft'>
						<Image
							src={user.profileImage}
							alt={user.name}
							thumbnail
							roundedCircle
							style={{ width: '40%' }}
						/>
						<strong> {user.name} </strong>
					</div>
					<div className='profile__notUserSelf--headerRight'>
						<div className='profile__notUserSelf--headerRightTop'>
							<div className='profile__notUserSelf--data'>
								<strong>Followings </strong>
								<span> {user.followings.length}</span>
							</div>
							<div className='profile__notUserSelf--data'>
								<strong>Followers </strong>
								<span> {user.followers.length}</span>
							</div>
							<div className='profile__notUserSelf--data'>
								<strong>Posts </strong>
								<span> {user.posts.length}</span>
							</div>
						</div>
						<div className='profile__notUserSelf--btn'>
							{this.props.currentUser.followings.includes(user._id) ? (
								<Button variant='danger'> Unfollow </Button>
							) : (
								<Button variant='success'>Follow</Button>
							)}
						</div>
					</div>
				</div>
				<div className='profile__notUserSelf--posts'>
					{user.posts.map((post) => {
						return (
							<Card
								style={{ width: '50%' }}
								bg='dark'
								text='light'
								className='mb-2'
								key={post.postId}
							>
								<CardHeader users={users} user={user} post={post} showDropDowns={false} />
								<CardBody post={post} />
								<CardFooter users={users} post={post} user={user} />
							</Card>
						)
					})}
				</div>
			</React.Fragment>
		)
	}
}

const mapStateToProps = (state) => {
	return { currentUser: state.currentUser.currentUser }
}

export default connect(mapStateToProps)(UserNotSelfProfile)
