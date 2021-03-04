import { combineReducers } from 'redux'

import currentUserReducer from './userReducer'

const rootReducer = combineReducers({
	currentUser: currentUserReducer,
})

export default rootReducer
