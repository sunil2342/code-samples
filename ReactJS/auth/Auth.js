import React from 'react'
import SocialLogin from 'react-social-login'

const Button = ({ children, triggerLogin, ...props }) => (
    <div className="social-login-btn linkedin">
    <a href="#" onClick={triggerLogin} {...props}>
        { children }
    </a>
    </div>
);

export default SocialLogin(Button)