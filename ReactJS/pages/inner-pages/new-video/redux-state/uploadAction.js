import { VIDEORESPONSE } from './uploadTypes';
import { toastr } from 'react-redux-toastr';
import { SPINNER, GET_ERRORS } from '../../../../../common/reducers/shared-reducers/types'
import { gpAxios } from '../../../../../common/utils/setAuthToken';

/**
 * @param data
 * @returns {Function}
 */
export const uploadVideo = (formData) => dispatch => {
            dispatch({
                type: SPINNER,
                payload: true
            });

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data; charset=utf-8;'
                }
            };
            gpAxios.post("/bucket/api/upload", formData, config).then((resp) => {
                dispatch({ type: SPINNER, payload: false });
                if(resp.data.exist) {
                    return toastr.warning('Oops!', 'Video Already Exist');
                }

                dispatch({ type: VIDEORESPONSE, payload: resp.data });
            }).catch(err => {
                if (err.response ===  undefined) {
                    //toastr.error('Server Failed !', 'Oops! Seems like server is down');
                    // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
                } else {
                    dispatch({ type: SPINNER, payload: false });
                    dispatch({ type: GET_ERRORS, payload: err.response.data });
                    toastr.error('Oops!', err.response.data);
                }
            });
};


/**
 * @param data
 * @returns {Function}
 */
export const saveVideo = (formData, history) => dispatch => {
    dispatch({
        type: SPINNER,
        payload: true
    });

    gpAxios.post("/bucket/api/save", formData).then((resp) => {
        dispatch({ type: SPINNER, payload: false });
        if(resp.data.status === true)
        {
            toastr.success('Success!', resp.data.message);
            history.push('/videos');
        }
        else{
            toastr.error('Oops!', resp.data.title);
        }
    }).catch(err => {
        if (err.response ===  undefined) {
            //toastr.error('Server Failed !', 'Oops! Seems like server is down');
            // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
        } else {
            dispatch({ type: SPINNER, payload: false });
            dispatch({ type: GET_ERRORS, payload: err.response.data })
            toastr.error('Oops!', err.response.data);
        }
    });
};


/**
 * @param data
 * @returns {Function}
 */
export const updateVideo = (formData,id, history) => dispatch => {
    dispatch({
        type: SPINNER,
        payload: true
    });

    gpAxios.post("/bucket/api/update/"+id, formData).then((resp) => {
        dispatch({ type: SPINNER, payload: false });
        if(resp.data.status === true)
        {
            toastr.success('Success!', resp.data.message);
        }
        else{
            toastr.error('Oops!', resp.data.title);
        }
        history.push('/videos');
    }).catch(err => {
        if (err.response ===  undefined) {
            //toastr.error('Server Failed !', 'Oops! Seems like server is down');
            // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
        } else {
            dispatch({ type: SPINNER, payload: false });
            dispatch({ type: GET_ERRORS, payload: err.response.data })
            toastr.error('Oops!', err.response.data);
        }
    });
};
