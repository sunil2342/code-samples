import React, { Component } from 'react';
import { connect } from 'react-redux';
import Sidebar from "../shared-pages/sidebar";
import Dropzone from 'react-dropzone';
import Spinner from '../../../../common/utils/Spinner'
import { updatePassword, updateGeneral, updateProfile, currentProfile } from '../../../auth/redux-state/authActions';
import { uploadVideo } from '../new-video/redux-state/uploadAction';

class Settings extends Component {

    state = {
        fullName: "",
        email: "",
        university: "",
        affiliation: "",
        password: "",
        profile_pic: null
    };

    updatePassword = (e) => {
        e.preventDefault();
        const passwordData = {
            password: this.state.password
        };
        this.props.updatePassword(passwordData);
    };

    updateGeneral = (e) => {
        e.preventDefault();

        const generalData = {
            name: e.target.fullName.value,
            email: e.target.email.value,
            university: e.target.university.value,
            affiliation: e.target.affiliation.value,
            website: e.target.website.value,
            bio: e.target.bio.value,
            twitter: e.target.twitter.value,
            facebook: e.target.facebook.value,
            linkedIn: e.target.linkedIn.value,
            avatar: e.target.profile_pic.value
        };
        this.props.updateGeneral(generalData);
    };

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
            this.setState({
                profile_pic: nextProps.uploadResponse.videoUrl
            });
        }
    }

    render() {

        const { user, currentProfile } = this.props.auth;
        const { spinner, uploadResponse } = this.props;

        return(
            <React.Fragment>

                <section id="breadcrumb">
                    <div className="row">
                        <div className="large-12 columns">
                            {/*<nav>
                                <ul className="breadcrumbs">
                                    <li><i className="fa fa-home"></i><a href="home-v1.html">Home</a></li>
                                    <li><a href="profile-page-v2.html">profile</a></li>
                                    <li>
                                        <span className="show-for-sr">Current: </span> about me
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
                        <section className="profile-settings">
                            <div className="row secBg">
                                <div className="large-12 columns">
                                    <div className="heading">
                                        <i className="fa fa-gears"></i>
                                        <h4>Profile Settings</h4>
                                    </div>
                                    <div className="row">
                                        <div className="large-12 columns">
                                            <div className="setting-form">
                                                <form onSubmit={this.updateGeneral}>
                                                    <div className="setting-form-inner">
                                                        <div className="row">
                                                            <div className="large-12 columns">
                                                                <h6 className="">General Setting</h6>
                                                            </div>
                                                            <div className="medium-6 columns">
                                                                <label>Full Name:
                                                                    <input type="text"
                                                                            placeholder="enter your first name.."
                                                                            defaultValue={user.name || ''}
                                                                            name='fullName'
                                                                    />
                                                                </label>
                                                            </div>

                                                            <div className="medium-6 columns">
                                                                <label>Email ID:
                                                                    <input type="email"
                                                                           placeholder="enter your email address.."
                                                                           defaultValue={user.email || ''}
                                                                           name='email'
                                                                    />
                                                                </label>
                                                            </div>


                                                        </div>
                                                    </div>

                                                    <div className="setting-form-inner">
                                                        <div className="row">
                                                            <div className="large-12 columns">
                                                                <h6 className="">University / Affiliation</h6>
                                                            </div>
                                                            <div className="medium-6 columns">
                                                                <label>University:
                                                                    <input type="text"
                                                                           placeholder="Enter your University.."
                                                                           defaultValue={user.university || ''}
                                                                           name='university'
                                                                    />
                                                                </label>
                                                            </div>
                                                            <div className="medium-6 columns">
                                                                <label>Affiliation:
                                                                    <input type="text"
                                                                           placeholder="Enter Affiliation.."
                                                                           defaultValue={user.affiliation || ''}
                                                                           name='affiliation'
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/*<div className="setting-form-inner">*/}
                                                        {/*<div className="row">*/}
                                                            {/*<div className="mdeium-12 columns" style={{textAlign: 'right'}}>*/}
                                                                {/*<button type="submit" className="updateBtn" style={{marginBottom: '20px'}}>Update Settings</button>*/}
                                                            {/*</div>*/}
                                                        {/*</div>*/}
                                                    {/*</div>*/}

                                                    <div className="setting-form-inner">
                                                        <div className="row">
                                                            <div className="large-12 columns">
                                                                <h6 className="">Other Information</h6>
                                                            </div>

                                                            <div className="medium-12 columns">
                                                                <label>Website URL:
                                                                    <input type="url"
                                                                           placeholder="enter your website url.."
                                                                           name="website"
                                                                           defaultValue={user.website || ''}
                                                                    />
                                                                </label>
                                                            </div>

                                                            <div className="medium-12 columns">
                                                                <label>Bio Description:
                                                                    <textarea  name="bio" defaultValue={user.bio || ''}></textarea>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="setting-form-inner">
                                                        <div className="row">
                                                            <div className="large-12 columns">
                                                                <h6 className="">Profile pic</h6>
                                                            </div>

                                                            <div className="medium-12 columns upldVideo">
                                                                <div className="upload-video">
                                                                    <Dropzone accept="image/png" onDrop={this.dropFile}>
                                                                        <div style={{
                                                                            padding: '20px',
                                                                            textAlign: 'center',
                                                                            marginTop: '35px'
                                                                        }}>Try dropping some files here, or click to select files to upload.</div>
                                                                    </Dropzone>
                                                                </div>


                                                            </div>

                                                        </div>
                                                    </div>
                                                    {uploadResponse.profile_pic !== "" && (
                                                        <div className="large-12 columns">
                                                                <img src={this.state.profile_pic}/>
                                                        </div>
                                                    )}
                                                    <div className="setting-form-inner">
                                                        <div className="row">
                                                            <div className="large-12 columns">
                                                                <h6 className="">Social Profile links</h6>
                                                            </div>
                                                            <div className="medium-12 columns">
                                                                <label>Twitter:
                                                                    <input type="url"
                                                                           placeholder="enter your profile link.."
                                                                           name="twitter"
                                                                           defaultValue={user.socialUrls !== undefined ? user.socialUrls.twitter : ''}
                                                                    />
                                                                </label>
                                                            </div>

                                                            <div className="medium-12 columns end">
                                                                <label>Facebook:
                                                                    <input type="url"
                                                                           placeholder="enter your profile link.."
                                                                           name="facebook"
                                                                           defaultValue={user.socialUrls !== undefined ? user.socialUrls.facebook : ''}
                                                                    />
                                                                </label>
                                                            </div>

                                                            <div className="medium-12 columns end">
                                                                <label>Linkedin:
                                                                    <input type="url"
                                                                           placeholder="enter your profile link.."
                                                                           name="linkedIn"
                                                                           defaultValue={user.socialUrls !== undefined ? user.socialUrls.linkedIn : ''}
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="setting-form-inner">
                                                        <div className="row">
                                                            <input type="hidden"
                                                                   placeholder="enter your website url.."
                                                                   name="profile_pic"
                                                                   value={this.state.profile_pic}
                                                            />
                                                            <div className="mdeium-12 columns" style={{textAlign: 'right'}}>
                                                                <button className="updateBtn" style={{marginBottom: '20px'}} type="submit">Update Settings</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>

                                                <form onSubmit={this.updatePassword}>

                                                    <div className="setting-form-inner">
                                                        <div className="row">
                                                            <div className="large-12 columns">
                                                                <h6 className="">Password Settings</h6>
                                                            </div>
                                                            <div className="medium-4 columns">
                                                                <label>New Password:
                                                                    <input type="password"
                                                                           placeholder="enter your new password.."
                                                                           value={this.state.password}
                                                                           name="password"
                                                                           onChange={(e) => this.setState({password: e.target.value})}
                                                                    />
                                                                </label>
                                                            </div>
                                                            <div className="medium-4 columns">
                                                                <label>Retype Password:
                                                                    <input type="password"
                                                                           placeholder="enter your new password.."/>
                                                                </label>
                                                            </div>

                                                            <div className="medium-4 columns">
                                                                <button className="updateBtn" type="submit" style={{float: 'right', marginTop: '25px'}} >Update Password</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
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
    spinner: state.spinner,
    uploadResponse: state.uploadVideo
});

export default connect(mapStateToProps, { updatePassword, updateGeneral, updateProfile, currentProfile, uploadVideo })(Settings);