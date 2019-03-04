import React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component {
  render() {
    return (
      <div className="home-container">
        <h1>Githuby</h1>
        <h3>Battle your friends...</h3>
        <Link to="/battle" className="button">
          Battle
        </Link>
      </div>
    );
  }
}

export default Home;
