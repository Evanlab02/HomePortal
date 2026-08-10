import type { ComponentType } from 'react'

export type PrototypeStatus = 'exploratory' | 'in-progress' | 're-review' | 'ready' | 'implemented'

export interface RelatedTask {
  identifier: string
}

export interface PrototypeMeta {
  id: string
  name: string
  description: string
  tag: string
  status: PrototypeStatus
  updatedAt: string
  relatedTasks?: RelatedTask[]
}

export interface PrototypeState {
  id: string
  label: string
}

export interface PrototypeComponentProps {
  prototypeState?: string
}

export interface PrototypeDefinition {
  meta: PrototypeMeta
  states?: PrototypeState[]
  Component: ComponentType<PrototypeComponentProps>
}

export interface PrototypeModule {
  default: PrototypeDefinition
}

export interface DiscoveryIssue {
  source: string
  message: string
}
