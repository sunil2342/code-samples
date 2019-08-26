import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import { saveComment } from './redux-state/commentAction';
import { openModal } from '../../../modals/redux-state/modalActions';
import { setError } from '../../../auth/redux-state/authActions'
import { spinner } from "../../../../common/reducers/shared-reducers/spinnerReducer";
import Spinner from '../../../../common/utils/Spinner';

class Comment extends Component {

    state = {
        commentBody: ""
    };

    static getDerivedStateFromProps(props, state) {
        if (props.err === "Unauthorized") {
            props.openModal('LoginModal');
        }

        return state;
    }

    askQuestion = (e) => {
        e.preventDefault();
        const questionData = {
            user_id: this.props.auth.user.id,
            video_id: this.props.video,
            commentBody: this.state.commentBody
        };
        this.props.saveComment(questionData);
        this.setState({
            commentBody: ""
        })
    };

    removeError = () => {
        if (this.props.err !== "") {
            this.props.setError();
        }
    };


    render() {
        let name = "";
        let avatar = "";

        return (
            <section className="content comments">

                <div className="row secBg">
                    <div className="large-12 columns">
                        <div className="main-heading borderBottom">
                            <div className="row padding-14">
                                <div className="medium-12 small-12 columns">
                                    <div className="head-title">
                                        <i className="fa fa-comments"></i>
                                        <h4>Ask Questions <span>({this.props.comments.length})</span></h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="comment-box ">
                            <div className="media-object stack-for-small">
                                {/*<div className="media-object-section comment-img text-center">

                                </div>*/}
                                <div className="media-object-section comment-textarea">
                                    <form onSubmit={this.askQuestion}>

                                                    <textarea name="commentText"
                                                              rows='10'
                                                              placeholder="Write your question here"
                                                              value={this.state.commentBody}
                                                              onChange={(e) => this.setState({commentBody: e.target.value})}
                                                              onKeyUp={this.removeError}
                                                    ></textarea>
                                        {this.props.err.commentBody && (<div className="invalid-feedback"
                                                                             style={{color: 'red'}}>{this.props.err.commentBody}</div>)}
                                                                             <span>{this.props.spinner && <img src='/assets/spinner/loader.svg' style={{width: '50px', height: '50px'}} />}</span>
                                        <button name="submit" className="button" style={{float: 'right'}} type="submit">{this.props.spinner ? 'Asking...' : 'Ask Question'}</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="comment-sort text-right">
                            <span>All Questions:</span>
                        </div>

                        {this.props.comments.length > 0 ? this.props.comments.map((comment, index) => {
                            return (
                                <div key={index} className="main-comment showmore_one">
                                    <div className="media-object stack-for-small">
                                        <div className="media-object-section comment-img text-center">
                                            <div className="comment-box-img">
                                                <img src={comment.user.avatar} alt={comment.user.name}/>
                                            </div>
                                        </div>
                                        <div className="media-object-section comment-desc">
                                            <div className="comment-title">
                                                <span className="name"><a href="#">{comment.user.name}</a> Said:</span>
                                                <span className="time float-right"><i
                                                    className="fa fa-clock-o"></i>{moment(comment.createdAt).fromNow()}</span>
                                            </div>
                                            <div className="comment-text">
                                                <p>{comment.commentBody}</p>
                                            </div>
                                            <div className="comment-btns">
                                                {/*<span><a href="#"><i className="fa fa-thumbs-o-up"></i></a> | <a href="#"><i*/}
                                            {/*className="fa fa-thumbs-o-down"></i></a></span>*/}
                                                {/*<span><a href="#"><i className="fa fa-share"></i>Reply</a></span>*/}

                                            </div>

                                            {/*<div className="media-object stack-for-small reply-comment">*/}
                                                {/*<div className="media-object-section comment-img text-center">*/}
                                                    {/*<div className="comment-box-img">*/}
                                                        {/*<img src="/assets/images/post-author-post.png" alt="comment"/>*/}
                                                    {/*</div>*/}
                                                {/*</div>*/}
                                                {/*<div className="media-object-section comment-desc">*/}
                                                    {/*<div className="comment-title">*/}
                                                        {/*<span className="name"><a href="#">Joseph John</a> Said:</span>*/}
                                                        {/*<span className="time float-right"><i*/}
                                                            {/*className="fa fa-clock-o"></i>1 minute ago</span>*/}
                                                    {/*</div>*/}
                                                    {/*<div className="comment-text">*/}
                                                        {/*<p>Yes, I will answer you.</p>*/}
                                                    {/*</div>*/}
                                                {/*</div>*/}
                                            {/*</div>*/}

                                        </div>
                                    </div>

                                </div>
                            )
                        }) : ""}

                        {this.props.remainCount > 0 && (
                            <div className="showmore_trigger" onClick={() => this.props.loadMoreComments(this.props.video)}>
                                <span className="more">Show more</span>
                            </div>
                        )}

                    </div>
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    err: state.err
});

export default connect(mapStateToProps, {saveComment, openModal, setError})(Comment);