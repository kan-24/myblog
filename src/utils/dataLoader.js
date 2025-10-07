async function loadJSON(path) {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`)
  }
  return await response.json()
}

export async function loadInitialUsers() {
  return loadJSON('/data/users.json')
}

export async function loadInitialPosts() {
  return loadJSON('/data/posts.json')
}

export async function loadInitialComments() {
  return loadJSON('/data/comments.json')
}

export async function loadInitialVisitors() {
  return loadJSON('/data/visitors.json')
}
