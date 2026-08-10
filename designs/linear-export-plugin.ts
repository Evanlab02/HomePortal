import { execFile, execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin, PreviewServer, ViteDevServer } from 'vite'

const run = promisify(execFile)
const LINEAR_API = 'https://api.linear.app/graphql'
export const viewports = [
  { id: '4k', label: '4K', width: 3840, height: 2160 },
  { id: '1440p', label: '1440p', width: 2560, height: 1440 },
  { id: '1080p', label: '1080p', width: 1920, height: 1080 },
  { id: 'laptop-1080p', label: '1080p laptop', width: 1536, height: 864 },
  { id: 'tablet-landscape', label: 'Tablet horizontal', width: 1024, height: 768 },
  { id: 'tablet-portrait', label: 'Tablet vertical', width: 768, height: 1024 },
  { id: 'mobile', label: 'Mobile', width: 390, height: 844 },
] as const
const themes = ['light', 'dark'] as const

type ExportState = { id: string; label: string }
type ExportRequest = {
  issueId: string
  teamId: string
  prototype: { id: string; name: string; states?: ExportState[] }
}
type UploadedScreenshot = {
  state: ExportState
  viewport: (typeof viewports)[number]
  theme: (typeof themes)[number]
  url: string
}

function send(response: ServerResponse, status: number, body: unknown) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(body))
}

function stream(response: ServerResponse, body: unknown) {
  response.write(`${JSON.stringify(body)}\n`)
}

async function readJson(request: IncomingMessage) {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of request) {
    const buffer = Buffer.from(chunk)
    size += buffer.length
    if (size > 1_000_000) throw new Error('Request is too large.')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') as Record<string, unknown>
}

async function linear<T>(apiKey: string, query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(LINEAR_API, {
    method: 'POST',
    headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const payload = await response.json() as { data?: T; errors?: Array<{ message: string }> }
  if (!response.ok || payload.errors?.length || !payload.data) {
    throw new Error(payload.errors?.map(({ message }) => message).join('\n') || `Linear returned ${response.status}.`)
  }
  return payload.data
}

async function fetchTeams(apiKey: string) {
  type TeamsPage = {
    viewer: { name: string }
    teams: { nodes: Array<{ id: string; key: string; name: string }>; pageInfo: { hasNextPage: boolean; endCursor: string | null } }
  }
  const nodes: Array<{ id: string; key: string; name: string }> = []
  let after: string | null = null
  let viewer = ''
  do {
    const data: TeamsPage = await linear<TeamsPage>(apiKey, `query ExportTeams($after: String) { viewer { name } teams(first: 100, after: $after) { nodes { id key name } pageInfo { hasNextPage endCursor } } }`, { after })
    viewer = data.viewer.name
    nodes.push(...data.teams.nodes)
    after = data.teams.pageInfo.hasNextPage ? data.teams.pageInfo.endCursor : null
  } while (after)
  return { viewer: { name: viewer }, teams: { nodes } }
}

function findChrome() {
  if (process.env.PROTOTYPE_CHROME_PATH) return process.env.PROTOTYPE_CHROME_PATH
  for (const candidate of ['google-chrome', 'chromium', 'chromium-browser']) {
    try {
      return execFileSync('which', [candidate], { encoding: 'utf8' }).trim()
    } catch { /* try the next installed browser */ }
  }
  throw new Error('Chrome or Chromium is required to export prototype screenshots.')
}

async function capture(chrome: string, origin: string, prototypeId: string, state: ExportState, viewport: (typeof viewports)[number], theme: (typeof themes)[number], directory: string) {
  const filename = `${state.id || 'default'}-${viewport.id}-${theme}.png`.replace(/[^a-z0-9.-]/gi, '-')
  const output = join(directory, filename)
  const url = new URL(`/capture/${encodeURIComponent(prototypeId)}`, origin)
  url.searchParams.set('theme', theme)
  if (state.id) url.searchParams.set('state', state.id)
  await run(chrome, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', '--virtual-time-budget=2500',
    `--window-size=${viewport.width},${viewport.height}`,
    `--screenshot=${output}`,
    url.toString(),
  ], { maxBuffer: 10_000_000 })
  return output
}

async function upload(apiKey: string, path: string) {
  const file = await readFile(path)
  const metadata = await stat(path)
  const { fileUpload } = await linear<{
    fileUpload: { success: boolean; uploadFile?: { uploadUrl: string; assetUrl: string; headers: Array<{ key: string; value: string }> } }
  }>(apiKey, `mutation FileUpload($contentType: String!, $filename: String!, $size: Int!) {
    fileUpload(contentType: $contentType, filename: $filename, size: $size) {
      success
      uploadFile { uploadUrl assetUrl headers { key value } }
    }
  }`, { contentType: 'image/png', filename: path.split('/').at(-1), size: metadata.size })
  if (!fileUpload.success || !fileUpload.uploadFile) throw new Error('Linear did not provide an upload URL.')
  const headers = new Headers({ 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000' })
  fileUpload.uploadFile.headers.forEach(({ key, value }) => headers.set(key, value))
  const response = await fetch(fileUpload.uploadFile.uploadUrl, { method: 'PUT', headers, body: file })
  if (!response.ok) throw new Error(`Screenshot upload failed with ${response.status}.`)
  return fileUpload.uploadFile.assetUrl
}

export function buildComment(prototypeName: string, screenshots: UploadedScreenshot[]) {
  const states = [...new Map(screenshots.map((screenshot) => [screenshot.state.id, screenshot.state])).values()]
  const lines = [`## Prototype export: ${prototypeName}`, '', 'Screenshots are grouped by prototype state and viewport. Responsive mode is intentionally excluded.', '']
  for (const state of states) {
    lines.push(`### State: ${state.label}`, '')
    for (const viewport of viewports) {
      const light = screenshots.find((shot) => shot.state.id === state.id && shot.viewport.id === viewport.id && shot.theme === 'light')
      const dark = screenshots.find((shot) => shot.state.id === state.id && shot.viewport.id === viewport.id && shot.theme === 'dark')
      if (!light || !dark) continue
      lines.push(`#### ${viewport.label} · ${viewport.width} × ${viewport.height}`, '', '| Light | Dark |', '| --- | --- |', `| ![${prototypeName} · ${state.label} · ${viewport.label} · light](${light.url}) | ![${prototypeName} · ${state.label} · ${viewport.label} · dark](${dark.url}) |`, '')
    }
  }
  return lines.join('\n')
}

function apiKeyFrom(request: IncomingMessage) {
  const key = request.headers.authorization?.trim()
  if (!key) throw new Error('A Linear API key is required.')
  return key
}

function localOrigin(server: ViteDevServer | PreviewServer) {
  const address = server.httpServer?.address()
  if (!address || typeof address === 'string') throw new Error('The prototype server is not listening.')
  return `http://127.0.0.1:${address.port}`
}

function install(server: ViteDevServer | PreviewServer) {
  server.middlewares.use(async (request, response, next) => {
    if (!request.url?.startsWith('/__linear/')) return next()
    if (request.method !== 'POST') return send(response, 405, { error: 'Method not allowed.' })
    try {
      const apiKey = apiKeyFrom(request)
      const body = await readJson(request)
      if (request.url === '/__linear/teams') {
        return send(response, 200, await fetchTeams(apiKey))
      }
      if (request.url === '/__linear/issue') {
        const issueId = typeof body.issueId === 'string' ? body.issueId.trim() : ''
        const teamId = typeof body.teamId === 'string' ? body.teamId.trim() : ''
        const data = await linear<{ issue: { id: string; identifier: string; title: string; url: string; team: { id: string } } | null }>(apiKey, `query ExportIssue($id: String!) { issue(id: $id) { id identifier title url team { id } } }`, { id: issueId })
        if (!data.issue) throw new Error('Linear task not found.')
        if (data.issue.team.id !== teamId) throw new Error('That task does not belong to the selected team.')
        return send(response, 200, data)
      }
      if (request.url !== '/__linear/export') return send(response, 404, { error: 'Not found.' })

      const exportRequest = body as unknown as ExportRequest
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(exportRequest.prototype?.id ?? '')) throw new Error('Invalid prototype.')
      const states = exportRequest.prototype.states?.length ? exportRequest.prototype.states : [{ id: '', label: 'Default' }]
      const total = states.length * viewports.length * themes.length
      response.statusCode = 200
      response.setHeader('Content-Type', 'application/x-ndjson')
      response.setHeader('Cache-Control', 'no-store')
      response.setHeader('X-Accel-Buffering', 'no')
      response.flushHeaders()
      stream(response, { type: 'progress', phase: 'preparing', completed: 0, total, detail: 'Checking the Linear task and preparing captures' })

      let directory = ''
      const uploaded: UploadedScreenshot[] = []
      try {
        const issue = await linear<{ issue: { id: string; identifier: string; title: string; url: string; team: { id: string } } | null }>(apiKey, `query ExportIssue($id: String!) { issue(id: $id) { id identifier title url team { id } } }`, { id: exportRequest.issueId })
        if (!issue.issue || issue.issue.team.id !== exportRequest.teamId) throw new Error('The selected Linear task is no longer available.')
        directory = await mkdtemp(join(tmpdir(), 'homeportal-linear-'))
        const chrome = findChrome()
        for (const state of states) {
          for (const viewport of viewports) {
            for (const theme of themes) {
              const detail = `${state.label} · ${viewport.label} · ${theme === 'light' ? 'Light' : 'Dark'}`
              stream(response, { type: 'progress', phase: 'capturing', completed: uploaded.length, total, detail })
              const image = await capture(chrome, localOrigin(server), exportRequest.prototype.id, state, viewport, theme, directory)
              stream(response, { type: 'progress', phase: 'uploading', completed: uploaded.length, total, detail })
              uploaded.push({ state, viewport, theme, url: await upload(apiKey, image) })
              stream(response, { type: 'progress', phase: 'uploading', completed: uploaded.length, total, detail })
            }
          }
        }
        stream(response, { type: 'progress', phase: 'commenting', completed: total, total, detail: `Posting the formatted comment to ${issue.issue.identifier}` })
        const body = buildComment(exportRequest.prototype.name, uploaded)
        const result = await linear<{ commentCreate: { success: boolean; comment?: { id: string } } }>(apiKey, `mutation ExportComment($input: CommentCreateInput!) { commentCreate(input: $input) { success comment { id } } }`, { input: { issueId: issue.issue.id, body } })
        if (!result.commentCreate.success) throw new Error('Linear did not create the comment.')
        stream(response, { type: 'complete', issue: { identifier: issue.issue.identifier, title: issue.issue.title, url: issue.issue.url }, screenshots: uploaded.length })
      } catch (error) {
        stream(response, { type: 'error', error: error instanceof Error ? error.message : 'Export failed.' })
      } finally {
        if (directory) await rm(directory, { force: true, recursive: true })
        response.end()
      }
    } catch (error) {
      send(response, 400, { error: error instanceof Error ? error.message : 'Export failed.' })
    }
  })
}

export function linearExportPlugin(): Plugin {
  return {
    name: 'homeportal-linear-export',
    configureServer: install,
    configurePreviewServer: install,
  }
}
