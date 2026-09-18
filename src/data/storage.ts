import mockData from './mockData.json'
import type { Deudor, PQRS } from '../types'

const KEYS = {
  deudores: 'gidi.deudores',
  pqrs: 'gidi.pqrs',
} as const

function load<T>(key: string, seed: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(seed))
      return seed
    }
    return JSON.parse(raw) as T
  } catch {
    return seed
  }
}

function save<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getDeudores(): Deudor[] {
  return load<Deudor[]>(KEYS.deudores, mockData.deudores as Deudor[])
}

export function getPQRS(): PQRS[] {
  return load<PQRS[]>(KEYS.pqrs, mockData.pqrs as PQRS[])
}

export function saveDeudores(deudores: Deudor[]) {
  save(KEYS.deudores, deudores)
}

export function savePQRS(items: PQRS[]) {
  save(KEYS.pqrs, items)
}

export function addPQRS(item: PQRS): PQRS[] {
  const current = getPQRS()
  const updated = [item, ...current]
  savePQRS(updated)
  return updated
}

export function nextRadicadoNumber(): string {
  const year = new Date().getFullYear()
  const current = getPQRS()
  const max = current
    .map((p) => p.radicado)
    .filter((r) => r.includes(String(year)))
    .map((r) => Number(r.split('-').pop()))
    .filter((n) => !Number.isNaN(n))
    .reduce((a, b) => Math.max(a, b), 0)
  const next = max + 1
  return `PQRS-${year}-${String(next).padStart(6, '0')}`
}

export function resetDemoData() {
  window.localStorage.removeItem(KEYS.deudores)
  window.localStorage.removeItem(KEYS.pqrs)
}
