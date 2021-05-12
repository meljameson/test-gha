const { Octokit } = require("@octokit/action")

const octokit = new Octokit()

async function run() {
  // get a list of releases
  const response = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner: 'meljameson',
    repo: 'test-gha',
  })
  
  if (response == null) {
    throw new Error(`Unable to get release data from GitHub. No response: ${JSON.stringify(response)}`)
  }

  // get the latest pre-release
  const releases = response.data

  if (releases == null) {
    throw new Error(`No releases found! releases: ${JSON.stringify(releases)}`)
  }

  const release = releases[0]
  
  if (release == null) {
    throw new Error(`Previous release not found! release: ${JSON.stringify(release)}`)
  }

  const { id, name, prerelease } = release

  if (id == null) {
    throw new Error(`Previous release id not found! release: ${JSON.stringify(release)}`)
  }

  if (prerelease === false) {
    throw new Error(`Previous release was not a pre-release. Only pre-releases can be upgraded to a release. release: ${JSON.stringify(release)}`)
  }

  console.log(`Updating release ${name} (id: ${id}) to latest`)

  await octokit.request('PATCH /repos/{owner}/{repo}/releases/{release_id}', {
    owner: 'meljameson',
    repo: 'test-gha',
    release_id: id,
    prerelease: false,
    tag_name: 'release'
  })
}


run()