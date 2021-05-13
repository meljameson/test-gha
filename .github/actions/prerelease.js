/**
 * Create a release with prerelease: true in GitHub UI
 * 
 */
const { Octokit } = require("@octokit/action");

const octokit = new Octokit();

async function run() {
  const date = new Date();
  const name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}-${date.getTime()}-alpha`

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

try {
  run()
} catch(e) {
  octokit.log.error(e)
}