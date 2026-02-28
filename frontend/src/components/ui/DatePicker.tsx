import { useEffect, useRef, useState } from "react"
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    isToday,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type DatePickerProps = {
    value: string // MM/DD/YYYY format
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
}

// Helpers for MM/DD/YYYY parsing/formatting
function formatDateToInput(date: Date | null): string {
    if (!date || Number.isNaN(date.getTime())) return ""
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    const yyyy = date.getFullYear()
    return `${mm}/${dd}/${yyyy}`
}

function parseInputToDate(value: string): Date | null {
    const trimmed = value.trim()
    // Expect MM/DD/YYYY
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed)
    if (!match) return null
    const [, mm, dd, yyyy] = match
    const month = Number(mm) - 1
    const day = Number(dd)
    const year = Number(yyyy)
    const d = new Date(year, month, day)
    // Validate that the date is actually valid (e.g., not 02/31/2026)
    if (Number.isNaN(d.getTime())) return null
    // Check if the parsed values match the original (prevents invalid dates like 02/31)
    if (d.getMonth() !== month || d.getDate() !== day || d.getFullYear() !== year) {
        return null
    }
    return d
}

function validateDateString(value: string): boolean {
    if (!value) return true // Empty is valid (not an error)
    const trimmed = value.trim()
    // If it's incomplete, don't mark as error yet
    if (trimmed.length < 10) return true
    // If it's complete, check if it's a valid date
    return parseInputToDate(trimmed) !== null
}

export function DatePicker({
    value,
    onChange,
    placeholder = "MM/DD/YYYY",
    className,
    disabled = false,
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [inputValue, setInputValue] = useState(value)
    const [rawValue, setRawValue] = useState("") // Raw numeric value without slashes
    const [isValidInput, setIsValidInput] = useState(true)
    const inputRef = useRef<HTMLInputElement>(null)
    const calendarRef = useRef<HTMLDivElement>(null)
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const previousLengthRef = useRef(0)

    // Sync inputValue with external value prop
    useEffect(() => {
        setInputValue(value)
        // Extract raw digits from the value
        const digits = value.replace(/\D/g, "")
        setRawValue(digits)
        previousLengthRef.current = value.length
    }, [value])

    // Debounced validation and calendar update
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
            const isValid = validateDateString(inputValue)
            setIsValidInput(isValid)

            const parsedDate = parseInputToDate(inputValue)
            if (parsedDate) {
                setCurrentMonth(parsedDate)
            }
        }, 300)

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [inputValue])

    // Close calendar when clicking outside
    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node | null
            if (!target) return
            if (
                calendarRef.current?.contains(target) ||
                inputRef.current?.contains(target)
            ) {
                return
            }
            setIsOpen(false)
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen])

    // Generate calendar days for the current month
    const generateCalendarDays = () => {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(currentMonth)
        const calendarStart = startOfWeek(monthStart)
        const calendarEnd = endOfWeek(monthEnd)

        const days: Date[] = []
        let currentDay = calendarStart

        while (currentDay <= calendarEnd) {
            days.push(currentDay)
            currentDay = addDays(currentDay, 1)
        }

        return days
    }

    const handleDayClick = (day: Date) => {
        const formatted = formatDateToInput(day)
        setInputValue(formatted)
        onChange(formatted)
        setIsValidInput(true)
        setIsOpen(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        const previousLength = previousLengthRef.current
        const isDeletion = newValue.length < previousLength

        // Extract only digits from the new input
        const newDigits = newValue.replace(/\D/g, "")

        // If user is deleting and hit a slash, remove the preceding digit too
        if (isDeletion) {
            // Check if the deleted character was a slash
            const cursorWasAtSlash = previousLength > newValue.length &&
                (previousLength === 3 || previousLength === 6)

            if (cursorWasAtSlash && newDigits.length === rawValue.length) {
                // User backspaced over a slash, so also remove the preceding digit
                const trimmedDigits = newDigits.slice(0, -1)
                setRawValue(trimmedDigits)
                const formatted = formatRawValue(trimmedDigits)
                setInputValue(formatted)
                onChange(formatted)
                previousLengthRef.current = formatted.length
                return
            }
        }

        // Limit to 8 digits (MMDDYYYY)
        const limitedDigits = newDigits.slice(0, 8)
        setRawValue(limitedDigits)

        // Apply formatting only when not deleting or when adding characters
        const formatted = formatRawValue(limitedDigits)
        setInputValue(formatted)
        onChange(formatted)
        previousLengthRef.current = formatted.length
    }

    // Helper function to format raw digits into MM/DD/YYYY
    const formatRawValue = (digits: string): string => {
        if (digits.length === 0) return ""

        let formatted = digits.slice(0, 2) // MM

        if (digits.length >= 3) {
            formatted += "/" + digits.slice(2, 4) // /DD
        }

        if (digits.length >= 5) {
            formatted += "/" + digits.slice(4, 8) // /YYYY
        }

        return formatted
    }

    const handleInputBlur = () => {
        // On blur, validate and update parent if valid
        const parsedDate = parseInputToDate(inputValue)
        if (parsedDate) {
            const formatted = formatDateToInput(parsedDate)
            setInputValue(formatted)
            onChange(formatted)
        }
    }

    const handleInputClick = () => {
        if (!disabled) {
            setIsOpen(true)
        }
    }

    const previousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1))
    }

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1))
    }

    const selectedDate = parseInputToDate(inputValue)
    const calendarDays = generateCalendarDays()
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    const inputClass = cn(
        "w-full rounded-md border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors",
        disabled && "cursor-not-allowed opacity-50",
        !isValidInput && inputValue.length >= 10
            ? "border-red-500 bg-red-500/10 focus:border-red-500 focus:ring-red-500"
            : "border-border-token bg-bg-surface focus:border-accent focus:ring-accent",
        className
    )

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onClick={handleInputClick}
                onFocus={handleInputClick}
                onBlur={handleInputBlur}
                disabled={disabled}
                className={inputClass}
                maxLength={10}
            />

            {isOpen && (
                <div
                    ref={calendarRef}
                    className="absolute left-0 top-full z-50 mt-2 w-80 rounded-lg border border-border-token bg-bg-surface p-4 shadow-xl"
                >
                    {/* Month/Year Header */}
                    <div className="mb-4 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={previousMonth}
                            className="rounded-md p-1 text-text-primary hover:bg-bg-raised focus:outline-none focus:ring-2 focus:ring-accent"
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="text-sm font-semibold text-text-primary">
                            {format(currentMonth, "MMMM yyyy")}
                        </span>
                        <button
                            type="button"
                            onClick={nextMonth}
                            className="rounded-md p-1 text-text-primary hover:bg-bg-raised focus:outline-none focus:ring-2 focus:ring-accent"
                            aria-label="Next month"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Week Day Headers */}
                    <div className="mb-2 grid grid-cols-7 gap-1">
                        {weekDays.map((day) => (
                            <div
                                key={day}
                                className="flex h-8 items-center justify-center text-xs font-medium text-text-muted"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, index) => {
                            const isSelected = selectedDate && isSameDay(day, selectedDate)
                            const isCurrentMonth = isSameMonth(day, currentMonth)
                            const isTodayDate = isToday(day)

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleDayClick(day)}
                                    className={cn(
                                        "flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg-surface",
                                        // Default state
                                        isCurrentMonth
                                            ? "text-text-primary hover:bg-bg-raised"
                                            : "text-text-muted hover:bg-bg-raised/50",
                                        // Selected state
                                        isSelected &&
                                        "bg-accent font-semibold text-white hover:bg-accent-hover",
                                        // Today indicator (only if not selected)
                                        !isSelected &&
                                        isTodayDate &&
                                        "border border-accent font-semibold"
                                    )}
                                >
                                    {format(day, "d")}
                                </button>
                            )
                        })}
                    </div>

                    {/* Today button */}
                    <div className="mt-3 border-t border-border-token pt-3">
                        <button
                            type="button"
                            onClick={() => handleDayClick(new Date())}
                            className="w-full rounded-md px-3 py-1.5 text-sm text-text-muted hover:bg-bg-raised hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
