import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import SocialButton from './Auth'


import {loginUser, loginWithSocialNetwork} from './redux-state/authActions';
import { closeModal } from "../modals/redux-state/modalActions";
import Spinner from '../../common/utils/Spinner'

class Login extends Component {
    state = {
        email: "",
        password: "",
        errors: {}
    };

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/me');
        }

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
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.loginUser({email: this.state.email, password: this.state.password}, this.props.history, 'regular');
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
        return (
            <React.Fragment>
                <section id="breadcrumb">
                    <div className="row">
                        <div className="large-12 columns">
                            {/*<nav>
                                <ul className="breadcrumbs">
                                    <li><i className="fa fa-home"></i><a href=" ">Home</a></li>
                                    <li>
                                        <span className="show-for-sr">Current: </span> Login
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
                                            <h3>User login</h3>

                                        </div>
                                    </div>
                                </div>
                                <div className="row" data-equalizer="pu4nw8-equalizer" data-equalize-on="medium"
                                     id="test-eq" data-resize="mfueio-eq" data-events="resize">
                                    <div className="large-4 large-offset-1 medium-6 columns">
                                        <div className="social-login" data-equalizer-watch="" style={{height: "174px"}}>
                                            <h5 className="text-center">Login via Social Profile</h5>

                                            <FacebookLogin
                                                appId="214671746051774"
                                                fields="id,name,email,picture"
                                                callback={this.responseFacebook}
                                                size="metro"
                                                disablMobileRedirect={true}
                                                render={renderProps => (
                                                    <div className="social-login-btn facebook" >
                                                        <a href="#" onClick={renderProps.onClick}><i className="fa fa-facebook"></i>Login with facebook</a>
                                                    </div>
                                                )}
                                            />


                                            <SocialButton
                                                provider='linkedin'
                                                appId='81fmd66xr5lzor'
                                                onLoginSuccess={this.handleSocialLogin}
                                                onLoginFailure={this.handleSocialLoginFailure}
                                            >
                                                <i className="fa fa-linkedin"></i>
                                                Login with linkedin
                                            </SocialButton>



                                        </div>
                                    </div>
                                    <div className="large-2 medium-2 columns show-for-large">
                                        <div className="middle-text text-center hide-for-small-only"
                                             data-equalizer-watch="" style={{height: "174px"}}>
                                            <p>
                                                <i className="fa fa-arrow-left arrow-left"></i>
                                                <span>OR</span>
                                                <i className="fa fa-arrow-right arrow-right"></i>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="large-4 medium-6 columns end">
                                        <div className="register-form">
                                            <h5 className="text-center">Login to your Account</h5>
                                            <form onSubmit={this.handleSubmit} style={{position: 'relative'}}>
                                                {this.props.spinner.spinner ? <Spinner color="primary"/> : ""}
                                                <div className="input-group">
                                                    <span className="input-group-label"><i
                                                        className="fa fa-user"></i></span>
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        placeholder="Email"
                                                        className="input-group-field"
                                                        value={this.state.email}
                                                        onChange={this.onChange}
                                                    />
                                                    {errors.email && (<div className="invalid-feedback"
                                                                           style={{color: 'red'}}>{errors.email}</div>)}
                                                </div>

                                                <div className="input-group">
                                                    <span className="input-group-label"><i
                                                        className="fa fa-lock"></i></span>
                                                    <input
                                                        name="password"
                                                        type="password"
                                                        placeholder="Password"
                                                        className="input-group-field"
                                                        value={this.state.password}
                                                        onChange={this.onChange}
                                                    />
                                                    {errors.password && (<div className="invalid-feedback"
                                                                              style={{color: 'red'}}>{errors.password}</div>)}
                                                </div>

                                                <button className="button expanded" type="submit" name="submit">login
                                                    Now
                                                </button>
                                                <p className="loginclick"><Link to="/forgot-password">Forgot
                                                    Password</Link> New Here? <Link to="/auth/register">Create a new
                                                    Account</Link></p>
                                            </form>
                                        </div>
                                    </div>
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
    spinner: state.spinner
})

export default connect(mapStateToProps, {loginUser, loginWithSocialNetwork, closeModal})(withRouter(Login));