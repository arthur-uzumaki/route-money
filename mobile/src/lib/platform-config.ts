import type { Platform } from '~/app/(app)/(dashboard)/platform-distribution'

export const platformConfig: Record<
  Platform,
  { name: string; color: string; bgColor: string }
> = {
  uber: {
    name: 'Uber',
    color: 'text-black',
    bgColor: 'bg-black',
  },
  ifood: {
    name: 'iFood',
    color: 'text-red-600',
    bgColor: 'bg-red-600',
  },
  '99': {
    name: '99',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-600',
  },
  rappi: {
    name: 'Rappi',
    color: 'text-orange-600',
    bgColor: 'bg-orange-600',
  },
  outro: {
    name: 'Outro',
    color: 'text-gray-600',
    bgColor: 'bg-gray-600',
  },
}

export function getPlatformColor(platform: Platform): string {
  return platformConfig[platform]?.color || 'text-gray-600'
}

export function getPlatformBgColor(platform: Platform): string {
  return platformConfig[platform]?.bgColor || 'bg-gray-600'
}

export function getPlatformName(platform: Platform): string {
  return platformConfig[platform]?.name || platform
}
