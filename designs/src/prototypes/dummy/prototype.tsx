import { useState } from 'react'
import type { ReactNode } from 'react'
import { Activity, Box, CheckCircle2, ChevronRight, Circle, Gauge, Server } from 'lucide-react'
import { Link, Route, Routes } from 'react-router-dom'

const services = [
  { name: 'homeportal-web', image: 'homeportal:dev', state: 'Running', cpu: '2.8%', memory: '284 MB' },
  { name: 'homeportal-db', image: 'postgres:17', state: 'Running', cpu: '0.6%', memory: '192 MB' },
  { name: 'homeportal-cache', image: 'redis:8', state: 'Running', cpu: '0.2%', memory: '48 MB' },
]

function Overview() {
  const [refreshes, setRefreshes] = useState(0)

  return (
    <div className="dummy__content">
      <section className="dummy__summary">
        <div>
          <h1>Everything is steady.</h1>
          <p>Three local services are running with no recent restarts.</p>
        </div>
        <button className="btn btn-neutral" onClick={() => setRefreshes((value) => value + 1)} type="button">
          <Activity aria-hidden="true" /> Refresh{refreshes > 0 ? ` · ${refreshes}` : ''}
        </button>
      </section>

      <section className="dummy__readings" aria-label="Current readings">
        <div><Gauge aria-hidden="true" /><span>CPU load</span><strong>3.6%</strong></div>
        <div><Server aria-hidden="true" /><span>Memory</span><strong>524 MB</strong></div>
        <div><CheckCircle2 aria-hidden="true" /><span>Healthy</span><strong>3 / 3</strong></div>
      </section>

      <section className="dummy__services" aria-labelledby="services-heading">
        <div className="dummy__section-heading">
          <div><h2 id="services-heading">Services</h2><p>Illustrative data for this disposable prototype.</p></div>
          <span>Live preview</span>
        </div>
        <div className="dummy__table-wrap">
          <table>
            <thead><tr><th>Service</th><th>State</th><th>CPU</th><th>Memory</th><th><span className="sr-only">Open</span></th></tr></thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.name}>
                  <td><span className="dummy__service-name"><Box aria-hidden="true" /><span><strong>{service.name}</strong><small>{service.image}</small></span></span></td>
                  <td><span className="dummy__state"><Circle aria-hidden="true" />{service.state}</span></td>
                  <td>{service.cpu}</td><td>{service.memory}</td>
                  <td><ChevronRight aria-hidden="true" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Notes() {
  return <div className="dummy__content dummy__notes"><h1>Prototype notes</h1><p>This nested route proves that each prototype can own navigation beneath its direct URL.</p><Link className="btn btn-neutral" to="..">Back to overview</Link></div>
}

function Crash(): ReactNode {
  throw new Error('Intentional dummy failure: the engine error boundary is working.')
}

export function DummyPrototype() {
  return (
    <div className="dummy-prototype">
      <header className="dummy__header">
        <Link className="dummy__brand" to="."><span>O</span> Observatory</Link>
        <nav aria-label="Dummy prototype navigation">
          <Link to=".">Overview</Link><Link to="notes">Notes</Link><Link to="crash">Test error</Link>
        </nav>
      </header>
      <Routes><Route index element={<Overview />} /><Route path="notes" element={<Notes />} /><Route path="crash" element={<Crash />} /></Routes>
    </div>
  )
}
