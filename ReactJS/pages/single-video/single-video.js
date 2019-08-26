import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import publicIp from 'public-ip';
import PropTypes from 'prop-types';

// TODO: Actions
import { singleVideo, allVideos } from '../inner-pages/videos/redux-state/videosAction';
import { saveView } from './redux-state/viewsAction';
import { getComments } from './comments/redux-state/commentAction';
import { openModal } from '../../modals/redux-state/modalActions';

// TODO: Comonents
import AllVideos from './all-videos/all-videos';
import AboutVideo from "./about-video/about-video";
import Comment from "./comments/comments";

import Spinner from '../../../common/utils/Spinner';

class SingleVideo extends Component {
    state = {
        videoUrl: "",
        allVideos: [],
        video: "",
        noOfView: "",
        page: 1,
        commentPage: 1,
        remainCount: ""
    };

    componentDidMount() {
        this.props.singleVideo(this.props.match.params.id, this.props.history);
        this.props.allVideos(this.state.page, true);
        this.props.getComments(this.props.match.params.id, 1, true);
        publicIp.v4().then(response => {
            const videoAndIpData = {
                videoId: this.props.match.params.id,
                currentIp: response
            };
            this.props.saveView(videoAndIpData);
        });
    }

    playFromList = (id) => {
        this.props.history.push('/video/' + id);
        this.props.singleVideo(id);
        this.props.getComments(id, 1, true);

        // TODO: Saving video views
        publicIp.v4().then(response => {
            const videoAndIpData = {
                videoId: id,
                currentIp: response
            };
            this.props.saveView(videoAndIpData);
        });
    };

    loadMore = () => {
        this.setState({
            page: this.state.page += 1
        });
        this.props.allVideos(this.state.page, false);
    };

    loadMoreComments = (id) => {
        this.setState({
            commentPage: this.state.commentPage += 1
        });
        this.props.getComments(id, this.state.commentPage, false);
    };

    aboutAuthor = (id) => {
        this.props.openModal('AuthorModal', {id: id});
    };

    render() {
        const { spinner } = this.props;
        return(
            <React.Fragment>
                <section id="breadcrumb">
                    <div className="row">
                        <div className="large-12 columns">
                            {/*<nav>
                                <ul className="breadcrumbs">
                                    <li><i className="fa fa-home"></i><a href="home-v1.html">Home</a></li>
                                    <li><a href=" ">video</a></li>
                                    <li className="disabled">{this.props.video !== undefined ? this.props.video.title : ""}</li>
                                </ul>
                            </nav>*/}
                        </div>
                    </div>
                </section>

                {/*<section className="fullwidth-single-video" style={{marginTop: '20px'}}>
                    <div className="row">
                        <div className="large-8 columns">
                            <div className="flex-video widescreen ldVideo" style={{position: 'relative'}}>
                                {spinner ? <Spinner color="primary" /> : (
                                    <video width="400" controls src={this.props.video.videoUrl} poster="" controlsList="nodownload">
                                        Your browser does not support HTML5 video.
                                    </video>
                                )}
                            </div>
                        </div>
                    </div>
                </section>*/}

                <div className="row single-video-container">
                    <div className="large-8 columns">

                        <div className="flex-video widescreen ldVideo" style={{position: 'relative'}}>
                            {spinner ? <Spinner color="primary" /> : (
                                <video width="400" controls src={this.props.video.videoUrl} poster="" controlsList="nodownload">
                                    Your browser does not support HTML5 video.
                                </video>
                            )}
                        </div>

                        {/* About Video */}
                        <AboutVideo
                            props={this.props.video}
                            noOfViews={this.props.noOfViews}
                            authorModal={this.aboutAuthor}
                            comments={this.props.myComments}
                        />

                        {/* Comment Section */}
                        <Comment
                            video={this.props.video._id}
                            comments={this.props.myComments}
                            spinner={this.props.spinner}
                            commentsSpinner={this.props.commentSpinner}
                            loadMoreComments={this.loadMoreComments}
                            remainCount={this.props.remainCommentCount}
                        />

                    </div>

                    <AllVideos props={this.props.videos.allVideos} loadMore={this.loadMore} playFromList={this.playFromList} remainCount={this.props.remainCount} />
                </div>

            </React.Fragment>
        )
    }
}

SingleVideo.propTypes = {
    singleVideo: PropTypes.func.isRequired,
    allVideos: PropTypes.func.isRequired,
    saveView: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    video: state.videos.singleVideo,
    noOfViews: state.videos.noOfViews,
    videos: state.videos,
    spinner: state.spinner.spinner,
    remainCount: state.videos.remainCount,
    myComments: state.comments.comments,
    commentSpinner: state.comments.commentSpinner,
    remainCommentCount: state.comments.remainCount
});


export default connect(mapStateToProps, { singleVideo, allVideos, saveView, getComments, openModal })(withRouter(SingleVideo));