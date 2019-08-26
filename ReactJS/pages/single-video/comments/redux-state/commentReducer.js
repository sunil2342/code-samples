import { GET_COMMENTS, COMMENT_SPINNER } from './commentTypes'
import { createReducer } from '../../../../../common/utils/reducerUtil';

const initialState = {
    comments: [],
    commentSpinner: false,
    remainCount: ""
};

export const getComments = (state, payload) => {

    return {
        ...state,
        comments: payload.type === true ? payload.allComments : state.comments.concat(payload.allComments),
        remainCount: payload.remainCount
    }
};

export const commentSpinner = (state, payload) => {
    return { ...state, commentSpinner: payload }
};

export default createReducer(initialState, {
    [GET_COMMENTS]      : getComments,
    [COMMENT_SPINNER]   : commentSpinner,
});