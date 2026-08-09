import type { ComponentType } from 'react'

export type PrototypeStatus = 'exploratory' | 'in-progress' | 'ready'

export interface PrototypeMeta {
  id: string
  name: string
  description: string
  status: PrototypeStatus
  updatedAt: string
  tags?: string[]
}

export interface PrototypeDefinition {
  meta: PrototypeMeta
  Component: ComponentType
}

export interface PrototypeModule {
  default: PrototypeDefinition
}

export interface DiscoveryIssue {
  source: string
  message: string
}
