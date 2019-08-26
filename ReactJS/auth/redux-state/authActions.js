import { gpAxios } from '../../../common/utils/setAuthToken';
import jwtDecode from 'jwt-decode';
import {SET_CURRENT_USER, SET_PUBLIC_USER, SET_CURRENT_PROFILE, SET_PUBLIC_SPINNER} from "./types";
import { GET_ERRORS } from "../../../common/reducers/shared-reducers/types";
import { SPINNER } from "../../../common/reducers/shared-reducers/types";
import setAuthToken from '../../../common/utils/setAuthToken';
import {toastr} from "react-redux-toastr";
import { closeModal } from '../../../components/modals/redux-state/modalActions';

// Register User
export const registerUser = (userData, history) => dispatch => {

    dispatch({type: SPINNER, payload: true});

    gpAxios.post('/api/users/register', userData)
        .then(response => {
            dispatch({type: SPINNER, payload: false});
            toastr.success('Yeah!', 'Registration successful');
            history.push('/auth/login')
        })
        .catch(err => {
            if (err.response ===  undefined) {
                toastr.error('Server Failed !', 'Oops! Seems like server is down');
                // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
            } else {
                dispatch({type: SPINNER, payload: false});
                dispatch({ type: GET_ERRORS, payload: err.response.data })
            }
        });
}

// Login User
export const loginUser = (userData, history, type) => dispatch => {

    dispatch({type: SPINNER, payload: true});

    gpAxios.post('/api/users/login', userData)
        .then(response => {
            dispatch({type: SPINNER, payload: false});
            // Save token to localStorage
            const { token } = response.data;
            // Set token
            localStorage.setItem('jwtToken', token);
            // Set token Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwtDecode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
            if (type === 'regular') {
                history.replace('/me');
            } else {
                dispatch(closeModal());
                dispatch({type: GET_ERRORS, payload: ''});
            }

        })
        .catch(err => {
            if (err.response ===  undefined) {
                toastr.error('Server Failed !', 'Oops! Seems like server is down');
                dispatch({type: SPINNER, payload: false});
                // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
            } else {
                dispatch({type: SPINNER, payload: false});
                dispatch({type: GET_ERRORS, payload: err.response.data})
            }
        });
};

// Login User With Social Network
export const loginWithSocialNetwork = (socialData, history, type) => dispatch => {
    dispatch({type: SPINNER, payload: true});
    let url = "";
    if(type === "facebook" || type === "facebookModal") {
        url = '/api/users/social/login';
    }

    if (type === "linkedIn" || type === "linkedInModal") {
        url = '/api/users/social/linkedin';
    }

    gpAxios.post(url, socialData)
        .then(response => {
            dispatch({type: SPINNER, payload: false});
            // Save token to localStorage
            const { token } = response.data;
            // Set token
            localStorage.setItem('jwtToken', token);
            // Set token Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwtDecode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
            if (type === "linkedInModal" || type === "facebookModal") {
                dispatch(closeModal());
                dispatch({type: GET_ERRORS, payload: ''});
                //dispatch(setError());
            } else {
                history.replace('/me');
            }

        })
        .catch(err => {
            console.log(err);
            if (err.response ===  undefined) {
                toastr.error('Server Failed !', 'Oops! Seems like server is down');
                // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
            } else {
                console.log(err.response)
                // dispatch({type: SPINNER, payload: false});
                // dispatch({ type: GET_ERRORS, payload: err.response.data })
            }
        });
};

// Forgot User password
export const forgotPassword = (userData, history, type) => dispatch => {

    dispatch({type: SPINNER, payload: true});

    gpAxios.post('/api/users/forgotPassword', userData)
        .then(response => {
            dispatch({type: SPINNER, payload: false});
            console.log(response);
            toastr.success('Yeah!', 'Reset mail sent Successfully');
            history.push('/auth/login');
        })
        .catch(err => {
            if (err.response ===  undefined) {
                toastr.error('Server Failed !', 'Oops! Seems like server is down');
                dispatch({type: SPINNER, payload: false});
                // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
            } else {
                dispatch({type: SPINNER, payload: false});
                dispatch({type: GET_ERRORS, payload: err.response.data})
            }
        });


};

// Check email Hash
export const checkHash = (userData, history, type) => dispatch => {

    dispatch({type: SPINNER, payload: true});

    gpAxios.post('/api/users/checkEmailHash', userData)
        .then(response => {
            dispatch({type: SPINNER, payload: false});
            dispatch(setPublicUser(response.data.user));
            /*// Save token to localStorage
            const { token } = response.data;
            // Set token
            localStorage.setItem('jwtToken', token);
            // Set token Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwtDecode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
            if (type === 'regular') {
                history.replace('/me');
            } else {
                dispatch(closeModal());
                dispatch({type: GET_ERRORS, payload: ''});
            }*/

        })
        .catch(err => {
            if (err.response ===  undefined) {
                toastr.error('Server Failed !', 'Oops! Seems like server is down');
                dispatch({type: SPINNER, payload: false});
                // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
            } else {
                dispatch({type: SPINNER, payload: false});
                dispatch({type: GET_ERRORS, payload: err.response.data})
            }
        });


};

// Reset User Password
export const resetPassword = (passwordData, history) => dispatch => {

    dispatch({type: SPINNER, payload: true});

    gpAxios.post('/api/users/reset/password', passwordData)
        .then(response => {
            dispatch({type: SPINNER, payload: false});
            toastr.success('Yeah!', 'Password updated successfully');
            history.push('/auth/login');
        })
        .catch(err => {
            if (err.response ===  undefined) {
                toastr.error('Server Failed !', 'Oops! Seems like server is down');
                dispatch({type: SPINNER, payload: false});
                // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });

            } else {
                dispatch({type: SPINNER, payload: false});
                dispatch({ type: GET_ERRORS, payload: err.response.data })
                //toastr.error('Opps!', 'Something went wrong');
            }
        });
};

// Public profile of user
export const publicProfile = (id) => dispatch => {

    dispatch({type: SET_PUBLIC_SPINNER, payload: true });
    gpAxios.get(`/api/profile/public_profile/${id}`)
        .then(response => {
            dispatch({type: SET_PUBLIC_SPINNER, payload: false });
            dispatch({type: SET_PUBLIC_USER, payload: response.data});
        })
        .catch(err => {
            if (err.response ===  undefined) {
                toastr.error('Server Failed !', 'Oops! Seems like server is down');
                // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
            } else {
                dispatch({type: SET_PUBLIC_SPINNER, payload: false });
                dispatch({ type: GET_ERRORS, payload: err.response.data })
            }
        });
};

// Public profile of user
export const currentProfile = (id) => dispatch => {

    dispatch({type: SPINNER, payload: true});
    gpAxios.get(`/api/profile/current_profile`)
        .then(response => {
            dispatch({type: SPINNER, payload: false});
            dispatch({type: SET_CURRENT_PROFILE, payload: response.data});
        })
        .catch(err => {
            if (err.response ===  undefined) {
                toastr.error('Server Failed !', 'Oops! Seems like server is down');
                // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });
            } else {
                dispatch({type: SPINNER, payload: false});
                dispatch({ type: GET_ERRORS, payload: err.response.data })
            }
        });
};

// Update User Password
export const updatePassword = (passwordData) => dispatch => {

    dispatch({type: SPINNER, payload: true});

    gpAxios.post('/api/users/update/password', passwordData)
        .then(response => {
            dispatch({type: SPINNER, payload: false});
            toastr.success('Yeah!', 'Password changed successfully');
        })
        .catch(err => {
            if (err.response ===  undefined) {
                toastr.error('Server Failed !', 'Oops! Seems like server is down');
                dispatch({type: SPINNER, payload: false});
                // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });

            } else {
                dispatch({type: SPINNER, payload: false});
                toastr.error('Opps!', 'Something went wrong');
            }
        });
};

// Update User Password
export const updateGeneral = (generalData) => dispatch => {

    dispatch({type: SPINNER, payload: true});

    gpAxios.post('/api/users/update', generalData)
        .then(response => {
            dispatch({type: SPINNER, payload: false});
            // Save token to localStorage
            const { token } = response.data;
            // Set token
            localStorage.setItem('jwtToken', token);
            // Set token Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwtDecode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
            toastr.success('Yeah!', 'Updated successfully');
        })
        .catch(err => {
            if (err.response ===  undefined) {
                toastr.error('Server Failed !', 'Oops! Seems like server is down');
                dispatch({type: SPINNER, payload: false});
                // dispatch({ type: GET_ERRORS, payload: "Oops! Seems like server is down" });

            } else {
                dispatch({type: SPINNER, payload: false});
                toastr.error('Opps!', 'Something went wrong');
            }
        });
};

// Update User Password
export const updateProfile = (profileData) => dispatch => {

    dispatch({type: SPINNER, payload: true});

    gpAxios.post('/api/profile', profileData)
        .then(response => {
            dispatch({type: SPINNER, payload: false});
            toastr.success('Yeah!', 'Updated successfully');
        })
        .catch(err => {
            if (err.response ===  undefined) {
                toastr.error('Server Failed !', 'Oops! Seems like server is down');
                dispatch({type: SPINNER, payload: false});
            } else {
                dispatch({type: SPINNER, payload: false});
                toastr.error('Opps!', 'Something went wrong');
            }
        });
};

// Set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
};

// Set logged in user
export const setPublicUser = (decoded) => {
    return {
        type: SET_PUBLIC_USER,
        payload: decoded
    }
};

// Log user out
export const logoutUser = () => dispatch => {
    // Remove the token localStorage
    localStorage.removeItem('jwtToken');
    // Remove auth header for future requets
    setAuthToken(false);
    // Set current user to {} which also set the isAuthenticated to false
    dispatch(setCurrentUser({}));
}

// Set error null
export const setError = () => {
    return {
        type: GET_ERRORS,
        payload: ""
    }
};