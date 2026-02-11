import { useState } from "react"
import api from "@/lib/api"
import { useAppDispatch } from "@/store/hooks"
import { addTrips } from "@/store/slice/tripSlice"
import type { Trip } from "@/store/types/trip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CreateTripModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

// Placeholder until auth is implemented; backend requires userId
const PLACEHOLDER_USER_ID = "2d21e013-bb58-4746-aeda-f1a1a39ec804"

export function CreateTripModal({ open, onOpenChange }: CreateTripModalProps) {
    const dispatch = useAppDispatch()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [form, setForm] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        coverPhotoUrl: "",
    })

    const resetForm = () => {
        setForm({
            name: "",
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

        //Sets errors
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
        setIsSubmitting(true)
        try {
            const { data: newTrip } = await api.post<Trip>("/trips", {
                userId: PLACEHOLDER_USER_ID,
                name: form.name.trim(),
                description: form.description.trim() || undefined,
                startDate: form.startDate,
                endDate: form.endDate,
                ...(form.coverPhotoUrl.trim() && { coverPhotoUrl: form.coverPhotoUrl.trim() }),
            })
            dispatch(addTrips(newTrip))
            resetForm()
            onOpenChange(false)
        } catch (err: unknown) {
            const message =
                err && typeof err === "object" && "response" in err
                    ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                    : "Failed to create trip."
            setError(message ?? "Failed to create trip.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        resetForm()
        onOpenChange(false)
    }

    if (!open) return null

    const inputClass =
        "w-full rounded-md border border-[#2d302e] bg-[#0d0e0d] px-3 py-2 text-sm text-white placeholder:text-[#6b7280] focus:border-app-accent focus:outline-none focus:ring-1 focus:ring-app-accent"

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-trip-title"
        >
            {/* Overlay */}
            <button
                type="button"
                className="absolute inset-0 bg-black/60"
                onClick={handleCancel}
                aria-label="Close modal"
            />


            {/* Panel */}
            <div className="relative z-10 w-full max-w-md rounded-lg border border-[#2d302e] bg-[#0d0e0d] shadow-xl">
                <div className="border-b border-[#2d302e] px-6 py-4">
                    <h2 id="create-trip-title" className="text-lg font-semibold text-white">
                        Create trip
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-4">
                    {error && (
                        <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400" role="alert">
                            {error}
                        </p>
                    )}

                    <div>
                        <label htmlFor="trip-name" className="mb-1 block text-sm font-medium text-[#9A9C9B]">
                            Trip name <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="trip-name"
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className={inputClass}
                            placeholder="e.g. Japan 2025"
                        />
                    </div>

                    <div>
                        <label htmlFor="trip-description" className="mb-1 block text-sm font-medium text-[#9A9C9B]">
                            Description <span className="text-[#6b7280]">(optional)</span>
                        </label>
                        <textarea
                            id="trip-description"
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className={cn(inputClass, "resize-none")}
                            placeholder="A few words about this trip..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="trip-start" className="mb-1 block text-sm font-medium text-[#9A9C9B]">
                                Start date <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="trip-start"
                                type="date"
                                required
                                value={form.startDate}
                                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label htmlFor="trip-end" className="mb-1 block text-sm font-medium text-[#9A9C9B]">
                                End date <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="trip-end"
                                type="date"
                                required
                                value={form.endDate}
                                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="trip-cover" className="mb-1 block text-sm font-medium text-[#9A9C9B]">
                            Cover photo URL <span className="text-[#6b7280]">(optional)</span>
                        </label>
                        <input
                            id="trip-cover"
                            type="url"
                            value={form.coverPhotoUrl}
                            onChange={(e) => setForm((f) => ({ ...f, coverPhotoUrl: e.target.value }))}
                            className={inputClass}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-[#2d302e] pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="border-[#2d302e] bg-transparent text-[#9A9C9B] hover:bg-[#1a1b1a]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-app-accent text-white hover:bg-app-accent-hover"
                        >
                            {isSubmitting ? "Creating…" : "Create trip"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
