import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Sidebar extends Component {

    render() {
        return(
            <div className="large-12 columns">
                <div className="widgetBox">
                    <div className="widgetTitle">
                        <h5>Profile Overview</h5>

                    </div>
                    <div className="widgetContent">
                        <ul className="profile-overview">
                            <li className="clearfix"><NavLink to="/me"><i
                                className="fa fa-user"></i>Profile </NavLink></li>
                            <li className="clearfix"><NavLink to="/videos"><i
                                className="fa fa-video-camera"></i>Videos </NavLink></li>
                            <li className="clearfix"><NavLink className="" to="/settings"><i
                                className="fa fa-gears"></i>Settings</NavLink></li>
                            {
                                localStorage.getItem('isAdmin') === "true" ? (
                                    <div>
                                        <li className="clearfix"><NavLink to="/auth/logout"><i
                                            className="fa fa-sign-out"></i>Introduction Video</NavLink></li>
                                        <li className="clearfix"><NavLink to="/auth/logout"><i
                                            className="fa fa-sign-out"></i>Lastest Videos</NavLink></li>
                                    </div>
                                ) : ''
                            }
                        </ul>
                        <NavLink to="/post" className="button"><i
                            className="fa fa-plus-circle"></i>Submit Video</NavLink>
                    </div>
                </div>
            </div>
        )
    }
}

export default Sidebar;