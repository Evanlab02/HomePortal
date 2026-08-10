import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, ExternalLink, KeyRound, LoaderCircle, Upload, X } from 'lucide-react'
import type { PrototypeState } from '../types/prototype'

type Team = { id: string; key: string; name: string }
type Issue = { id: string; identifier: string; title: string; url: string }
type ExportProgress = { phase: 'preparing' | 'capturing' | 'uploading' | 'commenting'; completed: number; total: number; detail: string }
type ExportEvent = ({ type: 'progress' } & ExportProgress) | { type: 'complete'; issue: Issue; screenshots: number } | { type: 'error'; error: string }

async function post<T>(path: string, apiKey: string, body: Record<string, unknown> = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (apiKey) headers.Authorization = apiKey
  const response = await fetch(path, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const payload = await response.json() as T & { error?: string }
  if (!response.ok) throw new Error(payload.error || 'Linear request failed.')
  return payload
}

async function streamExport(apiKey: string, body: Record<string, unknown>, onProgress: (progress: ExportProgress) => void) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (apiKey) headers.Authorization = apiKey
  const response = await fetch('/__linear/export', { method: 'POST', headers, body: JSON.stringify(body) })
  if (!response.ok) {
    const payload = await response.json() as { error?: string }
    throw new Error(payload.error || 'Could not start the Linear export.')
  }
  if (!response.body) throw new Error('Could not start the Linear export.')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let result: { issue: Issue; screenshots: number } | null = null
  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value, { stream: !done })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line) continue
      const event = JSON.parse(line) as ExportEvent
      if (event.type === 'progress') onProgress(event)
      if (event.type === 'error') throw new Error(event.error)
      if (event.type === 'complete') result = { issue: event.issue, screenshots: event.screenshots }
    }
    if (done) break
  }
  if (!result) throw new Error('The export ended before Linear confirmed the comment.')
  return result
}

export function LinearExportDialog({ hasServerKey, onClose, prototypeId, prototypeName, states }: {
  hasServerKey: boolean
  onClose: () => void
  prototypeId: string
  prototypeName: string
  states?: PrototypeState[]
}) {
  const [step, setStep] = useState<'connect' | 'destination' | 'review' | 'exporting' | 'done'>('connect')
  const [apiKey, setApiKey] = useState('')
  const [keySource, setKeySource] = useState<'server' | 'manual'>(hasServerKey ? 'server' : 'manual')
  const [viewer, setViewer] = useState('')
  const [teams, setTeams] = useState<Team[]>([])
  const [teamId, setTeamId] = useState('')
  const [issueId, setIssueId] = useState('')
  const [issue, setIssue] = useState<Issue | null>(null)
  const [result, setResult] = useState<{ issue: Issue; screenshots: number } | null>(null)
  const [progress, setProgress] = useState<ExportProgress | null>(null)
  const [error, setError] = useState('')
  const [selectedStateIds, setSelectedStateIds] = useState(() => states?.map(({ id }) => id) ?? [])
  const dialogRef = useRef<HTMLDivElement>(null)
  const keyRef = useRef<HTMLInputElement>(null)
  const selectedStates = states?.filter(({ id }) => selectedStateIds.includes(id))
  const stateCount = states?.length ? selectedStates!.length : 1
  const screenshotCount = 7 * 2 * stateCount
  const activeApiKey = keySource === 'manual' ? apiKey : ''

  const close = useCallback(() => {
    setApiKey('')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (step === 'connect' && keySource === 'manual') keyRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && step !== 'exporting') close()
      const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, a[href]') ?? []
      if (event.key !== 'Tab' || !controls.length) return
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [close, keySource, step])

  useEffect(() => {
    if (hasServerKey) setKeySource('server')
  }, [hasServerKey])

  const connect = async () => {
    setError('')
    try {
      const data = await post<{ viewer: { name: string }; teams: { nodes: Team[] } }>('/__linear/teams', activeApiKey)
      setViewer(data.viewer.name)
      setTeams(data.teams.nodes)
      setTeamId(data.teams.nodes[0]?.id ?? '')
      setStep('destination')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not connect to Linear.')
    }
  }

  const findIssue = async () => {
    setError('')
    try {
      const data = await post<{ issue: Issue }>('/__linear/issue', activeApiKey, { issueId, teamId })
      setIssue(data.issue)
      setStep('review')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not find that Linear task.')
    }
  }

  const exportPrototype = async () => {
    if (!issue) return
    setError('')
    setProgress({ phase: 'preparing', completed: 0, total: screenshotCount, detail: 'Starting the export' })
    setStep('exporting')
    try {
      const data = await streamExport(activeApiKey, {
        issueId: issue.identifier,
        teamId,
        prototype: { id: prototypeId, name: prototypeName, states: selectedStates },
      }, setProgress)
      setResult(data)
      setStep('done')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not export the prototype.')
      setStep('connect')
    } finally {
      setApiKey('')
    }
  }

  return (
    <div className="linear-export-layer">
      <button aria-label="Close Linear export" className="linear-export-layer__scrim" disabled={step === 'exporting'} onClick={close} type="button" />
      <div aria-labelledby="linear-export-title" aria-modal="true" className="linear-export" ref={dialogRef} role="dialog">
        <header><div><p>Export to Linear</p><h2 id="linear-export-title">{prototypeName}</h2></div><button aria-label="Close export" disabled={step === 'exporting'} onClick={close} type="button"><X aria-hidden="true" /></button></header>

        {step === 'connect' && <form onSubmit={(event) => { event.preventDefault(); void connect() }}><div className="linear-export__step"><span>1</span><div><strong>Connect securely</strong><small>{hasServerKey ? 'Use the server connection or provide a key for this export.' : 'Enter a personal Linear API key for this export only.'}</small></div></div>{hasServerKey && <fieldset className="linear-export__key-source"><legend>Connection</legend><label><input checked={keySource === 'server'} name="key-source" onChange={() => setKeySource('server')} type="radio" /><span>Use server key</span></label><label><input checked={keySource === 'manual'} name="key-source" onChange={() => setKeySource('manual')} type="radio" /><span>Provide a key manually</span></label></fieldset>}{keySource === 'manual' && <label><span>Linear API key</span><input autoComplete="off" onChange={(event) => setApiKey(event.target.value)} ref={keyRef} required spellCheck={false} type="password" value={apiKey} /></label>}<div className="linear-export__privacy"><KeyRound aria-hidden="true" /><p>{keySource === 'server' ? 'The configured key stays on the server and is never sent to the browser.' : 'The key stays in memory, is sent only to the local export bridge, and is cleared immediately after export or when you close this dialog.'}</p></div>{error && <p className="linear-export__error" role="alert">{error}</p>}<footer><button disabled={keySource === 'manual' && !apiKey.trim()} type="submit">Connect to Linear</button></footer></form>}

        {step === 'destination' && <form onSubmit={(event) => { event.preventDefault(); void findIssue() }}><div className="linear-export__step"><span>2</span><div><strong>Choose the task</strong><small>Connected as {viewer}. Select a team, then enter the task identifier.</small></div></div><label><span>Team</span><select onChange={(event) => setTeamId(event.target.value)} required value={teamId}>{teams.map((team) => <option key={team.id} value={team.id}>{team.key} · {team.name}</option>)}</select></label><label><span>Task identifier</span><input autoCapitalize="characters" onChange={(event) => setIssueId(event.target.value.toUpperCase())} placeholder="e.g. HOM-123" required value={issueId} /></label>{error && <p className="linear-export__error" role="alert">{error}</p>}<footer><button className="linear-export__secondary" onClick={() => setStep('connect')} type="button">Back</button><button disabled={!teamId || !issueId.trim()} type="submit">Find task</button></footer></form>}

        {step === 'review' && issue && <div className="linear-export__review"><div className="linear-export__step"><span>3</span><div><strong>Review export</strong><small>Confirm the destination and capture set.</small></div></div><section><p>{issue.identifier}</p><h3>{issue.title}</h3></section>{states && states.length > 0 && <fieldset className="linear-export__states"><legend>States to export</legend>{states.length > 1 && <label><input checked={selectedStateIds.length === states.length} onChange={(event) => setSelectedStateIds(event.target.checked ? states.map(({ id }) => id) : [])} type="checkbox" /><span>All states</span></label>}<div>{states.map((state) => <label key={state.id}><input checked={selectedStateIds.includes(state.id)} onChange={(event) => setSelectedStateIds((current) => event.target.checked ? [...current, state.id] : current.filter((id) => id !== state.id))} type="checkbox" /><span>{state.label}</span></label>)}</div>{stateCount === 0 && <small>Select at least one state.</small>}</fieldset>}<dl><div><dt>Viewports</dt><dd>7 fixed modes</dd></div><div><dt>Themes</dt><dd>Light and dark</dd></div><div><dt>States</dt><dd>{stateCount}</dd></div><div><dt>Screenshots</dt><dd>{screenshotCount}</dd></div></dl><p className="linear-export__note">Responsive mode is excluded. One neatly structured comment will group images by state and viewport.</p>{error && <p className="linear-export__error" role="alert">{error}</p>}<footer><button className="linear-export__secondary" onClick={() => setStep('destination')} type="button">Back</button><button disabled={stateCount === 0} onClick={() => void exportPrototype()} type="button"><Upload aria-hidden="true" />Export {screenshotCount} screenshots</button></footer></div>}

        {step === 'exporting' && progress && <div aria-live="polite" className="linear-export__progress"><LoaderCircle aria-hidden="true" /><h3>{{ preparing: 'Preparing export', capturing: 'Capturing screenshot', uploading: 'Uploading screenshot', commenting: 'Posting Linear comment' }[progress.phase]}</h3><div className="linear-export__progress-count"><strong>{progress.completed} of {progress.total}</strong><span>screenshots uploaded</span></div><progress aria-label={`${progress.completed} of ${progress.total} screenshots uploaded`} max={progress.total} value={progress.completed} /><p>{progress.detail}</p><small>Keep this window open until the export is complete.</small></div>}

        {step === 'done' && result && <div className="linear-export__done"><span><Check aria-hidden="true" /></span><h3>Prototype exported</h3><p>Added {result.screenshots} screenshots to {result.issue.identifier}.</p><a href={result.issue.url} rel="noreferrer" target="_blank">Open task in Linear<ExternalLink aria-hidden="true" /></a><button onClick={close} type="button">Done</button></div>}
      </div>
    </div>
  )
}
