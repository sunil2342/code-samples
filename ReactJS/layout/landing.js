import React, {Component} from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { lastestVideo, allCount } from '../pages/inner-pages/videos/redux-state/videosAction';

import IntroVideos from './intro-videos/intro-videos';
import LatestVideos from './latest-videos/latest-videos';

class Landing extends Component {

    state = {
        videos: [],
        allCount: ''
    };

    componentDidMount() {
        this.props.lastestVideo();
        this.props.allCount();
    }

    render() {

        const { isAuthenticated } = this.props.auth;

        return (
            <React.Fragment>
                <section id="slider" style={{
                    height: '480px',
                    backgroundImage: 'url(/assets/images/banner1.jpg)',
                    position: 'relative'
                }}>
                    <div className="sliderHeading sliderButtons" style={{
                        position: 'absolute',
                        zIndex: 9,
                        top: '50%',
                        left: '50%',
                        textAlign: 'center',
                        marginTop: '40px'
                    }}>
                        <h1 style={{color: 'white', fontSize: '40px'}}>Welcome to ScientistPage</h1>
                        <p style={{color: 'white !important'}}>A dedicated video hosting platform for research articles</p>
                        {isAuthenticated ? (<NavLink className="button" to="/post" >Start Now</NavLink>) : (<NavLink to="/auth/login" className="button">Start Now</NavLink>)}

                    </div>
                </section>
                <section className="content" style={{marginTop: "25px"}}>
                    <div className="row secBg" style={{marginTop: '20px'}}>
                        <div className="large-12 columns">

                            <div className="tabs-content">
                                <div className="tab-container tab-content active" data-content="1">
                                    <IntroVideos/>
                                </div>

                            </div>

                        </div>
                    </div>
                </section>
                <section className="content" style={{marginTop: "20px", marginBottom: "30px"}}>

                    <div className="main-heading" style={{marginTop: "30px"}}>
                        <div className="row secBg padding-14">
                            <div className="medium-8 small-8 columns">
                                <div className="head-title">
                                    <i className="fa fa-star"></i>
                                    <h4>Latest Videos</h4>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row secBg">
                        <div className="large-12 columns">
                            <div className="row column head-text clearfix">
                                {/*<p className="pull-left">All Videos : <span>{this.props.latest.allVideosCount} Videos posted</span></p>*/}

                            </div>
                            <div className="tabs-content" data-tabs-content="popularVideos">
                                <div className="tabs-panel is-active" id="popular-all">
                                    <LatestVideos props={this.props.latest.latestVideos} spinner={this.props.spinner}/>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </React.Fragment>
        )
    }
}

Landing.propTypes = {
    lastestVideo: PropTypes.func.isRequired,
    latest: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    latest  : state.videos,
    auth    : state.auth,
    spinner : state.spinner.spinner
});

export default connect(mapStateToProps, {lastestVideo, allCount})(withRouter(Landing));