import { useState, useCallback, useMemo } from 'react'
import { AdvancedFilters } from '@/store'

interface UseFilterStateOptions {
  initialFilters?: AdvancedFilters
  onFiltersChange?: (filters: AdvancedFilters) => void
  debounceMs?: number
}

export function useFilterState(options: UseFilterStateOptions = {}) {
  const { initialFilters = {}, onFiltersChange, debounceMs = 500 } = options
  
  const [filters, setFilters] = useState<AdvancedFilters>(initialFilters)
  const [isDirty, setIsDirty] = useState(false)

  // Debounced filters effect
  const debouncedFilters = useMemo(() => {
    const timer = setTimeout(() => {
      if (onFiltersChange && isDirty) {
        onFiltersChange(filters)
        setIsDirty(false)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [filters, debounceMs, onFiltersChange, isDirty])

  const updateFilter = useCallback(<K extends keyof AdvancedFilters>(
    key: K,
    value: AdvancedFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }, [])

  const updateFilters = useCallback((newFilters: Partial<AdvancedFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setIsDirty(true)
  }, [])

  const clearFilter = useCallback((key: keyof AdvancedFilters) => {
    setFilters(prev => {
      const { [key]: _, ...rest } = prev
      return rest
    })
    setIsDirty(true)
  }, [])

  const clearAllFilters = useCallback(() => {
    setFilters({})
    setIsDirty(true)
  }, [])

  const getActiveFiltersCount = useCallback(() => {
    return Object.values(filters).filter(value => 
      value !== undefined && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length
  }, [filters])

  const hasActiveFilters = useMemo(() => getActiveFiltersCount() > 0, [getActiveFiltersCount])

  return {
    filters,
    isDirty,
    hasActiveFilters,
    updateFilter,
    updateFilters,
    clearFilter,
    clearAllFilters,
    getActiveFiltersCount,
    setFilters
  }
}
