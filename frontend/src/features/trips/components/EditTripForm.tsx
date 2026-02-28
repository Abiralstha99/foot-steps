import { useState } from "react"
import { MapPin } from "lucide-react"
import { useUpdateTrip } from "@/features/trips/useTrips"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/DatePicker"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Trip } from "@/app/types"

type EditTripModalProps = {
    trip: Trip
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

/** Convert an ISO date string or YYYY-MM-DD to MM/DD/YYYY for the DatePicker. */
function toMMDDYYYY(dateStr: string): string {
    if (!dateStr) return ""
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0")
    const dd = String(date.getUTCDate()).padStart(2, "0")
    const yyyy = date.getUTCFullYear()
    return `${mm}/${dd}/${yyyy}`
}

export function EditTripModal({ trip, open, onOpenChange, onSuccess }: EditTripModalProps) {
    const { updateTrip, loading: isSubmitting, error: tripError } = useUpdateTrip()
    const [error, setError] = useState<string | null>(null)
    const [form, setForm] = useState({
        name: trip.name,
        location: trip.location ?? "",
        description: trip.description ?? "",
        startDate: toMMDDYYYY(trip.startDate),
        endDate: toMMDDYYYY(trip.endDate),
        coverPhotoUrl: trip.coverPhotoUrl ?? "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!form.name.trim()) {
            setError("Trip name is required.")
            return
        }
        if (!form.startDate || !form.endDate) {
            setError("Start date and end date are required.")
            return
        }
        if (new Date(form.startDate) > new Date(form.endDate)) {
            setError("End date must be on or after start date.")
            return
        }
        try {
            await updateTrip(trip.id, {
                name: form.name.trim(),
                description: form.description.trim() || undefined,
                location: form.location.trim() || undefined,
                startDate: form.startDate,
                endDate: form.endDate,
                ...(form.coverPhotoUrl.trim() && { coverPhotoUrl: form.coverPhotoUrl.trim() }),
            })
            onOpenChange(false)
            onSuccess?.()
        } catch (err: unknown) {
            const message = typeof err === "string" ? err : err instanceof Error ? err.message : "Failed to update trip."
            setError(message ?? "Failed to update trip.")
        }
    }

    const textareaClass = cn(
        "w-full rounded bg-bg-surface border border-border-token text-text-primary px-3 py-2 text-sm",
        "placeholder:text-text-muted resize-none",
        "focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[480px] p-0">
                <div className="border-b border-border-token px-6 py-4">
                    <DialogTitle className="font-display text-subheading font-semibold text-text-primary">
                        Edit trip
                    </DialogTitle>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
                    {(error || tripError) && (
                        <p className="rounded bg-red-500/10 px-3 py-2 text-sm text-red-400" role="alert">
                            {error ?? tripError}
                        </p>
                    )}

                    <div>
                        <label htmlFor="edit-trip-name" className="mb-1.5 block text-sm font-medium text-text-secondary">
                            Trip name <span className="text-red-400">*</span>
                        </label>
                        <Input
                            id="edit-trip-name"
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="e.g. Japan 2025"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-trip-location" className="mb-1.5 block text-sm font-medium text-text-secondary">
                            Location <span className="text-text-muted">(optional)</span>
                        </label>
                        <Input
                            id="edit-trip-location"
                            type="text"
                            icon={<MapPin />}
                            value={form.location}
                            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                            placeholder="Tokyo, Japan"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-trip-description" className="mb-1.5 block text-sm font-medium text-text-secondary">
                            Description <span className="text-text-muted">(optional)</span>
                        </label>
                        <textarea
                            id="edit-trip-description"
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className={textareaClass}
                            placeholder="A few words about this trip..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit-trip-start" className="mb-1.5 block text-sm font-medium text-text-secondary">
                                Start date <span className="text-red-400">*</span>
                            </label>
                            <DatePicker
                                value={form.startDate}
                                onChange={(value) => setForm((f) => ({ ...f, startDate: value }))}
                                placeholder="MM/DD/YYYY"
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-trip-end" className="mb-1.5 block text-sm font-medium text-text-secondary">
                                End date <span className="text-red-400">*</span>
                            </label>
                            <DatePicker
                                value={form.endDate}
                                onChange={(value) => setForm((f) => ({ ...f, endDate: value }))}
                                placeholder="MM/DD/YYYY"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="edit-trip-cover" className="mb-1.5 block text-sm font-medium text-text-secondary">
                            Cover photo URL <span className="text-text-muted">(optional)</span>
                        </label>
                        <Input
                            id="edit-trip-cover"
                            type="url"
                            value={form.coverPhotoUrl}
                            onChange={(e) => setForm((f) => ({ ...f, coverPhotoUrl: e.target.value }))}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 border-t border-border-token pt-4">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving…" : "Save changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
