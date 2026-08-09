import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
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
    <PrototypeWorkbench prototypeName={meta.name} states={states}>
      {(prototypeState) => (
        <PrototypeErrorBoundary prototypeName={meta.name}>
          <Component prototypeState={prototypeState} />
        </PrototypeErrorBoundary>
      )}
    </PrototypeWorkbench>
  )
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
