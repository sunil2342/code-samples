import React, {Component} from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { logoutUser } from '../auth/redux-state/authActions';

import NavBar from "./navbar";

class Header extends Component {

    onLogoutClick = (e) => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() {

        const { isAuthenticated } = this.props.auth;

        const authLinks = (
            <ul className="menu float-right">
                <li className="dropdown-login">
                    <NavLink to="/me" className="loginReg" data-toggle="example-dropdown">My Account</NavLink>

                </li>

                <li className="dropdown-login">
                    <a href="" onClick={this.onLogoutClick}>Logout</a>
                </li>
            </ul>
        );

        const guestLinks = (
            <ul className="menu float-right">
                <li>
                    <Link to="/post">upload Video</Link>
                </li>
                <li className="dropdown-login">
                    <Link className="loginReg" to="/auth/login">login/Register</Link>
                </li>

            </ul>
        );

        const mobileLinks = (
            <ul className="menu">
                <li onClick={this.props.toggleMenu}>
                    <Link to="/post">upload Video</Link>
                </li>
                <li className="dropdown-login" onClick={this.props.toggleMenu}>
                    <Link className="loginReg" to="/auth/login">login/Register</Link>
                </li>

            </ul>
        );

        const mobAuthLinks = (
            <ul className="menu">
                <li className="dropdown-login" onClick={this.props.toggleMenu}>
                    <NavLink to="/me" className="loginReg" data-toggle="example-dropdown">My Account</NavLink>

                </li>

                <li className="dropdown-login" onClick={this.props.toggleMenu}>
                    <a href="" onClick={this.onLogoutClick}>Logout</a>
                </li>
            </ul>
        );

        return (
            <React.Fragment>
                <div className="off-canvas position-left light-off-menu resMenus" id="offCanvas-responsive">
                    <div className="off-menu-close" onClick={this.props.toggleMenu}>
                        <h3>Menu</h3>
                        <span data-toggle="offCanvas-responsive"><i className="fa fa-times"></i></span>
                    </div>
                    <ul className="vertical menu off-menu" data-responsive-menu="drilldown">
                        <li onClick={this.props.toggleMenu}>
                            <NavLink to="/"><i className="fa fa-home"></i>Home</NavLink>
                        </li>
                        <li onClick={this.props.toggleMenu}><NavLink to="/about"><i
                            className="fa fa-user"></i>About</NavLink></li>
                        <li onClick={this.props.toggleMenu}><NavLink to="/how-it-works"><i
                            className="fa fa-user"></i>How it works</NavLink></li>
                        <li onClick={this.props.toggleMenu}><NavLink to="/contact"><i className="fa fa-envelope"></i>Contact</NavLink>
                        </li>
                    </ul>

                    <div className="off-social">
                        <a href="https://www.facebook.com/ScientistPage-113465329294352" target='_blank'><i className="fa fa-facebook-f"></i></a> &nbsp;
                        <a href="https://twitter.com/ScientistPage" target='_blank'><i className="fa fa-twitter" ></i></a> &nbsp;
                        <a href="https://www.linkedin.com/company/scientistpage99/" target='_blank'><i className="fa fa-linkedin"></i></a>
                    </div>
                    <div className="top-button">
                        {isAuthenticated ? mobAuthLinks : mobileLinks}
                    </div>
                </div>
                <div className="off-canvas-content">
                    <header>
                        <section id="top" className="topBar show-for-large">
                            <div className="row">
                                <div className="medium-6 columns">
                                    <div className="socialLinks">
                                        <a href="https://www.facebook.com/ScientistPage-113465329294352" target='_blank'><i className="fa fa-facebook-f"></i></a> &nbsp;
                                        <a href="https://twitter.com/ScientistPage" target='_blank'><i className="fa fa-twitter"></i></a> &nbsp;
                                        <a href="https://www.linkedin.com/company/scientistpage99/" target='_blank'><i className="fa fa-linkedin"></i></a>
                                    </div>
                                </div>
                                <div className="medium-6 columns">
                                    <div className="top-button">
                                        {isAuthenticated ? authLinks : guestLinks}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <NavBar toggleMenu={this.props.toggleMenu}/>
                    </header>
                </div>
            </React.Fragment>

        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(withRouter(Header));