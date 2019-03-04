var React = require("react");
var PropTypes = require("prop-types");
var api = require("../utils/api");
var Loading = require("./Loading");

// class SelectLang extends React.Component {
//   render() {
//     var languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];

//     return (
//       <ul className="languages">
//         {languages.map(function(item) {
//           return (
//             <li
//               key={item}
//               onClick={this.props.handleLang.bind(null, item)}
//               style={
//                 item === this.props.selectedLang ? { color: "#d0021b" } : null
//               }
//             >
//               {item}
//             </li>
//           );
//         }, this)}
//       </ul>
//     );
//   }
// }

function SelectLang(props) {
  var languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];
  return (
    <ul className="languages">
      {languages.map(function(item) {
        return (
          <li
            key={item}
            onClick={props.handleLang.bind(null, item)}
            style={item === props.selectedLang ? { color: "#d0021b" } : null}
          >
            {item}
          </li>
        );
      })}
    </ul>
  );
}

SelectLang.propTypes = {
  selectedLang: PropTypes.string.isRequired,
  handleLang: PropTypes.func.isRequired
};

function RepoGrid(props) {
  return (
    <ul className="popular-list">
      {props.repos.map(function(repo, index) {
        return (
          <li key={repo.name} className="popular-item">
            <div className="popular-rank">#{index + 1}</div>
            <ul className="space-list-items">
              <li>
                <img
                  src={repo.owner.avatar_url}
                  alt="avatar"
                  className="avatar"
                />
              </li>
              <li>
                <a href={repo.html_url}>{repo.name}</a>
              </li>
              <li>@{repo.owner.login}</li>
              <li>{repo.stargazers_count} stars</li>
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
};

class Popular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "All",
      repos: null
    };
    this.handleLang = this.handleLang.bind(this);
  }

  componentDidMount() {
    this.handleLang(this.state.selectedLang);
  }

  handleLang(lang) {
    this.setState(function() {
      return {
        selectedLang: lang,
        repos: null
      };
    });

    api.fetchPopularRepos(lang).then(
      function(repos) {
        this.setState(function() {
          return {
            repos: repos
          };
        });
      }.bind(this)
    );
  }
  render() {
    return (
      <div>
        <SelectLang
          handleLang={this.handleLang}
          selectedLang={this.state.selectedLang}
        />
        {!this.state.repos ? (
          <Loading />
        ) : (
          <RepoGrid repos={this.state.repos} />
        )}
      </div>
    );
  }
}

module.exports = Popular;
