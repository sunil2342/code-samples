// import { SAVE_VIEWS } from './viewsTypes';
import { gpAxios } from '../../../../common/utils/setAuthToken';

/**
 * @param data
 * @returns {Function}
 */
export const saveView = (viewData) => dispatch => {
    gpAxios.post(`/api/views/save`, viewData).then((resp) => {

    }).catch(err => {
        if (err.response ===  undefined) {
            console.log(err);
            // toastr.error('Server Failed !', 'Oops! Seems like server is down');
            // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
        } else {
            // dispatch({ type: SPINNER, payload: false });
            // toastr.error('Error !', err.response.data)
            // dispatch({ type: GET_ERRORS, payload: err.response.data });
        }
    });
};

