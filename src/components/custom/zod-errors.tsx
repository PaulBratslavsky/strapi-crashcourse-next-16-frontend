interface ZodErrorsProps {
  error: string[] | undefined
}

export function ZodErrors({ error }: ZodErrorsProps) {
  if (!error || error.length === 0) return null

  return (
    <div className="text-xs text-red-500 mt-1">
      {error.map((err, index) => (
        <p key={index}>{err}</p>
      ))}
    </div>
  )
}
