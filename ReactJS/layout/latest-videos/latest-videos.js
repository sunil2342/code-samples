import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const LatestVideos = ({props, spinner}) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const videoTime = document.getElementsByTagName('video');
    console.log(videoTime.currentTime);


    return (
        <div className="row list-group">
            {
                props.length > 0 ? props.map((video, index) => {
                    console.log(video);
                    const date = new Date(video.createdAt);
                    var t = '#t='+(Math.floor(Math.random() * (30 - 5 + 1) ) + 5);
                    return (
                        <div key={index} className="item large-4 medium-6 columns group-item-grid-default">
                            <div className="post thumb-border">
                                <div className="post-thumb">
                                    <video width="400" id="vid" controlsList="nodownload">
                                        <source src={video.videoUrl+t} type="video/mp4" />
                                        Your browser does not support HTML5 video.
                                    </video>

                                    <NavLink to={`/video/${video._id}`} className="hover-posts">
                                        <span><i className="fa fa-play"></i>Watch Video</span>
                                    </NavLink>

                                    {/* <div className="video-stats clearfix">
                                        <div className="thumb-stats pull-right">
                                            <span>05:56</span>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="post-des">
                                    <h6><Link to={`/video/${video._id}`}>{video.title.substr(0, 80)}{video.title.length > 80 ? '...' : ''}</Link></h6>
                                    <div className="post-stats clearfix">
                                        <p className="bx">
                                            {/*<i className="fa fa-user"></i> &nbsp;*/}
                                            <span> <a href=" ">{video.first_author} {video.first_author &&<span style={{fontStyle: 'italic'}}>et. al</span>}</a></span>
                                        </p>
                                        <p className="bx last pull-right">
                                            <img className="latest_avatar" src={video.currentUser[0].avatar} alt={video.currentUser[0].name} />
                                        </p>
                                        <p className="bx journal">
                                            <i className="fa fa-book"></i> &nbsp;
                                            <span> <a href=" ">{video.generalName.substr(0, 20)}{video.generalName.length > 20 ? '...' : ''}</a></span>
                                        </p>
                                        <p className="bx last pull-right views">
                                            <i className="fa fa-eye"></i>&nbsp;
                                            <span>{video.videoViews.length}</span>
                                        </p>
                                    </div>

                                    <div className="post-button">
                                        <a href="single-video-v2.html" className="secondary-button"><i
                                            className="fa fa-play-circle"></i>watch video</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }) : spinner ? <h4 style={{textAlign: 'center', marginBottom: '30px'}}>Loading...</h4> : <h4 style={{textAlign: 'center', marginBottom: '30px'}}>No Videos Found</h4>
            }
        </div>
    );
};

export default LatestVideos;