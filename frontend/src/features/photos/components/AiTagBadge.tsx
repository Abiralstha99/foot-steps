import { cn } from "@/lib/utils"
import { categorizeTag, type TagCategory } from "@/features/photos/utils/categorizeTag"

type AiTagBadgeProps = {
  tag: string
  category?: TagCategory
}

const CATEGORY_STYLES: Record<TagCategory, string> = {
  landmark: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  scene:    "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
  object:   "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
}

export function AiTagBadge({ tag, category }: AiTagBadgeProps) {
  if (!tag) return null
  const cat = category ?? categorizeTag(tag)
  return (
    <span className={cn("px-2 py-0.5 rounded text-xs font-medium", CATEGORY_STYLES[cat])}>
      {tag}
    </span>
  )
}
