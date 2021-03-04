import { type } from 'os'
import { CURRENT_USER } from './actionTypes'

export const currentUser = (user) => {
	return {
		type: CURRENT_USER,
		payload: user,
	}
}