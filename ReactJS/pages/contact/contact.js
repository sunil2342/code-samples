import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveContact } from './redux-state/uploadAction';
import Spinner from '../../../common/utils/Spinner'

class Contact extends Component {

    state = {
        name: '',
        email: '',
        subject: '',
        message: '',
        errors: {}
    };

    handleSubmit = event => {
        event.preventDefault();
        const contactData = {
            name: this.state.name,
            email: this.state.email,
            subject: this.state.subject,
            message: this.state.message,
        };
        this.props.saveContact(contactData, this.props.history,);
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };

    render() {
        const { spinner } = this.props;
        const { errors } = this.state;
        return (
            <React.Fragment>
                <section id="breadcrumb">
                    <div className="row">
                        <div className="large-12 columns">
                            {/*<nav aria-label="You are here:">
                                <ul className="breadcrumbs">
                                    <li>
                                        <i className="fa fa-home"></i>
                                        <a href=" ">Home</a>
                                    </li>
                                    <li>
                                        <span className="show-for-sr">Current: </span> contact us
                                    </li>
                                </ul>
                            </nav>*/}
                        </div>
                    </div>
                </section>

                <section className="registration">
                    <div className="row secBg">
                        <div className="contact">
                            <div className="contact-left">
                                <h3 className="title-main">Get in Touch!</h3>
                                <p>Please fill the form given below. We will get back to you soon. </p>
                                <div className="register-form">
                                    <form method="post" data-abide noValidate onSubmit={this.handleSubmit}>
                                        { spinner.spinner ? <Spinner color="primary"/> : ""}
                                        {/*<div data-abide-error className="alert callout" style={{display: "none;"}}>*/}
                                        {/*<p>*/}
                                        {/*<i className="fa fa-exclamation-triangle"></i> There are some*/}
                                        {/*errors in your form.</p>*/}
                                        {/*</div>*/}
                                        <div className="input-group">
                                                <span className="input-group-label">
                                                    <i className="fa fa-user"></i>
                                                </span>
                                            <input className="input-group-field" type="text"
                                                   placeholder="Enter your name" required
                                                   name='name'
                                                   value={this.state.name}
                                                   onChange={this.onChange}
                                                   />
                                            {errors.name && (<div className="invalid-feedback" style={{color: 'red'}}>{errors.name}</div>)}
                                        </div>
                                        <div className="input-group">
                                                <span className="input-group-label">
                                                    <i className="fa fa-envelope"></i>
                                                </span>
                                            <input className="input-group-field" type="email"
                                                   placeholder="Enter your email" required
                                                   name='email'
                                                   value={this.state.email}
                                                   onChange={this.onChange}/>
                                            {errors.email && (<div className="invalid-feedback" style={{color: 'red'}}>{errors.email}</div>)}
                                        </div>
                                        <div className="input-group">
                                                <span className="input-group-label">
                                                    <i className="fa fa-book"></i>
                                                </span>
                                            <input className="input-group-field" type="text"
                                                   placeholder="Enter your subject" required
                                                   name='subject'
                                                   value={this.state.subject}
                                                   onChange={this.onChange}/>
                                        </div>
                                        <textarea required placeholder="Your message"
                                                  name='message'
                                                  value={this.state.message}
                                                  onChange={this.onChange}></textarea>
                                        <button className="button expanded" type="submit" name="submit">Contact
                                            Now
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div className="contact-right">
                                <h3 className="title-main">Follow us</h3>
                                <div className="social-icons">
                                    <p>
                                        <a href="https://www.facebook.com/ScientistPage-113465329294352" className="secondary-button" target='_blank'>
                                            <i className="fa fa-facebook"></i>Like us on Facebook
                                        </a>
                                    </p>
                                    <p>
                                        <a href="https://twitter.com/ScientistPage" className="secondary-button" target='_blank'>
                                            <i className="fa fa-twitter"></i>Follow us on Twitter
                                        </a>
                                    </p>
                                    <p>
                                        <a href="https://www.linkedin.com/company/scientistpage99/" className="secondary-button" target='_blank'>
                                            <i className="fa fa-linkedin"></i>Follow us on Linkedin
                                        </a>
                                    </p>
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
    spinner: state.spinner,
    errors: state.err,
});

export default connect(mapStateToProps, {saveContact })(Contact);