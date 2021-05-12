const { Octokit } = require("@octokit/action");

const octokit = new Octokit();

async function run() {
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
}

run()