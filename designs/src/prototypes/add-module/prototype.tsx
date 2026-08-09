import { useState } from 'react'
import { ArrowLeft, FileCode2, FileUp, Plus } from 'lucide-react'
import { AuthenticatedAppShell } from '../../prototype-support/authenticated/AuthenticatedAppShell'

export function AddModulePrototype() {
  const [name, setName] = useState('')
  const [source, setSource] = useState<'template' | 'upload'>('template')
  const moduleName = name || 'module-name'

  return (
    <AuthenticatedAppShell>
      <div className="add-module">
        <a className="custom-modules-back" href="/prototypes/custom-modules" target="_top"><ArrowLeft aria-hidden="true" />Custom modules</a>
        <header className="add-module__heading"><h1>Add module</h1><p>Create a module and its initial Docker Compose file.</p></header>
        <section aria-labelledby="module-details-heading" className="add-module__section">
          <div className="add-module__section-heading"><h2 id="module-details-heading">Module details</h2><p>The module name becomes its folder inside <code>custom</code>.</p></div>
          <form className="add-module__form" onSubmit={(event) => event.preventDefault()}>
            <label><span>Module name <small>Required</small></span><input aria-describedby="module-name-hint module-path-preview" autoComplete="off" onChange={(event) => setName(event.target.value)} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="e.g. monitoring" required type="text" value={name} /><small id="module-name-hint">Use lowercase letters, numbers, and hyphens.</small></label>
            <label><span>Description</span><textarea aria-describedby="module-description-hint" name="description" placeholder="Describe what this module runs and when you use it." rows={4} /><small id="module-description-hint">Shown in the module list and detail drawer.</small></label>
            <div className="add-module__path" id="module-path-preview"><FileCode2 aria-hidden="true" /><span>File path</span><code>custom/{moduleName}/compose.yml</code></div>
            <fieldset className="add-module__source"><legend>Compose file source <small>Required</small></legend><div><button aria-pressed={source === 'template'} onClick={() => setSource('template')} type="button"><FileCode2 aria-hidden="true" /><span><strong>Use HomePortal template</strong><small>Start with the provided Compose file.</small></span></button><button aria-pressed={source === 'upload'} onClick={() => setSource('upload')} type="button"><FileUp aria-hidden="true" /><span><strong>Upload Compose file</strong><small>Use an existing YAML file.</small></span></button></div></fieldset>
            {source === 'template' ? <div className="add-module__template"><FileCode2 aria-hidden="true" /><div><strong>HomePortal starter template</strong><p>A basic application service with the recommended restart policy will be created at this path.</p></div></div> : <label className="add-module__upload"><span>Compose file <small>Required</small></span><input accept=".yml,.yaml,application/x-yaml,text/yaml" name="composeFile" required type="file" /><small>Select a <code>.yml</code> or <code>.yaml</code> file.</small></label>}
            <div className="add-module__actions"><a href="/prototypes/custom-modules" target="_top">Cancel</a><button type="submit"><Plus aria-hidden="true" />Add module</button></div>
          </form>
        </section>
      </div>
    </AuthenticatedAppShell>
  )
}
