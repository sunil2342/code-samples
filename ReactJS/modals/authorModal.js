import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthorsModal from '../../common/material-components/m-modal/m-modal'

import { closeModal } from "./redux-state/modalActions";
import { loginUser, publicProfile } from '../auth/redux-state/authActions';
import Spinner from '../../common/utils/Spinner'

class AuthorModal extends Component {

    componentDidMount() {
        this.props.publicProfile(this.props.id);
    }

    static getDerivedStateFromProps(props, state) {
        return state;
    }

    closeModal = () => {
        this.props.closeModal();
    };

    render() {

        return (
            <div>
                <AuthorsModal closeModal={this.closeModal} publicProfile={this.props.auth} spinner={this.props.spinner} />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth.publicProfile,
    spinner: state.auth.publicProfileSpinner
});

export default connect(mapStateToProps, { loginUser, closeModal, publicProfile })(AuthorModal);