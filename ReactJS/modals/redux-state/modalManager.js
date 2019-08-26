import React from "react";
import { connect } from "react-redux";
import LoginModal from "../loginModal";
import AuthorModal from "../authorModal";

const ModalManager = ({ currentModal }) => {
    let renderedModal;

    if (currentModal) {
        const ModalComponent = modalLookup[currentModal.modalType];
        renderedModal = <ModalComponent {...currentModal.modalProps} />;
    }
    return <span>{renderedModal}</span>;
};

const modalLookup = {
    LoginModal,
    AuthorModal
};

const mapState = state => ({
    currentModal: state.modal
});

export default connect(mapState)(ModalManager);