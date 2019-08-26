import React  from 'react';
import {Link, NavLink} from 'react-router-dom';

const NavBar = (props) => {
        return(
            <section id="navBar">
                <nav className="sticky-container" data-sticky-container="">
                    <div className="sticky topnav" style={{width: "100%",
                        background: "#fff"}}>
                        <div className="row">
                            <div className="large-12 columns">

                                <div className="title-bar" data-responsive-toggle="beNav" data-hide-for="large">
                                    <button className="menu-icon" onClick={props.toggleMenu} type="button"
                                            data-toggle="offCanvas-responsive"></button>
                                    <div className="title-bar-title"><img src="/assets/images/scientistpage_logo.png" style={{width: '190px'}} alt="logo" /></div>
                                </div>

                                <div className="top-bar show-for-large" id="beNav" >
                                    <div className="top-bar-left">
                                        <ul className="menu">
                                            <li className="menu-text">
                                                <Link to="/"><img src="/assets/images/scientistpage_logo.png" style={{width: '190px'}} alt="logo" /></Link>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="top-bar-right">
                                        <ul className="menu vertical medium-horizontal">
                                            <li>
                                                <NavLink to="/"><i className="fa fa-home"></i>Home</NavLink>
                                            </li>
                                            <li><NavLink to="/about"><i
                                                className="fa fa-user"></i>About</NavLink></li>
                                            <li><NavLink to="/how-it-works"><i
                                                className="fa fa-cogs"></i>How it works</NavLink></li>
                                            <li><NavLink to="/contact"><i className="fa fa-envelope"></i>Contact</NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </nav>
            </section>
        )
};

export default NavBar;