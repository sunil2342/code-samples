import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import Sidebar from "../shared-pages/sidebar";
import { myVideosCount } from '../videos/redux-state/videosAction';

class Me extends Component {

    state = {
        currentUserVideos: ''
    };

    componentDidMount() {
        this.props.myVideosCount(this.props.auth.user.id);
    }

    render() {
        const { user } = this.props.auth;
        return(
            <React.Fragment>
                {/*<section id="breadcrumb">
                    <div className="row">
                        <div className="large-12 columns">
                            <nav aria-label="You are here:">
                                <ul className="breadcrumbs">
                                    <li><i className="fa fa-home"></i><a href=" ">Home</a></li>
                                    <li><a href=" ">profile</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </section>*/}

                <section className="topProfile">
                    <div className="profile-stats">
                        <div className="row secBg">
                            <div className="large-12 columns">
                                <div className="profile-author-img">
                                    <NavLink to="/settings">
                                    <i className="fa fa-pencil"></i></NavLink>
                                    <img src={user.avatar} alt={user.name} />
                                </div>


                                <div className="clearfix">
                                    <div className="profile-author-name float-left">
                                        <h4>{user.name}</h4>
                                        <p>{user.university}</p>
                                        {JSON.stringify(this.props.myVideosCount)}
                                    </div>
                                    <div className="profile-author-stats float-right">
                                        <ul className="menu">
                                            <li>
                                                <div className="icon float-left">
                                                    <i className="fa fa-video-camera"></i>
                                                </div>
                                                <div className="li-text float-left">
                                                    <p className="number-text">{this.props.videoCounts !== undefined && this.props.videoCounts}</p>
                                                    <span>Videos</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="row">
                    <div className="large-4 columns">
                        <aside className="secBg sidebar">
                            <div className="row">
                                <Sidebar/>
                            </div>
                        </aside>
                    </div>
                    <div className="large-8 columns profile-inner">
                        <section className="singlePostDescription">
                            <div className="row secBg">
                                <div className="large-12 columns">
                                    <div className="heading">
                                        <i className="fa fa-user"></i>
                                        <h4>Researcher Information</h4>
                                    </div>
                                    <div className="description">
                                        <div className="description-form">
                                            <div className="description-form-row">
                                                <label className="control-label"><i className="fa fa-envelope"></i>&nbsp;Email:</label>
                                                <div className="control-field">
                                                    {user.email}
                                                </div>
                                            </div>
                                            <div className="description-form-row">
                                                <label className="control-label"><i className="fa fa-building"></i>&nbsp;University:</label>
                                                <div className="control-field">
                                                    {user.university}
                                                </div>
                                            </div>
                                            <div className="description-form-row">
                                                <label className="control-label"><i className="fa fa-certificate"></i>&nbsp;Affiliation:</label>
                                                <div className="control-field">
                                                    {user.affiliation}
                                                </div>
                                            </div>
                                            
                                            <div className="description-form-row">
                                                <label className="control-label"><i className="fa fa-share-alt"></i>&nbsp;Get socialize:</label>
                                                <div className="control-field">
                                                    <div className="social-btns">
                                                        <a href="  " className="inner-btn"><i className="fa fa-facebook"></i></a>
                                                        <a href="  " className="inner-btn"><i className="fa fa-twitter"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
    videoCounts: state.videos.myVideosCount
});

export default connect(mapStateToProps, { myVideosCount })(Me);