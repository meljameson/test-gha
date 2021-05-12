const { Octokit } = require("@octokit/action");

const octokit = new Octokit();

await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
  owner: 'meljameson',
  repo: 'test-gha'
})