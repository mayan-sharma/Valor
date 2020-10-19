import { combineReducers } from 'redux';
import authReducer from "./authReducer";
import channelsReducer from "./channelsReducer";
import colorReducer from "./colorReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  channels: channelsReducer,
  colors: colorReducer
})

export default rootReducer;