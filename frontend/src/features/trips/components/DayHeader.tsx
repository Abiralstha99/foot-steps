type DayHeaderProps = {
  label: string // "YYYY-MM-DD" or "Unknown Date"
}

function formatLabel(label: string): string {
  if (label === "Unknown Date") return label
  // Parse the YYYY-MM-DD as UTC noon to avoid any timezone-day shift
  const date = new Date(`${label}T12:00:00Z`)
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

export function DayHeader({ label }: DayHeaderProps) {
  return (
    <div className="mb-3">
      <h2 className="font-display text-subheading font-semibold text-text-secondary">
        {formatLabel(label)}
      </h2>
      <div className="mt-1 border-b border-border-token" />
    </div>
  )
}
