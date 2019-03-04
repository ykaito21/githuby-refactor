const id = "c137568320cfd1480775";
const sec = "31c3dee67b43fca36648f3bb67f61a3c26257146";
const param = `?client_id=${id}&client_secret=${sec}`;

async function getProfile(username) {
  const res = await fetch(`https://api.github.com/users/${username}${param}`);
  return res.json();
}

async function getRepos(username) {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos${param}$per_page=100`
  );
  return res.json();
}

function getStarCount(repos) {
  return repos.reduce(
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

async function getUserData(player) {
  const [profile, repos] = await Promise.all([
    getProfile(player),
    getRepos(player)
  ]);
  return {
    profile,
    score: calculateScore(profile, repos)
  };
}

function sortPlayers(players) {
  return players.sort((a, b) => b.score - a.score);
}

async function battle(players) {
  const results = await Promise.all(players.map(getUserData)).catch(
    handleError
  );
  return results === null ? results : sortPlayers(results);
}

async function fetchPopularRepos(lang) {
  const encodedURI = window.encodeURI(
    `https://api.github.com/search/repositories?q=stars:>1+language:
        ${lang}&sort=stars&order=desc&type=Repositories`
  );

  const res = await fetch(encodedURI).catch(handleError);
  const repos = await res.json();
  return repos.items;
}

export { battle, fetchPopularRepos };
