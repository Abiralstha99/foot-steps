import React from "react"
import { Edit2, Image, MapPin, Share2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu } from "@/components/ui/DropdownMenu"

type TripHeaderTrip = {
  title: string
  location: string
  startDate: string
  endDate: string
}

interface TripHeaderProps {
  trip: TripHeaderTrip
  onUploadPhotos?: () => void
  onChangeCover?: () => void
  onEdit?: () => void
  onShare?: () => void
}

const TripHeader: React.FC<TripHeaderProps> = ({
  trip,
  onUploadPhotos,
  onChangeCover,
  onEdit,
  onShare,
}) => {
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return ""

    const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit" })
    const year = new Intl.DateTimeFormat("en-US", { year: "numeric" })

    const startYear = year.format(start)
    const endYear = year.format(end)

    if (startYear === endYear) {
      return `${monthDay.format(start)} - ${monthDay.format(end)}, ${endYear}`
    }

    return `${monthDay.format(start)}, ${startYear} - ${monthDay.format(end)}, ${endYear}`
  }

  return (
    <div className="bg-[#070807] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-white truncate">{trip.title}</h1>

            <div className="mt-2 flex items-center gap-2 text-[#9A9C9B]">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <p className="text-sm sm:text-base truncate">{trip.location}</p>
            </div>

            <p className="mt-2 text-sm text-[#9A9C9B]">
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="border-white/10 bg-black/20 text-white hover:bg-white/5 hover:text-white"
              onClick={onUploadPhotos}
            >
              <Upload className="h-4 w-4" />
              Upload Photos
            </Button>
            <DropdownMenu
              items={
                [
                  onChangeCover && {
                    label: "Change Cover",
                    icon: <Image className="h-4 w-4" />,
                    onClick: onChangeCover,
                  },
                  onEdit && {
                    label: "Edit",
                    icon: <Edit2 className="h-4 w-4" />,
                    onClick: onEdit,
                  },
                  onShare && {
                    label: "Share",
                    icon: <Share2 className="h-4 w-4" />,
                    onClick: onShare,
                  },
                ].filter(Boolean) as {
                  label: string
                  icon: React.ReactNode
                  onClick: () => void
                }[]
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripHeader;
