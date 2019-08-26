import {
    LATEST_VIDEOS,
    ALL_VIDEOS,
    SINGLE_VIDEO,
    ALL_VIDEOS_COUNT,
    MY_VIDEOS,
    MY_VIDEOS_COUNT,
    DELETE_MY_VIDEOS
} from './videosTypes'
import { createReducer } from '../../../../../common/utils/reducerUtil'

const initialState = {
    latestVideos: [],
    allVideos: [],
    myVideos: [],
    singleVideo: '',
    allVideosCount: '',
    myVideosCount: '',
    totalCount: "",
    remainCount: "",
    noOfViews: 0
};

export const latestVideos = (state, payload) => {
    return { ...state, latestVideos: payload }
};

export const singleVideo = (state, payload) => {
    return { ...state, singleVideo: payload.videoData, noOfViews: payload.numberOfViews }
};


export const allVideos = (state, payload) => {
    return {
        ...state,
        allVideos: payload.reqType === true ? payload.data.allVid : state.allVideos.concat(payload.data.allVid),
        totalCount: payload.data.totalCount,
        remainCount: payload.data.remainCount,
    }
};

export const allVideosCount = (state, payload) => {
    return { ...state, allVideosCount: payload }
};

export const myVideos = (state, payload) => {
    return { ...state, myVideos: payload }
};


export const myVideosCount = (state, payload) => {
    return { ...state, myVideosCount: payload }
};

export const deleteMyVideos = (state, payload) => {
    return { ...state, myVideos: state.myVideos.filter((video) => video.id !== payload) }
};

export default createReducer(initialState, {
    [LATEST_VIDEOS]     : latestVideos,
    [SINGLE_VIDEO]      : singleVideo,
    [ALL_VIDEOS]        : allVideos,
    [ALL_VIDEOS_COUNT]  : allVideosCount,
    [MY_VIDEOS]         : myVideos,
    [MY_VIDEOS_COUNT]   : myVideosCount,
    [DELETE_MY_VIDEOS]  : deleteMyVideos,
});