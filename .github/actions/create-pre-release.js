const { Octokit } = require("@octokit/action");

const octokit = new Octokit();

await octokit.request('POST /repos/{owner}/{repo}/releases', {
  owner: 'meljameson',
  repo: 'test-gha',
  tag_name: 'v0',
  prerelease: true,
  body: `
  * helloooooo
  * testing
  `,
})