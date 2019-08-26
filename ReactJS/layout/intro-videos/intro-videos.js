import React from 'react';
// import 'react-html5video/dist/styles.css';

const IntroVideos = () => {
    return (
        <div className="row list-group">
            <div className="flex-video widescreen ldVideo">
                <video width="400" controls src="https://gpcoders.s3.amazonaws.com/INTRODUCTION.mp4" poster="" controlsList="nodownload">
                    Your browser does not support HTML5 video.
                </video>
            </div>
        </div>
    );
};

export default IntroVideos;