import React, { Component } from 'react';
import { connect } from 'react-redux';
import Sidebar from "../shared-pages/sidebar";

import { myVideos, deleteMyVideos } from './redux-state/videosAction'
import {NavLink} from "react-router-dom";
import publicIp from "public-ip";

class Videos extends Component {

    state = {
        allMyVideos: []
    }

    componentDidMount() {
        this.props.myVideos(this.props.auth.user.id);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.videos);
        if(nextProps.videos !== "" || nextProps.videos !== undefined) {
            this.setState({ allMyVideos: nextProps.videos })
        }
    }

    playFromList = (id) => {
        this.props.history.push('/video/' + id);
        this.props.singleVideo(id);

        // TODO: Saving video views
        publicIp.v4().then(response => {
            const videoAndIpData = {
                videoId: id,
                currentIp: response
            }
            // console.log(videoAndIpData);
            this.props.saveView(videoAndIpData);
        });
    }

    deleteVideo = (id) => {
        this.props.deleteMyVideos(id);
    };

    editVideo = (id) => {
        this.props.history.push('/edit-video/' + id);
    };

    render() {

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        return(
            <React.Fragment>
                <section id="breadcrumb">
                    <div className="row">
                        <div className="large-12 columns">
                            {/*<nav aria-label="You are here:">
                                <ul className="breadcrumbs">
                                    <li><i className="fa fa-home"></i><a href=" ">Home</a></li>
                                    <li><a href=" ">profile</a></li>
                                    <li>
                                        <span className="show-for-sr">Current: </span> submit post
                                    </li>
                                </ul>
                            </nav>*/}
                        </div>
                    </div>
                </section>

                <div className="row" style={{marginTop: "30px"}}>

                    <div className="large-4 columns">
                        <aside className="secBg sidebar">
                            <div className="row">
                                <Sidebar/>
                            </div>
                        </aside>
                    </div>
                    <div className="large-8 columns profile-inner">
                        <section className="profile-videos">
                            <div className="row secBg">
                                <div className="large-12 columns">
                                    <div className="heading">
                                        <i className="fa fa-video-camera"></i>
                                        <h4>My Videos</h4>
                                    </div>
                                    {this.props.videos.length > 0 ? this.state.allMyVideos.map((video, index) => {
                                        const date = new Date(video.createdAt);
                                        return (
                                            <div key={index} className="profile-video">
                                                <div className="media-object stack-for-small">
                                                    <div className="media-object-section media-img-content">
                                                        <div className="recent-img">
                                                            <video width="400" src={video.videoUrl} controlsList="nodownload">
                                                                Your browser does not support HTML5 video.
                                                            </video>
                                                        </div>
                                                    </div>
                                                    <div className="media-object-section media-video-content">
                                                        <div className="video-content">
                                                            <h5><NavLink to={`/video/${video._id}`}
                                                                         onClick={() => this.playFromList(video._id)}>{video.title}</NavLink>
                                                            </h5>
                                                            <p>{video.description}</p>
                                                        </div>
                                                        <div className="video-detail clearfix">
                                                            <div className="video-stats">
                                                                <span><i
                                                                    className="fa fa-clock-o"></i>{`${date.getFullYear()} ${monthNames[date.getMonth()]} ${date.getDate()} `}</span>
                                                                <span><i className="fa fa-eye"></i>10</span>
                                                            </div>
                                                            <button className="btn-delete" type="button"
                                                                    onClick={() => this.editVideo(video._id)} style={{
                                                                float: 'right',
                                                                marginRight: '10px'
                                                            }}>Edit Video
                                                            </button>
                                                            <button className="btn-delete" type="button"
                                                                    onClick={() => this.deleteVideo(video._id)} style={{
                                                                float: 'right',
                                                                marginRight: '10px'
                                                            }}>Delete Video
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }) : <h4 style={{textAlign: 'center'}}>No Video Uploaded Yet. Click submit video button to upload your first video.</h4>}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    videos: state.videos.myVideos
});


export default connect(mapStateToProps, { myVideos, deleteMyVideos })(Videos);