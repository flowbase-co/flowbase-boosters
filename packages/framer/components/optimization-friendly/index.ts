import { useState, useEffect, type ReactElement } from 'react'

interface Props {
  loading: ReactElement | null
  loaded: ReactElement
}

export const OptimizationFriendly: React.FC<Props> = ({ loading, loaded }) => {
  const [isLoading, setLoading] = useState(true)
  useEffect(() => setLoading(false), [])
  return isLoading ? loading : loaded
}
