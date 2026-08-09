import type {
  DiscoveryIssue,
  PrototypeDefinition,
  PrototypeModule,
  PrototypeStatus,
} from '../types/prototype'

const modules = import.meta.glob<PrototypeModule>('../../prototypes/*/index.tsx', {
  eager: true,
})

const validStatuses = new Set<PrototypeStatus>([
  'exploratory',
  'in-progress',
  'ready',
])

function validatePrototype(
  source: string,
  candidate: PrototypeDefinition | undefined,
): string[] {
  if (!candidate?.meta || !candidate.Component) {
    return ['The module must default-export { meta, Component }.']
  }

  const { meta } = candidate
  const problems: string[] = []

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.id)) {
    problems.push('meta.id must be a lowercase kebab-case URL segment.')
  }
  if (!meta.name.trim()) problems.push('meta.name is required.')
  if (!meta.description.trim()) problems.push('meta.description is required.')
  if (!validStatuses.has(meta.status)) problems.push('meta.status is invalid.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.updatedAt)) {
    problems.push('meta.updatedAt must use YYYY-MM-DD.')
  }

  return problems.map((problem) => `${source}: ${problem}`)
}

function discoverPrototypes(): {
  prototypes: PrototypeDefinition[]
  issues: DiscoveryIssue[]
} {
  const prototypes: PrototypeDefinition[] = []
  const issues: DiscoveryIssue[] = []
  const ids = new Map<string, string>()

  for (const [source, module] of Object.entries(modules)) {
    const candidate = module.default
    const problems = validatePrototype(source, candidate)

    if (candidate?.meta?.id && ids.has(candidate.meta.id)) {
      problems.push(
        `${source}: duplicate id "${candidate.meta.id}" also used by ${ids.get(candidate.meta.id)}.`,
      )
    }

    if (problems.length > 0) {
      issues.push(...problems.map((message) => ({ source, message })))
      continue
    }

    ids.set(candidate.meta.id, source)
    prototypes.push(candidate)
  }

  prototypes.sort((a, b) => a.meta.name.localeCompare(b.meta.name))
  return { prototypes, issues }
}

export const prototypeRegistry = discoverPrototypes()
