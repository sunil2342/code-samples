import React from 'react';
import moment from 'moment';
import { LinkedinShareButton, LinkedinIcon, FacebookShareButton, FacebookIcon } from 'react-share'

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const AboutVideo = ({props, noOfViews, authorModal, comments}) => {
    const date = new Date(props !== undefined && props.createdAt);
    const doi = new Date(props !== undefined && props.doi);
    let avatar = "";
    let name = "";
    if (props.user !== undefined) {
        if(props.user.avatar !== undefined) {
            avatar = props.user.avatar;
            name = props.user.name;
        }
    }

    return(
        <React.Fragment>
            <section className="SinglePostStats">
                <div className="row secBg">
                    <div className="large-12 columns">
                        <div className="contribute"><h4>Contributed By :</h4></div>
                        <div className="media-object stack-for-small">
                            <div className="media-object-section">
                                <div className="author-img-sec">
                                    <div className="thumbnail author-single-post">
                                        <a href="#" onClick={() => authorModal(props.user._id)}><img src={avatar} alt={name} /></a>
                                    </div>
                                    <p className="text-center"><a href="#" onClick={() => authorModal(props.user._id)}>{name}</a></p>
                                </div>
                            </div>
                            <div className="media-object-section object-second">
                                <div className="author-des clearfix">
                                    <div className="post-title">
                                        <h4>{props !== undefined ? props.title : ""}</h4>
                                        <p>
                                            {/*<span><i className="fa fa-clock-o"></i>{`${date.getFullYear()} ${monthNames[date.getMonth()]} ${date.getDate()} `}</span>*/}
                                            <span><i className="fa fa-eye"></i>{noOfViews}</span>
                                            <span><i className="fa fa-commenting"></i>{comments.length > 0 ? comments.length : 0}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className='socialSharing'>
                                    <span style={{paddingTop: '1px'}}>
                                        Share on:
                                    </span>
                                    <span style={{paddingTop: '15px'}}>
                                            <FacebookShareButton
                                                url={`https://scientistpage.com/video/${props._id}`}
                                                quote={props.title}
                                                className="Demo__some-network__share-button">
                                                <FacebookIcon
                                                    size={32}
                                                    round />
                                              </FacebookShareButton>
                                    </span>

                                    <span>
                                        
                                        <LinkedinShareButton
                                            url={`https://scientistpage.com/video/${props._id}`}
                                            title={props.title}
                                            windowWidth={750}
                                            windowHeight={600}
                                            className="Demo__some-network__share-button">
                                        <LinkedinIcon
                                            size={32}
                                            round />
                                      </LinkedinShareButton>
                                    </span>
                                    
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="singlePostDescription">
                <div className="row secBg">
                    <div className="large-12 columns">
                        <div className="heading">
                            <h5>Keywords :</h5> <span >{props !== undefined ? props.description : ""}</span>
                        </div>
                        <div className="description showmore_one">
                            {props.first_author && <div>
                                <span style={{fontWeight: 'bold'}}>Authors:</span> {props.first_author}
                            </div>}

                            <div>
                                <span style={{fontWeight: 'bold'}}>Read Full Text:</span> <a href={props.generalLink} target='_blank'>{props.generalLink}</a>
                            </div>

                            <div>
                                <span style={{fontWeight: 'bold'}}>Journal Name: </span>   {props.generalName}
                            </div>

                            <div>
                                <span style={{fontWeight: 'bold'}}>DOI:</span> {props.doi}
                            </div>

                        </div>
                    </div>
                    <div className="large-12 columns">
                        <div className="heading">
                            <h5>Abstract</h5>
                        </div>
                        <div className="description showmore_one">
                            <div className="showmore_content">
                                <p>{props !== undefined ? props.abstract : ""}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}

export default AboutVideo;