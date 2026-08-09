import { useLayoutEffect, useRef, useState } from 'react'
import Editor, { loader, type BeforeMount } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/editor/editor.api'
import EditorWorker from 'monaco-editor/editor/editor.worker?worker'
import { ArrowLeft, CircleAlert, FileCode2, Save } from 'lucide-react'
import { AuthenticatedAppShell } from '../../prototype-support/authenticated/AuthenticatedAppShell'

self.MonacoEnvironment = { getWorker: () => new EditorWorker() }
loader.config({ monaco })

const composeFile = `name: monitoring

services:
  prometheus:
    image: prom/prometheus:v3.5.0
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:12.1.0
    restart: unless-stopped
    environment:
      GF_SECURITY_ADMIN_USER: admin
    volumes:
      - grafana-data:/var/lib/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus

  node-exporter:
    image: prom/node-exporter:v1.9.1
    restart: unless-stopped
    ports:
      - "9100:9100"

volumes:
  grafana-data:
`

const configureYaml: BeforeMount = (monacoInstance) => {
  if (monacoInstance.languages.getLanguages().some((language: { id: string }) => language.id === 'yaml')) return
  monacoInstance.languages.register({ id: 'yaml' })
  monacoInstance.languages.setMonarchTokensProvider('yaml', {
    tokenizer: {
      root: [
        [/^\s*[\w-]+(?=\s*:)/, 'key'],
        [/#.*$/, 'comment'],
        [/"[^"\\]*(?:\\.[^"\\]*)*"/, 'string'],
        [/\b(true|false|null)\b/, 'keyword'],
        [/\b\d+(?:\.\d+)?\b/, 'number'],
      ],
    },
  })
}

export function EditModulePrototype() {
  const [theme, setTheme] = useState<'vs' | 'vs-dark'>('vs')
  const [dirty, setDirty] = useState(false)
  const [position, setPosition] = useState({ lineNumber: 1, column: 1 })
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const shell = rootRef.current?.closest('.authenticated-app-shell')
    if (!shell) return
    const syncTheme = () => setTheme(shell.getAttribute('data-theme') === 'dark' ? 'vs-dark' : 'vs')
    syncTheme()
    const observer = new MutationObserver(syncTheme)
    observer.observe(shell, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return (
    <AuthenticatedAppShell>
      <section className="authenticated-app-shell__mobile-notice">
        <span><CircleAlert aria-hidden="true" /></span>
        <h1>Editor unavailable on mobile</h1>
        <p>Compose files need a larger editing workspace. Open this module on a tablet or computer.</p>
      </section>
      <div className="custom-module-editor" ref={rootRef}>
        <header className="custom-module-editor__header">
          <div>
            <a href="/prototypes/custom-modules" target="_top"><ArrowLeft aria-hidden="true" />Custom modules</a>
            <h1>Edit monitoring</h1>
            <nav aria-label="File path"><span>custom</span><b>/</b><span>monitoring</span><b>/</b><strong>compose.yml</strong></nav>
          </div>
          <button onClick={() => setDirty(false)} type="button"><Save aria-hidden="true" />Save file</button>
        </header>
        <section aria-labelledby="compose-editor-heading" className="custom-module-editor__surface">
          <h2 className="sr-only" id="compose-editor-heading">Compose file editor</h2>
          <div className="custom-module-editor__tab"><FileCode2 aria-hidden="true" /><span>compose.yml</span>{dirty && <i aria-label="Unsaved changes" />}</div>
          <Editor
            beforeMount={configureYaml}
            defaultLanguage="yaml"
            defaultValue={composeFile}
            height="100%"
            options={{
              automaticLayout: true,
              fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
              fontSize: 14,
              minimap: { enabled: true },
              padding: { top: 18, bottom: 18 },
              renderLineHighlight: 'all',
              scrollBeyondLastLine: false,
              tabSize: 2,
            }}
            onMount={(editor) => {
              (document.activeElement as HTMLElement | null)?.blur()
              const main = rootRef.current?.closest('.authenticated-app-shell__main')
              if (main) main.scrollTop = 0
              window.scrollTo(0, 0)
              editor.onDidChangeCursorPosition((event) => setPosition(event.position))
            }}
            onChange={() => setDirty(true)}
            path="file:///custom/monitoring/compose.yml"
            theme={theme}
          />
          <footer><span>YAML</span><span>Spaces: 2</span><span>UTF-8</span><span>Ln {position.lineNumber}, Col {position.column}</span></footer>
        </section>
      </div>
    </AuthenticatedAppShell>
  )
}
