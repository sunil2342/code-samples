import { toastr } from 'react-redux-toastr';
import { gpAxios } from '../../../../../common/utils/setAuthToken';
import { GET_ERRORS, SPINNER } from "../../../../../common/reducers/shared-reducers/types";
import { GET_COMMENTS, COMMENT_SPINNER } from "./commentTypes";

/**
 * @param commentData
 * @returns {Function}
 */
export const saveComment = (commentData) => dispatch => {
    dispatch({ type: SPINNER, payload: true });
    gpAxios.post(`/api/comments/save`, commentData).then((resp) => {
        toastr.success('Success!', 'Question saved successfully');
        dispatch({ type: SPINNER, payload: false });
        dispatch(getComments(commentData.video_id, 1, true));
    }).catch(err => {
        if (err.response ===  undefined) {
            toastr.error('Server Failed !', 'Oops! Seems like server is down');
            // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
            dispatch({ type: SPINNER, payload: false });
        } else {
            dispatch({ type: SPINNER, payload: false });
            dispatch({ type: GET_ERRORS, payload: err.response.data });
        }
    });
};

/**
 * @param commentId
 * @returns {Function}
 */
export const getComments = (commentId, page, type) => dispatch => {
    dispatch({ type: COMMENT_SPINNER, payload: true });
    gpAxios.get(`/api/comments/${commentId}/${page}`).then((resp) => {
        dispatch({ type: COMMENT_SPINNER, payload: false });
        dispatch({ type: GET_COMMENTS, payload: { allComments: resp.data.allComments, remainCount: resp.data.remainCount, type:  type} })
    }).catch(err => {
        if (err.response ===  undefined) {
            toastr.error('Server Failed !', 'Oops! Seems like server is down');
            // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
            dispatch({ type: COMMENT_SPINNER, payload: false });
        } else {
            dispatch({ type: COMMENT_SPINNER, payload: false });
            dispatch({ type: GET_ERRORS, payload: err.response.data });
        }
    });
};

