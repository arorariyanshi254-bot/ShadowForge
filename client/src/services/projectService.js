import { getToken } from './authService'

const API_BASE = '/api/projects'

export const STATUS_STEPS = ['Configured', 'Captured', 'Schema Ready', 'Mock Ready', 'Active']

function getHeaders() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function getProjects() {
  const response = await fetch(API_BASE, {
    headers: getHeaders(),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to fetch projects')
  }
  return await response.json()
}

export async function getProjectById(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    headers: getHeaders(),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to fetch project')
  }
  return await response.json()
}

export async function createProject({ name, targetUrl, method, headers }) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, targetUrl, method, headers }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to create project')
  }
  return await response.json()
}

export async function updateProject(id, updates) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updates),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to update project')
  }
  return await response.json()
}

export async function deleteProject(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to delete project')
  }
  return await response.json()
}

export async function saveFaultConfig(id, config) {
  const response = await fetch(`${API_BASE}/${id}/faults`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(config),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to save fault config')
  }
  return await response.json()
}

export async function getProjectStats() {
  const response = await fetch(`${API_BASE}/stats`, {
    headers: getHeaders(),
  })
  if (!response.ok) {
    return {
      totalProjects: 0,
      activeMocks: 0,
      totalRequests: 0,
      failedRequests: 0,
    }
  }
  return await response.json()
}

// --- Sample / Helper Utilities ---

export function getRequestLogs(project) {
  if (!project) return []
  const readyIndex = STATUS_STEPS.indexOf('Mock Ready')
  const projectIndex = STATUS_STEPS.indexOf(project.status)
  if (projectIndex < readyIndex) return []

  return generateSampleLogs(project)
}

function seededRandom(seed) {
  let value = seed
  return function next() {
    value = (value * 1103515245 + 12345) & 0x7fffffff
    return value / 0x7fffffff
  }
}

function hashString(str) {
  let hash = 0
  for (let i = 0; i < (str || '').length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0x7fffffff
  }
  return hash
}

function generateSampleLogs(project) {
  const random = seededRandom(hashString(project.id || project._id))
  const methods = ['GET', 'GET', 'GET', 'POST', 'PUT', 'DELETE']
  const errorEnabled = project.faultConfig?.error?.enabled
  const errorCode = project.faultConfig?.error?.code || 500

  let path = '/'
  try {
    path = new URL(project.targetUrl).pathname || '/'
  } catch {
    // URL fallback
  }

  const logs = []
  for (let i = 0; i < 8; i++) {
    const isError = errorEnabled && random() < 0.3
    const method = methods[Math.floor(random() * methods.length)]
    const minutesAgo = Math.floor(random() * 240)

    logs.push({
      id: `${project.id || project._id}-log-${i}`,
      timestamp: Date.now() - minutesAgo * 60 * 1000,
      method,
      statusCode: isError ? errorCode : method === 'POST' ? 201 : 200,
      responseTime: Math.floor(60 + random() * 240),
      faultApplied: isError,
      path,
    })
  }

  return logs.sort((a, b) => b.timestamp - a.timestamp)
}

export function getSampleSchema() {
  return {
    id: 101,
    name: 'Example User',
    email: 'user@example.com',
    address: {
      city: 'Delhi',
      country: 'India',
    },
    roles: ['developer', 'tester'],
  }
}
