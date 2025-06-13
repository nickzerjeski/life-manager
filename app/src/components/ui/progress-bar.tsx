type ProgbarProps = {
  name: string
  progress: number
  range?: [number, number]
}

export const Progbar = ({ name, progress, range }: ProgbarProps) => {
  const clamped = Math.min(100, progress)

  const [start, end] = range || []
  const clampedStart =
    start !== undefined ? Math.max(0, Math.min(100, start)) : undefined
  const clampedEnd =
    end !== undefined ? Math.max(clampedStart || 0, Math.min(100, end)) : undefined


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
        {clampedStart !== undefined && (
          <div
            className="pointer-events-none absolute inset-y-0 w-0.5 border-r-2 border-dashed border-yellow-600"
            style={{ left: `${clampedStart}%` }}
          />
        )}
        {clampedEnd !== undefined && (
          <div
            className="pointer-events-none absolute inset-y-0 w-0.5 border-r-2 border-dashed border-yellow-600"
            style={{ left: `${clampedEnd}%` }}
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
