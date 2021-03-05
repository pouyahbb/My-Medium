import React, { Component } from 'react'
import { Card, Image, Dropdown } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'


class CardHeader extends Component {
  render() {
		return (
			<Card.Header
				style={{
					borderBottom: '1px solid #eaeaea',
					marginBottom: '1rem',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-around',
				}}
			>
				<div className='mainage__header--leftSide'>
					<Image
						onClick={() => {
							this.props.history.push(
								`/${this.props.user._id}/post/${this.props.post.postId}`
							)
						}}
						src={this.props.user.profileImage}
						thumbnail
						roundedCircle
						style={{ width: '20%', cursor: 'pointer' }}
					/>
          {
            console.log(this.props.users)
          }
				

					{/* {UserData.filter((usr) => {
						return usr.id === this.props.post.sharedUser
					}).map((shared) => {
						return <strong key={shared.id}> {shared.name} </strong>
					})} */}
				</div>
				<div className='mainPage__header--rightSide'>
					<span> {this.props.post.createdAt} </span>
					{this.props.post.sharedUser === this.props.currentUser._id &&
					this.props.showDropDowns === true ? (
						<div className='mainPage__header--postInfo'>
							<Dropdown>
								<Dropdown.Toggle variant='primary' id='dropdown-basic' />
								<Dropdown.Menu>
									<Dropdown.Item>Delete Post</Dropdown.Item>
									<Dropdown.Item>Edit Post</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					) : this.props.post.sharedUser !== this.props.currentUser._id &&
					  this.props.showDropDowns === true ? (
						<div className='mainPage__header--postInfo'>
							<Dropdown>
								<Dropdown.Toggle variant='primary' id='dropdown-basic' />
								<Dropdown.Menu>
									<Dropdown.Item>Unfollow User</Dropdown.Item>
									<Dropdown.Item>User Profile</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					) : null}
				</div>
			</Card.Header>
		)
	}
}
const mapStateToProps = (state) => {
	return { currentUser: state.currentUser.currentUser }
}

export default connect(mapStateToProps)(withRouter(CardHeader))
