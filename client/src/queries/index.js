import { gql } from 'apollo-boost'

// Queries
export const GET_ALL_USERS = gql`
	{
		getAllUsers {
			_id
			name
			nickName
			email
			password
			passwordConfirm
			profileImage
			sexually
			followers
			followings
			posts {
				postId
				sharedUser
				image
				createdAt
				description
				likes
				comments {
					userId
					text
					createdAt
				}
			}
			joinDate
		}
	}
`

// Mutations

export const SIGN_UP = gql`
	mutation(
		$name: String!
		$nickName: String!
		$password: String!
		$passwordConfirm: String!
		$email: String!
		$profileImage: String
		$sexually: String
	) {
		signup(
			name: $name
			nickName: $nickName
			email: $email
			password: $password
			passwordConfirm: $passwordConfirm
			profileImage: $profileImage
			sexually: $sexually
		) {
			token
		}
	}
`


export const SIGNIN = gql`
	mutation($email: String!, $password: String!) {
		signin(email: $email, password: $password) {
			token
		}
	}
`
