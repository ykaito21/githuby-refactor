var axios = require("axios");

var id = "c137568320cfd1480775";
var sec = "31c3dee67b43fca36648f3bb67f61a3c26257146";
var param = "?client_id=" + id + "&client_secret=" + sec;

function getProfile(username) {
  return axios
    .get("https://api.github.com/users/" + username + param)
    .then(function(user) {
      return user.data;
    });
}

function getRepos(username) {
  return axios.get(
    "https://api.github.com/users/" +
      username +
      "/repos" +
      param +
      "$per_page=100"
  );
}

function getStarCount(repos) {
  return repos.data.reduce(function(count, repos) {
    return count + repos.stargazers_count;
  }, 0);
}

function calculateScore(profile, repos) {
  var followers = profile.followers;
  var totalStars = getStarCount(repos);

  return followers * 3 + totalStars;
}

function handleError(err) {
  console.warn(err);
  return null;
}

function getUserData(player) {
  return axios.all([getProfile(player), getRepos(player)]).then(function(data) {
    var profile = data[0];
    var repos = data[1];
    return {
      profile: profile,
      score: calculateScore(profile, repos)
    };
  });
}

function sortPlayers(players) {
  return players.sort(function(a, b) {
    return b.score - a.score;
  });
}

module.exports = {
  battle: function(players) {
    return axios
      .all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError);
  },

  fetchPopularRepos: function(lang) {
    var encodedURI = window.encodeURI(
      "https://api.github.com/search/repositories?q=stars:>1+language:" +
        lang +
        "&sort=stars&order=desc&type=Repositories"
    );
    return axios.get(encodedURI).then(function(res) {
      return res.data.items;
    });
  }
};
