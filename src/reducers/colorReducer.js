import { SET_COLORS } from "../actions/types";

const initialState = {
  primaryColor: '#192a45',
  secondaryColor: '#eee'
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_COLORS:
      return {
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor
      }

    default:
      return state;
  }
}