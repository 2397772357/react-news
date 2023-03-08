import {combineReducers, legacy_createStore as createStore} from 'redux'
import {CollapsedReducer} from "./reducers/CollapsedReducer.js"

const  reducer = combineReducers({
    CollapsedReducer
})
const store = createStore(reducer)

export default store