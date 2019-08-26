import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Form, Segment, Button } from 'semantic-ui-react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { NavLink } from 'react-router-dom';


import { closeModal } from "./redux-state/modalActions";
import { GET_ERRORS } from '../../common/reducers/shared-reducers/types';
import { loginUser, loginWithSocialNetwork, setError } from '../auth/redux-state/authActions';
import Spinner from '../../common/utils/Spinner'
import SocialButton from '../auth/Auth';

class LoginModal extends Component {

    state = {
        email: "",
        password: "",
        errors: {}
    };

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.loginUser({email: this.state.email, password: this.state.password}, this.props.history, 'modal');
    };

    closeModal = () => {
        this.props.setError();
        this.props.closeModal();
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

        this.props.loginWithSocialNetwork(socialData, this.props.history, "facebookModal");
    }

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

        this.props.loginWithSocialNetwork(socialData, this.props.history, "linkedInModal");
    };

    handleSocialLoginFailure = (err) => {
        console.error(err)
    };

    render() {
        const { errors } = this.props;
        return (
            <Modal
                size='mini'
                open={true}
                onClose={this.props.closeModal}
            >
                <Modal.Header>
                    Hi . You need to login to ask question!
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <div className="login-form">
                            <form onSubmit={this.handleSubmit}>
                                <div className="input-group">
                                    <span className="input-group-label">
                                        <i className="fa fa-user"></i>
                                    </span>
                                    <input className="input-group-field" name="email"
                                        type="text"
                                        placeholder="Email Address"
                                        defaultValue={this.state.email}
                                        onChange={this.onChange}
                                    />
                                    {errors.email && <span style={{color:'red'}}>{errors.email}</span>}
                                </div>
                                <div className="input-group">
                                    <span className="input-group-label">
                                        <i className="fa fa-lock"></i>
                                    </span>
                                    <input className="input-group-field" name="password"
                                        type="password"
                                        placeholder="password"
                                        defaultValue={this.state.password}
                                        onChange={this.onChange}
                                    />
                                    {errors.password && <span style={{color:'red'}}>{errors.password}</span>}
                                </div>
                                <Button type="submit" fluid size="large">
                                    Login Now
                                </Button>
                            </form>
                                        <hr />
                            <p className="text-center">New here?
                                <NavLink className="newaccount" to="/auth/register" onClick={this.closeModal}> Create a new Account</NavLink>
                            </p>
                                        <br/>
                                        <div style={{textAlign: 'center', marginBottom: '25px', fontWeight: 'bold'}}>OR</div>

                                    <div className="social-login" data-equalizer-watch="" style={{height: "174px"}}>
                                    <h5 className="text-center">Login via Social Profile</h5>
                                    <FacebookLogin
                                        appId="214671746051774"
                                        fields="id,name,email,picture"
                                        callback={this.responseFacebook}
                                        render={renderProps => (
                                            <div className="social-login-btn facebook" style={{textAlign: 'center', marginBottom: '25px', marginTop: '38px'}}>
                                                <a style={{fontSize: '22px', textDecoration: 'none', backgroundColor: '#395996', padding: '15px', color: '#fff'}} href="#" onClick={renderProps.onClick}>Login via facebook</a>
                                            </div>
                                        )}
                                    />
                                    <div style={{textAlign: 'center', textDecoration: 'none', backgroundColor: '#4183c4', padding: '15px'}}>
                                        <SocialButton
                                            provider='linkedin'
                                            appId='81fmd66xr5lzor'
                                            onLoginSuccess={this.handleSocialLogin}
                                            onLoginFailure={this.handleSocialLoginFailure}
                                            style={{textAlign: 'center'}}
                                        >
                                        <span style={{fontSize: '22px', color: '#fff'}}>Login with linkedin</span>
                                        </SocialButton>
                                    </div>

                                   </div>

                        </div>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.err,
    spinner: state.spinner.spinner
});

export default connect(mapStateToProps, { loginUser, closeModal, loginWithSocialNetwork, setError })(LoginModal);