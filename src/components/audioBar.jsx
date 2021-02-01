import React from "react";
const AudioBar = (props) => {
  const { audios, btnTheme, showAudioBar, audioTrack } = props;
  let numOfAudios = 0;
  Object.keys(audios).map((key) => (audios[key] ? (numOfAudios += 1) : null));
  return showAudioBar ? (
    <nav className="navbar fixed-bottom navbar-light bg-light justify-content-center">
      <figure style={{ margin: 0 }}>
        <audio controls autoPlay src={audioTrack !== "" ? audioTrack : null}>
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      </figure>
      <br />
      <div className="d-flex w-100 justify-content-between">
        {Object.keys(audios).map((key) =>
          audios[key] ? (
            <span
              key={key}
              className={"btn btn-small " + btnTheme}
              onClick={() => props.playAudio(key)}
            >
              {key.toUpperCase()}
            </span>
          ) : null
        )}
        {Object.keys(audios).length === 0 || numOfAudios === 0
          ? "No audios"
          : null}
      </div>
    </nav>
  ) : null;
};

export default AudioBar;
