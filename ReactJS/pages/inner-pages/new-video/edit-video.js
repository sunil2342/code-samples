import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

import Sidebar from "../shared-pages/sidebar";
import { uploadVideo, saveVideo, updateVideo } from './redux-state/uploadAction';
import { singleVideo } from '../videos/redux-state/videosAction';

import Spinner from '../../../../common/utils/Spinner'


class EditPostVideo extends Component {

    state = {
        video_title: '',
        first_author: '',
        additional_author: '',
        video_description: '',
        general_link: '',
        general_name: '',
        abstract: '',
        doi: '',
        currentUser: '',
        videoEtag: '',
        videoUrl: '',
        errors: {},
        videoSetFlag: null
    };

    handleChange = (date) => {
        this.setState({
            doi: date
        });
    };

    componentDidMount() {
        this.props.singleVideo(this.props.match.params.id, this.props.history);
        this.setState({video_id:this.props.match.params.id});
    }

    dropFile = (files) => {
        const formData = new FormData();
        formData.append('file', files[0]);
        this.props.uploadVideo(formData);
        this.setState({
            currentUser: this.props.auth.user.id
        });
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.uploadResponse.videoEtag) {

            var finalEtag = nextProps.uploadResponse.videoEtag.replace("\\\"", "\"");
            this.setState({
                videoEtag: finalEtag,
                videoUrl: nextProps.uploadResponse.videoUrl
            });
        }

        if(nextProps.video){
            if(this.state.videoSetFlag === null)
            {
                console.log("nextProps videos here");
                console.log(nextProps.video);
                this.setState({
                    video_title: nextProps.video.title,
                    first_author: nextProps.video.first_author,
                    additional_author: nextProps.video.additional_author,
                    video_description: nextProps.video.description,
                    currentUser: nextProps.video.user,
                    videoUrl: nextProps.video.videoUrl,
                    videoEtag: nextProps.video.videoEtag,
                    general_link: nextProps.video.generalLink,
                    general_name: nextProps.video.generalName,
                    abstract: nextProps.video.abstract,
                    doi: nextProps.video.doi,
                    videoSetFlag: true
                })
            }

        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };

    handleSubmit = event => {
        event.preventDefault();
        const videoData = {
            video_title: this.state.video_title,
            first_author: this.state.first_author,
            additional_author: this.state.additional_author,
            video_description: this.state.video_description,
            currentUser: this.state.currentUser,
            videoUrl: this.state.videoUrl,
            videoEtag: this.state.videoEtag,
            general_link: this.state.general_link,
            general_name: this.state.general_name,
            abstract: this.state.abstract,
            doi: this.state.doi
        };

        this.props.updateVideo(videoData, this.state.video_id, this.props.history,);

    };

    handleFinishedUpload = info => {
        console.log('File uploaded with filename', info.filename)
        console.log('Access it on s3 at', info.fileUrl)
    };

    onUploadProgress = (percent) => {
        console.log(percent);
        // this.setState({completed: percent});
    };

    onUploadFinish = ( e ) => {
        //Do things here
    };



    render() {

        const { spinner, uploadResponse } = this.props;

        const uploadOptions = {
            server: 'http://localhost:5000',
            signingUrlQueryParams: {},
        };
        const s3Url = 'https://gpcoders.s3.amazonaws.com'

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
                        <section className="submit-post">
                            <div className="row secBg">
                                <div className="large-12 columns">
                                    <div className="heading">
                                        <i className="fa fa-pencil-square-o"></i>
                                        <h4>Edit Video</h4>
                                    </div>
                                    <div className="row">
                                        <div className="large-12 columns">

                                            <form style={{position: 'relative'}} onSubmit={this.handleSubmit} >
                                                { spinner.spinner ? <Spinner color="primary"/> : ""}
                                                <div data-abide-error className="alert callout" style={{display: "none"}}>
                                                    <p><i className="fa fa-exclamation-triangle"></i>
                                                        There are some errors in your form.</p>
                                                </div>

                                                <div className="row">
                                                    <div className="large-12 columns">
                                                        <label>Title
                                                            <input
                                                                name='video_title'
                                                                value={this.state.video_title}
                                                                onChange={this.onChange}
                                                                placeholder='Title'
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className="large-12 columns">
                                                        <label>First Author
                                                            <input
                                                                name='first_author'
                                                                value={this.state.first_author}
                                                                onChange={this.onChange}
                                                                placeholder='First Author'
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className="large-12 columns">
                                                        <label>Additional Authors
                                                            <input
                                                                name='additional_author'
                                                                value={this.state.additional_author}
                                                                onChange={this.onChange}
                                                                placeholder='Additional Authors'
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className="large-12 columns">
                                                        <label>Keywords
                                                            <input placeholder="Enter Keywords" name="video_description" value={this.state.video_description} onChange={this.onChange}/>
                                                            <input type="hidden" value={this.state.videoEtag}  name="videoEtag" id="videoEtag" />
                                                            <input type="hidden" value={this.state.videoUrl}  name="videoUrl" id="videoUrl" />
                                                            <input type="hidden" value={this.state.currentUser}  name="currentUser" id="currentUser" />
                                                        </label>
                                                    </div>

                                                    <div className="large-12 columns">
                                                        <label>Journal Link (Optional)
                                                            <input
                                                                type="text"
                                                                placeholder="Journal Link"
                                                                name="general_link"
                                                                value={this.state.general_link}
                                                                onChange={this.onChange}
                                                            />

                                                        </label>
                                                    </div>

                                                    <div className="large-12 columns">
                                                        <label>Journal Name
                                                            <input
                                                                type="text"
                                                                placeholder="Journal Name"
                                                                name="general_name"
                                                                value={this.state.general_name}
                                                                onChange={this.onChange}
                                                            />

                                                        </label>
                                                    </div>

                                                    <div className="large-12 columns">
                                                        <label>Abstract
                                                            <textarea
                                                                type="text"
                                                                placeholder="Abstract"
                                                                name="abstract"
                                                                value={this.state.abstract}
                                                                onChange={this.onChange}
                                                            ></textarea>

                                                        </label>
                                                    </div>

                                                    <div className="large-12 columns">
                                                        <label>DOI
                                                            <input
                                                                type="text"
                                                                placeholder="Journal Name"
                                                                name="doi"
                                                                value={this.state.doi}
                                                                onChange={this.onChange}
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className="large-12 columns upldVideo">
                                                        <div className="upload-video">
                                                            <Dropzone accept="video/mp4" onDrop={this.dropFile}>
                                                                <div style={{
                                                                    padding: '20px',
                                                                    textAlign: 'center',
                                                                    marginTop: '35px'
                                                                }}>Try dropping some files here, or click to select files to upload.</div>
                                                            </Dropzone>

                                                            {/*<DropzoneS3Uploader*/}
                                                                {/*onFinish={this.handleFinishedUpload}*/}
                                                                {/*s3Url={s3Url}*/}
                                                                {/*maxSize={1024 * 1024 * 5}*/}
                                                                {/*upload={uploadOptions}*/}
                                                                {/*onProgress={this.onUploadProgress}*/}
                                                                {/*onFinish={this.onUploadFinish}*/}
                                                            {/*/>*/}
                                                        </div>

                                                    </div>
                                                    {uploadResponse.videoEtag !== "" && (
                                                        <div className="large-12 columns inner-flex-video playVdeo">
                                                            <div className="flex-video widescreen ldVideo">
                                                                <video width="400" controls src={this.state.videoUrl} controlsList="nodownload">
                                                                    Your browser does not support HTML5 video.
                                                                </video>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="large-12 columns">
                                                        <button type="submit" className="button expanded upldbtn">update now</button>
                                                    </div>
                                                </div>
                                            </form>
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
    spinner: state.spinner,
    uploadResponse: state.uploadVideo,
    video: state.videos.singleVideo,
});


export default connect(mapStateToProps, {singleVideo, uploadVideo, saveVideo, updateVideo })(EditPostVideo);