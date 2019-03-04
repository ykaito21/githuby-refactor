var React = require("react");
var Link = require("react-router-dom").Link;

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

module.exports = Home;
