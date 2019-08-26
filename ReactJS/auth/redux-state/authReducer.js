import {SET_CURRENT_PROFILE, SET_CURRENT_USER, SET_PUBLIC_SPINNER, SET_PUBLIC_USER} from "./types";
import isEmpty from '../../../common/validation/is-empty';

const initState = {
    isAuthenticated: false,
    user: {},
    publicProfile: "",
    currentProfile: "",
    publicProfileSpinner: false
};

export default function (state = initState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case SET_PUBLIC_USER:
            return {
                ...state,
                publicProfile: action.payload,
            };
        case SET_CURRENT_PROFILE:
            return {
                ...state,
                currentProfile: action.payload
            };
        case SET_PUBLIC_SPINNER:
            return {
                ...state,
                publicProfileSpinner: action.payload
            };
        default:
            return state;
    }

}