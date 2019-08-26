import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

import SocialButton from './Auth'
import { loginWithSocialNetwork} from './redux-state/authActions';
import { registerUser } from './redux-state/authActions'
import Spinner from '../../common/utils/Spinner'

class Register extends Component {

    state = {
        name: "",
        email: "",
        password: "",
        university: "",
        affiliation: "",
        research_area:"",
        errors: {}
    }

    // TODO: Lifecycle hook
    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/me');
        }
    }

    // TODO: Lifecycle hook
    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({errors: nextProps.errors});
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.registerUser({
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            university: this.state.university,
            affiliation: this.state.affiliation,
            research_area: this.state.research_area,
            },
            this.props.history
        );
    }

    responseFacebook = (response) => {
        const socialData = {
            fbUserId: response.id,
            name: response.name,
            email: response.email,
            avatar: response.picture.data.url,
            accessToken: response.accessToken,
            expiresIn: response.expiresIn
        }
        if (response.accessToken !== undefined || response.accessToken !== "") {
            this.props.loginWithSocialNetwork(socialData, this.props.history);
        } else {
            alert('Something went wrong');
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
        const { errors } = this.state;


        return(
            <React.Fragment>
                <section id="breadcrumb">
                    <div className="row">
                        <div className="large-12 columns">
                           {/* <nav>
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
                                            <h3>User Registeration</h3>

                                        </div>
                                    </div>

                                </div>`

                                <div className="row" data-equalizer="pu4nw8-equalizer" data-equalize-on="medium"
                                     id="test-eq" data-resize="mfueio-eq" data-events="resize">
                                    <div className="large-4 large-offset-1 medium-6 columns">
                                        <div className="social-login" data-equalizer-watch="" style={{height: "174px"}}>
                                            <h5 className="text-center">Signup via Social Profile</h5>
                                            <FacebookLogin
                                                appId="214671746051774"
                                                fields="id,name,email,picture"
                                                callback={this.responseFacebook}
                                                render={renderProps => (
                                                    <div className="social-login-btn facebook" >
                                                        <a href="#" onClick={renderProps.onClick}><i className="fa fa-facebook"></i>Signup with facebook</a>
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
                                                Signup with linkedin
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
                                            <h5 className="text-center">Create your Account</h5>
                                            <form onSubmit={this.handleSubmit} style={{position: 'relative'}}>
                                                {this.props.spinner.spinner ? <Spinner color="primary"/> : ""}

                                                <div className="input-group">
                                                    <span className="input-group-label"><i
                                                        className="fa fa-user"></i></span>
                                                    <input
                                                        name="name"
                                                        placeholder="Full Name"
                                                        type="text"
                                                        value={this.state.name}
                                                        onChange={this.onChange}
                                                    />
                                                    {errors.name && (<div className="invalid-feedback" style={{color: 'red'}}>{errors.name}</div>)}
                                                </div>


                                                <div className="input-group">
                                                    <span className="input-group-label"><i
                                                        className="fa fa-envelope"></i></span>
                                                    <input
                                                        name="email"
                                                        placeholder="Email"
                                                        type="email"
                                                        className="input-group-field"
                                                        value={this.state.email}
                                                        onChange={this.onChange}
                                                    />
                                                    {errors.email && (<div className="invalid-feedback" style={{color: 'red'}}>{errors.email}</div>)}

                                                </div>

                                                <div className="input-group">
                                                    <span className="input-group-label"><i
                                                        className="fa fa-lock"></i></span>
                                                    <input
                                                        name="password"
                                                        placeholder="Password"
                                                        type="password"
                                                        className="input-group-field"
                                                        value={this.state.password}
                                                        onChange={this.onChange}
                                                    />
                                                    {errors.password && (<div className="invalid-feedback" style={{color: 'red'}}>{errors.password}</div>)}

                                                </div>

                                                <div className="input-group">
                                                    <span className="input-group-label"><i
                                                        className="fa fa-building"></i></span>
                                                    <input
                                                        name="university"
                                                        placeholder="University/Institue"
                                                        type="text"
                                                        className="input-group-field"
                                                        value={this.state.university}
                                                        onChange={this.onChange}
                                                    />
                                                    {errors.university && (<div className="invalid-feedback" style={{color: 'red'}}>{errors.university}</div>)}

                                                </div>

                                                <div className="input-group">
                                                    <span className="input-group-label"><i
                                                        className="fa fa-certificate"></i></span>
                                                    {/*<input
                                                        name="affiliation"
                                                        placeholder="Affiliation"
                                                        type="text"
                                                        className="input-group-field"
                                                        value={this.state.affiliation}
                                                        onChange={this.onChange}
                                                    />*/}
                                                    <select name="affiliation"
                                                            placeholder="Affiliation"
                                                            className="input-group-field"
                                                            value={this.state.affiliation}
                                                            onChange={this.onChange}>
                                                        <option>- Select affiliation -</option>
                                                        <option>Professor</option>
                                                        <option>Associate Professor</option>
                                                        <option>Assistant Professor</option>
                                                        <option>Research Scientist</option>
                                                        <option>Researcher</option>
                                                        <option>PhD Scholar</option>
                                                        <option>Master student</option>
                                                        <option>Bachelor student</option>
                                                        <option>Others</option>
                                                    </select>
                                                    {errors.affiliation && (<div className="invalid-feedback" style={{color: 'red'}}>{errors.affiliation}</div>)}

                                                </div>
                                                <div className="input-group">
                                                    <span className="input-group-label"><i
                                                        className="fa fa-flask"></i></span>
                                                    <input
                                                        name="research_area"
                                                        placeholder="Research Area"
                                                        type="text"
                                                        className="input-group-field"
                                                        value={this.state.research_area}
                                                        onChange={this.onChange}
                                                    />
                                                    {errors.research_area && (<div className="invalid-feedback" style={{color: 'red'}}>{errors.research_area}</div>)}

                                                </div>
                                                <button className="button expanded" type="submit" name="submit">Sign
                                                    Up
                                                </button>
                                                <p className="loginclick"> <Link style={{float: 'right'}} to="/auth/login">Already have an
                                                    account?</Link></p>
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
});


export default connect(mapStateToProps, { registerUser, loginWithSocialNetwork })(withRouter(Register));