import { MODAL_CLOSE, MODAL_OPEN  } from './modalTypes'
import { createReducer } from '../../../common/utils/reducerUtil'

const initialState = null;

export const openModal = (state, paylaod) => {
    const { modalType, modalProps } = paylaod;
    return { modalType, modalProps }
};

export const closeModal = (state, paylaod) => {
    return null
};

export default createReducer(initialState, {
    [MODAL_OPEN]: openModal,
    [MODAL_CLOSE]: closeModal
})