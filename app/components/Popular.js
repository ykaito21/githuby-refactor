import React from "react";
import PropTypes from "prop-types";
import { fetchPopularRepos } from "../utils/api";
import Loading from "./Loading";

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
  state = {
    selectedLang: "All",
    repos: null
  };

  componentDidMount() {
    this.handleLang(this.state.selectedLang);
  }

  handleLang = lang => {
    this.setState(() => ({
      selectedLang: lang,
      repos: null
    }));

    fetchPopularRepos(lang).then(repos => {
      this.setState(() => ({
        repos
      }));
    });
  };
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

export default Popular;
