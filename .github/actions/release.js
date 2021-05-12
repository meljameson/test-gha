const { Octokit } = require("@octokit/action")

const octokit = new Octokit()

async function run() {
  const releases = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner: 'meljameson',
    repo: 'test-gha',
  })

  console.log({releases})

  const tags = await octokit.request('GET /repos/{owner}/{repo}/tags', {
    owner: 'octocat',
    repo: 'hello-world'
  })

  console.log({tags})
  
  if (releases == null) {
    throw new Error('No releases found!')
  }

  const release = releases[0]

  if (release == null) {
    throw new Error('Previous release not found!')
  }

  const { release_id, name, prerelease } = release

  if (release_id == null) {
    throw new Error('Previous release id not found!')
  }

  if (prerelease === false) {
    throw new Error('Previous release was not a pre-release. Only pre-releases can be upgraded to a release.')
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