import React  from 'react';
import { NavLink } from 'react-router-dom';

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const AllVideos = ({props, loadMore, playFromList, remainCount}) => {
        return(
            <React.Fragment>
                <div className="large-4 columns">
                    <aside className="secBg sidebar">
                        <div className="row">

                            {/*<div className="large-12 medium-7 medium-centered columns">
                                <div className="widgetBox">
                                    <div className="widgetTitle">
                                        <h5>Search Videos</h5>
                                    </div>
                                    <form id="searchform" method="get" role="search">
                                        <div className="input-group">
                                            <input className="input-group-field" placeholder="Enter your keyword"
                                                   type="text" />
                                            <div className="input-group-button">
                                                <input className="button" value="Search" type="submit" />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>*/}

                            <div className="large-12 medium-7 medium-centered columns">
                                <div className="widgetBox">
                                    <div className="widgetTitle">
                                        <h5>Recently posted videos</h5>
                                    </div>
                                    <div className="widgetContent">
                                        {(props !== undefined && props.length > 0) ? props.map((video, index) => {

                                            const date = new Date(video.createdAt);
                                            var t = '#t='+(Math.floor(Math.random() * (15 - 5 + 1) ) + 5);
                                            //var t = '#t=5';
                                            return(
                                                <div key={index} className="media-object stack-for-small">
                                                    <div className="media-object-section">
                                                        <div className="recent-img">
                                                            <video width="400" controlsList="nodownload">
                                                                <source src={video.videoUrl+t} type="video/mp4" />
                                                                Your browser does not support HTML5 video.
                                                            </video>
                                                            <NavLink to={`/video/${video._id}`} onClick={() => playFromList(video._id)} className="hover-posts">
                                                                <span><i className="fa fa-play"></i></span>
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                    <div className="media-object-section">
                                                        <div className="media-content">
                                                            <h6><NavLink to={`/video/${video._id}`} onClick={() => playFromList(video._id)}>{video.title.substring(0,50)}</NavLink>
                                                            </h6>
                                                            <p><i className="fa fa-user"></i><span>{video.user && video.user.name}</span>
                                                                {/*<i className="fa fa-clock-o"></i><span>{`${date.getFullYear()} ${monthNames[date.getMonth()]} ${date.getDate()} `}</span>*/}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }): (
                                            <h4 style={{textAlign: 'center', marginBottom: '30px'}}>No Videos Found</h4>
                                        )}

                                        {(remainCount !== undefined && remainCount > 0) ? (
                                            <div className="main-comment showmore_one">
                                                <div className="showmore_trigger" onClick={loadMore}><span
                                                    className="more">Show more</span>
                                                </div>
                                            </div>
                                        ) : ""}


                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </React.Fragment>
        )
    };
export default AllVideos;