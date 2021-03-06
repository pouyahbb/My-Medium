import {
	CURRENT_USER
} from './../actions/actionTypes'

const INITIALSTATE = {
	currentUser: null
}

const currentUserReducer = (state = INITIALSTATE, action) => {
	switch (action.type) {
		case CURRENT_USER:
			return {
				currentUser: action.payload,
			}
		default:
			return state
	}
}

export default currentUserReducer
