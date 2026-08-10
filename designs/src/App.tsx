import { BrowserRouter, Route, Routes, useParams, useSearchParams } from 'react-router-dom'
import { PrototypeIndex } from './engine/app/PrototypeIndex'
import { NotFound } from './engine/app/NotFound'
import { PrototypeErrorBoundary } from './engine/components/PrototypeErrorBoundary'
import { prototypeRegistry } from './engine/discovery/prototypes'
import { PrototypeWorkbench } from './engine/devtools/PrototypeWorkbench'

function PrototypeRoute() {
  const { prototypeId } = useParams()
  const prototype = prototypeRegistry.prototypes.find(
    ({ meta }) => meta.id === prototypeId,
  )

  if (!prototype) return <NotFound />

  const { Component, meta, states } = prototype
  return (
    <PrototypeWorkbench prototypeId={meta.id} prototypeName={meta.name} relatedTasks={meta.relatedTasks} states={states}>
      {(prototypeState) => (
        <PrototypeErrorBoundary prototypeName={meta.name}>
          <Component prototypeState={prototypeState} />
        </PrototypeErrorBoundary>
      )}
    </PrototypeWorkbench>
  )
}

function CaptureRoute() {
  const { prototypeId } = useParams()
  const [params] = useSearchParams()
  const prototype = prototypeRegistry.prototypes.find(({ meta }) => meta.id === prototypeId)
  if (!prototype) return <NotFound />
  const theme = params.get('theme') === 'dark' ? 'dark' : 'light'
  const state = params.get('state') ?? prototype.states?.[0]?.id
  const { Component, meta } = prototype
  return <div className="capture-page" data-theme={theme} id="prototype-root"><PrototypeErrorBoundary prototypeName={meta.name}><Component prototypeState={state} /></PrototypeErrorBoundary></div>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrototypeIndex
              issues={prototypeRegistry.issues}
              prototypes={prototypeRegistry.prototypes}
            />
          }
        />
        <Route path="/prototypes/:prototypeId/*" element={<PrototypeRoute />} />
        <Route path="/capture/:prototypeId" element={<CaptureRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
