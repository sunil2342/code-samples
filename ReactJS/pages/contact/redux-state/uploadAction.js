import { VIDEORESPONSE } from './uploadTypes';
import { toastr } from 'react-redux-toastr';
import { SPINNER, GET_ERRORS } from '../../../../common/reducers/shared-reducers/types'
import { gpAxios } from '../../../../common/utils/setAuthToken';

/**
 * @param data
 * @returns {Function}
 */
export const saveContact = (formData, history) => dispatch => {
    dispatch({
        type: SPINNER,
        payload: true
    });

    gpAxios.post("/api/contact", formData).then((resp) => {
        dispatch({ type: SPINNER, payload: false });
        toastr.success('Success!', 'Request submitted successfully!!');
    }).catch(err => {
        console.log(err.response);
        if (err.response ===  undefined) {
            toastr.error('Server Failed !', 'Oops! Seems like server is down');
            // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
        } else {
            dispatch({ type: SPINNER, payload: false });
            dispatch({ type: GET_ERRORS, payload: err.response.data });
            toastr.error('Oops!', 'Invalid request !!');
        }
    });
};

