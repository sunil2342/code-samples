import { SAVE_VIEWS } from './viewsTypes'
import { createReducer } from '../../../../common/utils/reducerUtil';

const initialState = {
    saveViews: ''
};

export const saveView = (state, payload) => {
    return { ...state, latestVideos: payload }
};

export default createReducer(initialState, {
    [SAVE_VIEWS] : saveView,
});