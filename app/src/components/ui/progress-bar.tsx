type ProgbarProps = {
  name: string
  progress: number
  range?: [number, number]
  marker?: number
}

export const Progbar = ({ name, progress, range, marker }: ProgbarProps) => {
  const clamped = Math.min(100, progress)

  const [start, end] = range || []
  const clampedStart = start !== undefined ? Math.max(0, Math.min(100, start)) : undefined
  const clampedEnd = end !== undefined ? Math.max(clampedStart || 0, Math.min(100, end)) : undefined

  const clampedMarker =
    marker !== undefined ? Math.max(0, Math.min(100, marker)) : undefined

  return (
    <>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-blue-700 dark:text-white">
          {name}
        </span>
        <span className="text-sm font-medium text-blue-700 dark:text-white">
          {clamped}%
        </span>
      </div>
      <div className="relative w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
        {clampedStart !== undefined && clampedEnd !== undefined && (
          <div
            className="absolute top-0 bottom-0 bg-yellow-300 opacity-50"
            style={{ left: `${clampedStart}%`, width: `${clampedEnd - clampedStart}%` }}
          />
        )}
        {clampedMarker !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500"
            style={{ left: `${clampedMarker}%` }}
          />
        )}
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${clamped}%` }}
        ></div>
      </div>
    </>
  )
}
