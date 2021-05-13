const { Octokit } = require("@octokit/action");

const octokit = new Octokit();

async function run() {
  const name = `${new Date()}-rc`;
  await octokit.request('POST /repos/{owner}/{repo}/releases', {
    owner: 'meljameson',
    repo: 'test-gha',
    tag_name: name,
    name,
    prerelease: true,
    body: "\
    * helloooooo\
    * testing\
    ",
  })
  octokit.log.error(`Hellooooo`)
}

run()