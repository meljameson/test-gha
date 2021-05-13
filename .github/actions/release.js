const { Octokit } = require('@octokit/action')

const octokit = new Octokit()

/**
 * https://docs.github.com/en/rest/reference/repos#list-releases
 * @returns Array<Object>
 */
async function getAllReleases() {
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

/**
 * 
 * @returns {
      url: string,
      assets_url: string,
      upload_url: string,
      html_url: string,
      id: number,
      author: Object,
      node_id: string,
      tag_name: string,
      target_commitish: string,
      name: string,
      draft: boolean,
      prerelease: boolean,
      created_at: string,
      published_at: string,
      assets: array,
      tarball_url: string,
      zipball_url: string,
      body: string,
    }
 */
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

async function run() {
  const { id, name, tag_name, prerelease } = await getLastPreRelease()

  if (id == null) {
    throw new Error(`Previous release id not found! release: ${JSON.stringify(release)}`)
  }

  if (prerelease === false) {
    throw new Error(`Previous release was not a pre-release. Only pre-releases can be upgraded to a release. release: ${JSON.stringify(release)}`)
  }

  console.log(`Updating release ${name}:${tag_name} (id: ${id}) to latest`)

  await octokit.request('PATCH /repos/{owner}/{repo}/releases/{release_id}', {
    owner: 'meljameson',
    repo: 'test-gha',
    release_id: id,
    prerelease: false,
    tag_name: 'release'
  })
}

run()