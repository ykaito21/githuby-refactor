const axios = require("axios");

const id = "c137568320cfd1480775";
const sec = "31c3dee67b43fca36648f3bb67f61a3c26257146";
const param = `?client_id=${id}&client_secret=${sec}`;

function getProfile(username) {
  return axios
    .get(`https://api.github.com/users/${username}${param}`)
    .then(({ data }) => data);
}

function getRepos(username) {
  return axios.get(
    `https://api.github.com/users/${username}/repos${param}$per_page=100`
  );
}

function getStarCount(repos) {
  return repos.data.reduce(
    (count, { stargazers_count }) => count + stargazers_count,
    0
  );
}

function calculateScore({ followers }, repos) {
  return followers * 3 + getStarCount(repos);
}

function handleError(err) {
  console.warn(err);
  return null;
}

function getUserData(player) {
  return Promise.all([getProfile(player), getRepos(player)]).then(
    ([profile, repos]) => ({
      profile,
      score: calculateScore(profile, repos)
    })
  );
}

function sortPlayers(players) {
  return players.sort((a, b) => b.score - a.score);
}

module.exports = {
  battle: players => {
    return Promise.all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError);
  },

  fetchPopularRepos: lang => {
    const encodedURI = window.encodeURI(
      `https://api.github.com/search/repositories?q=stars:>1+language:
        ${lang}&sort=stars&order=desc&type=Repositories`
    );
    return axios.get(encodedURI).then(({ data }) => data.items);
  }
};
