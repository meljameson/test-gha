const { Octokit } = require("@octokit/action")

const octokit = new Octokit()

async function run() {
  const response = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner: 'meljameson',
    repo: 'test-gha',
  })
  
  if (response == null) {
    throw new Error(`Unable to get release data from GitHub. No response: ${response}`)
  }

  const releases = response.data

  if (releases == null) {
    throw new Error(`No releases found! releases: ${releases}`)
  }
  
  if (release == null) {
    throw new Error(`Previous release not found! release: ${release}`)
  }

  const { release_id, name, prerelease } = release

  if (release_id == null) {
    throw new Error(`Previous release id not found! release: ${release}`)
  }

  if (prerelease === false) {
    throw new Error(`Previous release was not a pre-release. Only pre-releases can be upgraded to a release. release: ${release}`)
  }

  console.log(`Updating release ${name} (id: ${release_id}) to latest`)

  await octokit.request('PATCH /repos/{owner}/{repo}/releases/{release_id}', {
    owner: 'meljameson',
    repo: 'test-gha',
    release_id,
    prerelease: false,
    tag_name: 'release'
  })
}


run()