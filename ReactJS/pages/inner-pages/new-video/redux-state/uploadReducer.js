import { VIDEORESPONSE } from './uploadTypes'
import { createReducer } from '../../../../../common/utils/reducerUtil'

const initialState = {
    videoEtag: "",
    videoUrl: "",
};

export const videoResponse = (state, payload) => {
    return { ...state, videoEtag: payload.ETag, videoUrl: payload.Location }
};

export default createReducer(initialState, {
    [VIDEORESPONSE]: videoResponse,
});