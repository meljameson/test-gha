/**
 * take stock of changes
 * tell slack of changed files
 * stash
 * git checkout release
 */
const { exec } = require('child_process')
const { Octokit } = require('octokit')

 async function getAllReleases() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  // get list of releases
  const response = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner: 'meljameson',
    repo: 'test-gha',
  })
  
  if (response == null) {
    throw new Error(`Unable to get release data from GitHub. No response: ${JSON.stringify(response)}`)
  }

  return response.data
}

async function getLastPreRelease() {
  // get the latest pre-release
  const releases = await getAllReleases()

  if (releases == null) {
    throw new Error(`No releases found! releases: ${JSON.stringify(releases)}`)
  }

  // the last release is the first in the release list
  const release = releases[0]
  
  if (release == null) {
    throw new Error(`Previous release not found! release: ${JSON.stringify(release)}`)
  }

  return release
}

function execGitCmd(cmd) {
    return new Promise((resolve, reject) => {
        console.log('\x1b[36m%s\x1b[0m', `"${cmd}" is executing...`);
        exec(cmd, function (error, stdout, stderr) {
            if (error) reject(error)
            if (stderr) reject(stderr)
            resolve(stdout)
        });
    })
}

(async function checkoutPrerelease() {
  const prestash = await execGitCmd('git diff --name-only && git diff --name-only --staged | sort | uniq')
  console.log({prestash})
  
  await execGitCmd('git stash')

  const poststash = await execGitCmd('git diff --name-only && git diff --name-only --staged | sort | uniq')
  console.log({poststash})

  const latest = await getLastPreRelease();
  console.log({latest})
})()