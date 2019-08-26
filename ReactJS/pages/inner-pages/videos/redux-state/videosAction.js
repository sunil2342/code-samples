import {LATEST_VIDEOS, ALL_VIDEOS, SINGLE_VIDEO, ALL_VIDEOS_COUNT, MY_VIDEOS, MY_VIDEOS_COUNT} from './videosTypes';
import { SPINNER } from '../../../../../common/reducers/shared-reducers/types'
import { gpAxios } from '../../../../../common/utils/setAuthToken';
import { toastr } from 'react-redux-toastr';
import { logoutUser } from '../../../../auth/redux-state/authActions'


/**
 * @param data
 * @returns {Function}
 */
export const lastestVideo = () => dispatch => {
    dispatch({ type: SPINNER, payload: true });
    gpAxios.get("/bucket/api/latest").then((resp) => {
        dispatch({ type: SPINNER, payload: false });
        dispatch({ type: LATEST_VIDEOS, payload: resp.data });
    }).catch(err => {
        if (err.response ===  undefined) {
            dispatch({ type: SPINNER, payload: false });
            toastr.error('Server Failed !', 'Oops! Seems like server is down');
            dispatch(logoutUser());
            // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
        } else {
            dispatch({ type: SPINNER, payload: false });
            toastr.error('Error !', err.response.data)
            // dispatch({ type: GET_ERRORS, payload: err.response.data });
        }
    });
};

/**
 * @param data
 * @returns {Function}
 */
export const allVideos = (pageNo, requestType) => dispatch => {
    gpAxios.get(`/bucket/api/all/${pageNo}`).then((resp) => {
        dispatch({ type: ALL_VIDEOS, payload: { data: resp.data, reqType: requestType } });
    }).catch(err => {
        if (err.response ===  undefined) {
            toastr.error('Server Failed !', 'Oops! Seems like server is down');
            //dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
            dispatch(logoutUser());
        } else {
            toastr.error('Error !', err.response.data)
            // dispatch({ type: GET_ERRORS, payload: err.response.data });
        }
    });
};

/**
 * @param data
 * @returns {Function}
 */
export const allCount = () => dispatch => {
    gpAxios.get("/bucket/api/allcount").then((resp) => {
        dispatch({ type: ALL_VIDEOS_COUNT, payload: resp.data });
    }).catch(err => {
        if (err.response ===  undefined) {
            toastr.error('Server Failed !', 'Oops! Seems like server is down');
            dispatch(logoutUser());
            //dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
        } else {
            toastr.error('Error !', err.response.data)
            // dispatch({ type: GET_ERRORS, payload: err.response.data });
        }
    });
};

/**
 * @param data
 * @returns {Function}
 */
export const singleVideo = (videoId) => dispatch => {

    dispatch({ type: SPINNER, payload: true });

    gpAxios.get(`/bucket/api/video/${videoId}`).then((resp) => {
        dispatch({ type: SPINNER, payload: false });
        dispatch({ type: SINGLE_VIDEO, payload: { videoData: resp.data.videoData, numberOfViews: resp.data.noOfViews } });
    }).catch(err => {
        if (err.response ===  undefined) {
            //toastr.error('Server Failed !', 'Oops! Seems like server is down');
            // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
        } else {
            dispatch({ type: SPINNER, payload: false });
            toastr.error('Error !', err.response.data)
            // dispatch({ type: GET_ERRORS, payload: err.response.data });
        }
    });
};

/**
 * @param data
 * @returns {Function}
 */
export const currentVideosCount = (userId) => dispatch => {
    gpAxios.get(`/api/users/current/videos/count/${userId}`).then((resp) => {
        dispatch({ type: MY_VIDEOS_COUNT, payload: resp.data });
    }).catch(err => {
        if (err.response ===  undefined) {
            toastr.error('Server Failed !', 'Oops! Seems like server is down');
            dispatch(logoutUser());
            //dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
        } else {
            toastr.error('Error !', err.response.data)
            // dispatch({ type: GET_ERRORS, payload: err.response.data });
        }
    });
};

/**
 * @param data
 * @returns {Function}
 */
export const myVideosCount = (userId) => dispatch => {
    gpAxios.get(`/api/users/current/videos/count/${userId}`).then((resp) => {
        dispatch({ type: MY_VIDEOS_COUNT, payload: resp.data });
    }).catch(err => {
        if (err.response ===  undefined) {
            toastr.error('Server Failed !', 'Oops! Seems like server is down');
            //dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
            dispatch(logoutUser());
        } else {
            toastr.error('Error !', err.response.data)
            // dispatch({ type: GET_ERRORS, payload: err.response.data });
        }
    });
};

/**
 * @param data
 * @returns {Function}
 */
export const myVideos = (userId) => dispatch => {
    gpAxios.get(`/api/users/current/videos/${userId}`).then((resp) => {
        dispatch({ type: MY_VIDEOS, payload: resp.data });
    }).catch(err => {
        if (err.response ===  undefined) {
            toastr.error('Server Failed !', 'Oops! Seems like server is down');
            //dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
            dispatch(logoutUser());
        } else {
            toastr.error('Error !', err.response.data)
            // dispatch({ type: GET_ERRORS, payload: err.response.data });
        }
    });
};

/**
 * @param data
 * @returns {Function}
 */
export const deleteMyVideos = (videoId) => dispatch => {
    gpAxios.get(`/api/users/current/videos/delete/${videoId}`).then((resp) => {
        dispatch({ type: MY_VIDEOS, payload: videoId });
    }).catch(err => {
        if (err.response ===  undefined) {
            toastr.error('Server Failed !', 'Oops! Seems like server is down');
            //dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
            // dispatch(logoutUser());
        } else {
            toastr.error('Error !', err.response.data)
            // dispatch({ type: GET_ERRORS, payload: err.response.data });
        }
    });
};

