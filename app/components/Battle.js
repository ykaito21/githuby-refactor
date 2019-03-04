import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import PlayerPreview from "./PlayerPreview";

class PlayerInput extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  static defaultProps = {
    label: "Username"
  };

  state = {
    username: ""
  };

  handleChange = e => {
    const value = e.target.value;
    this.setState(() => ({
      username: value
    }));
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.props.id, this.state.username);
  };

  render() {
    const { username } = this.state;
    const { label } = this.props;
    return (
      <form className="column" onSubmit={this.handleSubmit}>
        <label htmlFor="username" className="header">
          {label}
        </label>
        <input
          type="text"
          id="username"
          palceholder="github username"
          autoComplete="off"
          value={username}
          onChange={this.handleChange}
        />
        <button type="submit" className="button" disabled={!username}>
          Submit
        </button>
      </form>
    );
  }
}

class Battle extends React.Component {
  state = {
    playerOneName: "",
    playerTwoName: "",
    playerOneImage: null,
    playerTwoImage: null
  };

  handleSubmit = (id, username) => {
    this.setState(() => ({
      [id + "Name"]: username,
      [id + "Image"]: `https://github.com/${username}.png?size=200`
    }));
  };

  handleReset = id => {
    this.setState(() => ({
      [id + "Name"]: "",
      [id + "Image"]: null
    }));
  };

  render() {
    const { match } = this.props;
    const {
      playerOneName,
      playerTwoName,
      playerOneImage,
      playerTwoImage
    } = this.state;
    return (
      <div>
        <div className="row">
          {!playerOneName && (
            <PlayerInput
              id="playerOne"
              label="Player One"
              onSubmit={this.handleSubmit}
            />
          )}
          {playerOneImage !== null && (
            <PlayerPreview username={playerOneName} avatar={playerOneImage}>
              <button
                className="reset"
                onClick={() => this.handleReset("playerOne")}
              >
                Reset
              </button>
            </PlayerPreview>
          )}
          {!playerTwoName && (
            <PlayerInput
              id="playerTwo"
              label="Player Two"
              onSubmit={this.handleSubmit}
            />
          )}
          {playerTwoImage !== null && (
            <PlayerPreview username={playerTwoName} avatar={playerTwoImage}>
              <button
                className="reset"
                onClick={() => this.handleReset("playerTwo")}
              >
                Reset
              </button>
            </PlayerPreview>
          )}
        </div>
        {playerOneImage && playerTwoImage && (
          <Link
            to={{
              pathname: match.url + "/results",
              search: `?playerOneName=${playerOneName}&playerTwoName=${playerTwoName}`
            }}
            className="button"
          >
            Battle
          </Link>
        )}
      </div>
    );
  }
}

export default Battle;
