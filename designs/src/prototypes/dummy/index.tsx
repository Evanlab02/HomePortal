import type { PrototypeDefinition } from '../../engine/types/prototype'
import { DummyPrototype } from './prototype'
import './prototype.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'dummy',
    name: 'System observatory',
    description: 'A disposable example showing the full prototype contract and responsive preview tools.',
    status: 'exploratory',
    updatedAt: '2026-08-09',
    tags: ['example', 'responsive', 'daisyUI'],
  },
  Component: DummyPrototype,
}

export default prototype
