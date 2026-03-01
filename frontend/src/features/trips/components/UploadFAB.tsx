import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

type UploadFABProps = {
    onClick: () => void
}

export function UploadFAB({ onClick }: UploadFABProps) {
    return (
        <div className="fixed bottom-6 right-6 z-30">
            <Button size="lg" onClick={onClick} className="shadow-lg">
                <Plus className="size-5" />
                Add Photos
            </Button>
        </div>
    )
}
