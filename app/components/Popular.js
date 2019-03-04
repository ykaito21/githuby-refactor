const React = require("react");
const PropTypes = require("prop-types");
const api = require("../utils/api");
const Loading = require("./Loading");

// class SelectLang extends React.Component {
//   render() {
//     const languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];

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

function SelectLang({ handleLang, selectedLang }) {
  const languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];
  return (
    <ul className="languages">
      {languages.map(function(item) {
        return (
          <li
            key={item}
            onClick={() => handleLang(item)}
            style={item === selectedLang ? { color: "#d0021b" } : null}
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

function RepoGrid({ repos }) {
  return (
    <ul className="popular-list">
      {repos.map(({ name, stargazers_count, owner, html_url }, index) => (
        <li key={name} className="popular-item">
          <div className="popular-rank">#{index + 1}</div>
          <ul className="space-list-items">
            <li>
              <img src={owner.avatar_url} alt="avatar" className="avatar" />
            </li>
            <li>
              <a href={html_url}>{name}</a>
            </li>
            <li>@{owner.login}</li>
            <li>{stargazers_count} stars</li>
          </ul>
        </li>
      ))}
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
    this.setState(() => ({
      selectedLang: lang,
      repos: null
    }));

    api.fetchPopularRepos(lang).then(repos => {
      this.setState(() => ({
        repos
      }));
    });
  }
  render() {
    const { repos, selectedLang } = this.state;
    return (
      <div>
        <SelectLang handleLang={this.handleLang} selectedLang={selectedLang} />
        {!repos ? <Loading /> : <RepoGrid repos={repos} />}
      </div>
    );
  }
}

module.exports = Popular;
