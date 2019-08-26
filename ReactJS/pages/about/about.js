import React, { Component } from 'react';

class About extends Component {
    render() {
        return (
            <React.Fragment>
                <section id="breadcrumb" className="breadMargin">
                    <div className="row">
                        <div className="large-12 columns">
                            {/*<nav aria-label="You are here:">
                                <ul className="breadcrumbs">
                                    <li><i className="fa fa-home"></i><a href=" ">Home</a></li>
                                    <li>
                                        <span className="show-for-sr">Current: </span> About Us
                                    </li>
                                </ul>
                            </nav>*/}
                        </div>
                    </div>
                </section>
                <section className="category-content">
                    <div className="row">
                        <div className="large-12 columns">
                            <section className="content content-with-sidebar">
                                <div className="main-heading removeMargin">
                                    <div className="row secBg padding-14 removeBorderBottom">
                                        <div className="medium-8 small-8 columns">
                                            <div className="head-title">
                                                <i className="fa fa-user"></i>
                                                <h4>About Scientist Page</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row secBg" style={{paddingTop: 15}}>
                                    <div className="about-wrap">
                                    <div style={{backgroundImage: 'url(/assets/images/abt_us.jpg)', height: '430px', backgroundSize: 'cover'}}>
                                        
                                    </div>
                                    <article className="page-content">
                                            <p><strong>Scientist Page</strong> is an open source online platform which is specifically dedicated for hosting the research videos (Journal articles, conference papers or thesis). </p>

                                            <p>
                                                Videos are the most powerful means of communicating the research concept and is considered as the future of research publishing industry. The concept explained in the video form engages more audience and increase the visibility of research work in the scientific community.
                                            </p>
                                            <p>
                                                We, at Scientist Page believes that we can add the significant values to the scientific research by providing opportunity to researchers to present their research in video form.
                                            </p>
                                            <p>
                                                Our mission is to make the research work easily understandable and save the time invested by researchers in reading the complete papers to understand the concept.
                                            </p>

                                            <p>
                                                We wish you all the best
                                            </p>
                                            <p className="about-contact">
                                                <img src="/assets/images/contact-icon.png" alt="about video" /><br/>
                                                For any further information or suggestion, Kindly contact us at <a href='mailto:info@scientistpage.com'>info@scientistpage.com</a>
                                            </p>
                                        </article>
                                        
                                    </div>

                                    
                                </div>
                            </section>
                            <div className="googleAdv">

                            </div>
                        </div>

                    </div>
                </section>
            </React.Fragment>
        )
    }
}

export default About;