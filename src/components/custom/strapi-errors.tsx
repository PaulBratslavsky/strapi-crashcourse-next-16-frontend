interface StrapiErrorsProps {
  error: {
    status: number
    name: string
    message: string
    details?: Record<string, string[]>
  } | null
}

export function StrapiErrors({ error }: StrapiErrorsProps) {
  if (!error) return null

  return (
    <div className="text-red-500 text-sm mt-2 p-3 bg-red-50 border-2 border-red-200">
      {error.message}
    </div>
  )
}
