import { useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { MapPin } from "lucide-react"
import { useCreateTrip } from "@/features/trips/useTrips"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/DatePicker"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type CreateTripModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateTripModal({ open, onOpenChange }: CreateTripModalProps) {
    const { user } = useUser()
    const { createTrip, loading: isSubmitting, error: tripError } = useCreateTrip()
    const [error, setError] = useState<string | null>(null)
    const [form, setForm] = useState({
        name: "",
        location: "",
        description: "",
        startDate: "",
        endDate: "",
        coverPhotoUrl: "",
    })

    const resetForm = () => {
        setForm({
            name: "",
            location: "",
            description: "",
            startDate: "",
            endDate: "",
            coverPhotoUrl: "",
        })
        setError(null)
    }

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
        if (!user?.id) {
            setError("You must be signed in to create a trip.")
            return
        }
        try {
            await createTrip({
                userId: user.id,
                name: form.name.trim(),
                description: form.description.trim() || undefined,
                location: form.location.trim() || undefined,
                startDate: form.startDate,
                endDate: form.endDate,
                ...(form.coverPhotoUrl.trim() && { coverPhotoUrl: form.coverPhotoUrl.trim() }),
            })
            resetForm()
            onOpenChange(false)
        } catch (err: unknown) {
            const message = typeof err === "string" ? err : err instanceof Error ? err.message : "Failed to create trip."
            setError(message ?? "Failed to create trip.")
        }
    }

    const handleCancel = () => {
        resetForm()
        onOpenChange(false)
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
                        New trip
                    </DialogTitle>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
                    {(error || tripError) && (
                        <p className="rounded bg-red-500/10 px-3 py-2 text-sm text-red-400" role="alert">
                            {error ?? tripError}
                        </p>
                    )}

                    <div>
                        <label htmlFor="trip-name" className="mb-1.5 block text-sm font-medium text-text-secondary">
                            Trip name <span className="text-red-400">*</span>
                        </label>
                        <Input
                            id="trip-name"
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="e.g. Japan 2025"
                        />
                    </div>

                    <div>
                        <label htmlFor="trip-location" className="mb-1.5 block text-sm font-medium text-text-secondary">
                            Location <span className="text-text-muted">(optional)</span>
                        </label>
                        <Input
                            id="trip-location"
                            type="text"
                            icon={<MapPin />}
                            value={form.location}
                            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                            placeholder="Tokyo, Japan"
                        />
                    </div>

                    <div>
                        <label htmlFor="trip-description" className="mb-1.5 block text-sm font-medium text-text-secondary">
                            Description <span className="text-text-muted">(optional)</span>
                        </label>
                        <textarea
                            id="trip-description"
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className={textareaClass}
                            placeholder="A few words about this trip..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="trip-start" className="mb-1.5 block text-sm font-medium text-text-secondary">
                                Start date <span className="text-red-400">*</span>
                            </label>
                            <DatePicker
                                value={form.startDate}
                                onChange={(value) => setForm((f) => ({ ...f, startDate: value }))}
                                placeholder="MM/DD/YYYY"
                            />
                        </div>
                        <div>
                            <label htmlFor="trip-end" className="mb-1.5 block text-sm font-medium text-text-secondary">
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
                        <label htmlFor="trip-cover" className="mb-1.5 block text-sm font-medium text-text-secondary">
                            Cover photo URL <span className="text-text-muted">(optional)</span>
                        </label>
                        <Input
                            id="trip-cover"
                            type="url"
                            value={form.coverPhotoUrl}
                            onChange={(e) => setForm((f) => ({ ...f, coverPhotoUrl: e.target.value }))}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 border-t border-border-token pt-4">
                        <Button type="button" variant="ghost" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating…" : "Create trip"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
