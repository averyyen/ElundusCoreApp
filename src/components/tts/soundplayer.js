import React from "react";
import { connect } from "react-redux";
import Card from "react-bootstrap/Card";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import DownloadVoice from "./downloadvoice";

class SoundPlayer extends React.Component {
  render() {
    if (this.props.voiceBlobUrl === "") {
      return null;
    }

    return (
      <Card>
        <Card.Header>Result</Card.Header>
        <Card.Body>
          <div className="audio-player">
            <AudioPlayer autoPlay src={this.props.voiceBlobUrl} />
          </div>
          <DownloadVoice voiceBlobUrl={this.props.voiceBlobUrl} />
        </Card.Body>
      </Card>
    );
  }
}

export default connect((state, props) => {
  return {
    voiceBlobUrl: state.voiceBlobUrl,
    voiceBlob: state.voiceBlob,
  };
})(SoundPlayer);
