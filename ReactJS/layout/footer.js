import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Footer extends Component {
    render() {
        return (
            <React.Fragment>
                <footer>
                    {/*<div className="row">
                        <div className="large-12 medium-6 columns">
                            <div className="widgetBox">
                                 <div className="logo text-center">
                                    <img src="/assets/images/footer-logo.png" alt="footer logo"/>
                                </div>
                                <div className="textwidget" style={{textAlign: 'center'}}>
                                    Scientist Page is an open source online platform which is specifically dedicated for
                                    hosting the research videos (Journal articles, conference papers or thesis).

                                    Videos are the most powerful means of communicating the research concept and is
                                    considered as the future of research publishing industry. The concept explained in
                                    the video form engages more audience and increase the visibility of research work in
                                    the scientific community... (<Link to="/about">Read More</Link>)
                                </div>
                                
                            </div>
                        </div>
                    </div>*/}
                    <div className="row mainFooter">
                        <div className="large-4 medium-12 columns">
                            <div className="followUsContainer">
                                <h3 className="followUsText">Links</h3>
                            <ul className="prvicy">
                                <li><Link to="/privacy-policy"><span><i className="fa fa-newspaper-o"></i></span><span className="text">Privacy Policy</span></Link></li>
                                <li><Link to="/about"><span><i className="fa fa-user"></i></span><span className="text">About Us</span></Link></li>
                                <li><Link to="/contact"><span>
                                        <i className="fa fa-envelope"></i>
                                </span><span className="text">Contact Us</span></Link></li>
                            </ul>
                            </div>
                        </div>
                        <div className="large-4 medium-12 columns">
                            <div className="logoFooter">
                                <div className="logo text-center">
                                    <img src="/assets/images/logo_footer.png" alt="footer logo"/>
                                </div>
                            </div>
                        </div>
                        <div className="large-4 medium-12 columns">
                            <div className="followUsContainer">
                                <h3 className="followUsText">Follow Us</h3>
                                <ul className="followUsLinks social-icons">
                                    <li><a  className="secondary-button" href="https://www.facebook.com/ScientistPage-113465329294352" target="_blank" ><span><i className="fa fa-facebook"></i></span><span className="text">Like us on Facebook</span></a></li>
                                    <li><a href="https://twitter.com/ScientistPage" target="_blank"><span><i className="fa fa-twitter"></i></span><span className="text">Follow us on Twitter</span></a></li>
                                    <li><a href="https://www.linkedin.com/company/scientistpage99/" target="_blank"><span><i className="fa fa-linkedin"></i></span><span className="text">Follow us on Linkedin</span></a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="large-4 medium-12 columns">
                            <div className="logoFooter logofooter-btmm">
                                <div className="logo text-center">
                                    <img src="/assets/images/logo_footer.png" alt="footer logo"/>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="text-center" style={{color: 'white'}}>
                            { new Date().getFullYear() } &copy; ScientistPage All Rights Reserved
                        </div>
                    </div>
                    <a href=" " id="back-to-top" title="Back to top"><i className="fa fa-angle-double-up"></i></a>
                </footer>
            </React.Fragment>
        )
    }

}

export default Footer;