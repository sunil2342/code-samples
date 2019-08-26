import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import SocialButton from './Auth'


import {loginUser, loginWithSocialNetwork, forgotPassword, checkHash, resetPassword} from './redux-state/authActions';
import { closeModal } from "../modals/redux-state/modalActions";
import Spinner from '../../common/utils/Spinner'

class ResetPassword extends Component {
    state = {
        email: "",
        password: "",
        errors: {},
        public_user: null
    };

    componentDidMount() {

        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/me');
        }

        this.setState({hash:this.props.match.params.hash});
        this.props.checkHash({hash: this.props.match.params.hash}, this.props.history, 'regular');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }

        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }

        if(nextProps.public_user) {
            this.setState({
                public_user: nextProps.public_user
            });
        }
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.resetPassword({resetHash: this.state.hash, password: this.state.password, confirm_password: this.state.confirm_password}, this.props.history, 'regular');
    };

    responseFacebook = (response) => {
        
        const profilePic = `http://graph.facebook.com/${response.id}/picture?height=400`;
        if (profilePic !== "") {
            const socialData = {
                fbUserId: response.id,
                name: response.name,
                email: response.email,
                avatar: profilePic,
                accessToken: response.accessToken,
                expiresIn: response.expiresIn
            };
            if (response.accessToken !== undefined || response.accessToken !== "") {
                this.props.loginWithSocialNetwork(socialData, this.props.history, "facebook");
            } else {
                alert('Something went wrong');
            }
            
        }
    };


    handleSocialLogin = (response) => {
        const socialData = {
            linkedInUserId: response._profile.id,
            name: response._profile.name,
            email: response._profile.email,
            avatar: response._profile.profilePicURL,
            accessToken: response._token.accessToken,
            expiresIn: response._token.expiresAt
        };

        console.log(socialData);

        this.props.loginWithSocialNetwork(socialData, this.props.history, "linkedIn");
    };

    handleSocialLoginFailure = (err) => {
        console.error(err)
    };

    render() {
        const {errors} = this.state;
        const {public_user} = this.state;
        console.log('this.state.data ...');
        console.log(this.state.public_user);
        return (
            <React.Fragment>
                <section id="breadcrumb">
                    <div className="row">
                        <div className="large-12 columns">
                            {/*<nav>
                                <ul className="breadcrumbs">
                                    <li><i className="fa fa-home"></i><a href=" ">Home</a></li>
                                    <li>
                                        <span className="show-for-sr">Current: </span> Reset password
                                    </li>
                                </ul>
                            </nav>*/}
                        </div>
                    </div>
                </section>

                <section className="registration">
                    <div className="row secBg">
                        <div className="large-12 columns">
                            <div className="login-register-content">
                                <div className="row collapse borderBottom">
                                    <div className="medium-6 large-centered medium-centered">
                                        <div className="page-heading text-center">
                                            <h3>Reset password</h3>

                                        </div>
                                    </div>
                                </div>
                                <div className="row" data-equalizer="pu4nw8-equalizer" data-equalize-on="medium"
                                     id="test-eq" data-resize="mfueio-eq" data-events="resize">
                                    {public_user &&
                                    <div className="large-4 large-offset-4 medium-6 columns end">
                                        <div className="register-form">
                                            <h5 className="text-center">Reset password</h5>
                                            <form onSubmit={this.handleSubmit} style={{position: 'relative'}}>
                                                {this.props.spinner.spinner ? <Spinner color="primary"/> : ""}
                                                <div className="input-group">
                                                    <span className="input-group-label"><i
                                                        className="fa fa-lock"></i></span>
                                                    <input
                                                        name="password"
                                                        type="password"
                                                        placeholder="New Password"
                                                        className="input-group-field"
                                                        value={this.state.password}
                                                        onChange={this.onChange}
                                                    />
                                                    {errors.password && (<div className="invalid-feedback"
                                                                              style={{color: 'red'}}>{errors.password}</div>)}
                                                </div>
                                                <div className="input-group">
                                                    <span className="input-group-label"><i
                                                        className="fa fa-lock"></i></span>
                                                    <input
                                                        name="confirm_password"
                                                        type="password"
                                                        placeholder="Confirm Password"
                                                        className="input-group-field"
                                                        value={this.state.confirm_password}
                                                        onChange={this.onChange}
                                                    />
                                                    {errors.confirm_password && (<div className="invalid-feedback"
                                                                              style={{color: 'red'}}>{errors.confirm_password}</div>)}
                                                </div>

                                                <button className="button expanded" type="submit" name="submit">Submit
                                                </button>
                                                <p className="loginclick"><Link to="/auth/login">Login Here</Link> New Here? <Link to="/auth/register">Create a new
                                                    Account</Link></p>
                                            </form>
                                        </div>
                                    </div>}
                                    {!public_user &&
                                    <div className="page-heading text-center">
                                        <h5>Invalid request</h5>
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.err,
    spinner: state.spinner,
    public_user:state.auth.publicProfile
})

export default connect(mapStateToProps, {loginUser, forgotPassword, checkHash, resetPassword, loginWithSocialNetwork, closeModal})(withRouter(ResetPassword));