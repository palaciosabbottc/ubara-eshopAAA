import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ElementType } from "react"

interface SortableItemProps {
  id: string
  children: React.ReactNode
  as?: ElementType
}

export function SortableItem({ id, children, as: Component = "div" }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <Component ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </Component>
  )
} 