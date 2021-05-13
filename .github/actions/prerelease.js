/**
 * Create a pre-release 
 * 
 */
const { Octokit } = require("@octokit/action");

const octokit = new Octokit();

async function run() {
  const date = new Date();
  const name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}-${date.getTime()}-beta`

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
  process.exit(1)
}

try {
  run()
} catch(e) {
  octokit.log.error(e)
  process.exit(1)
}