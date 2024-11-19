import { FC } from 'react';
import { useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';
import { Image as ImageIcon, Type, GalleryHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentType } from '@/features/contentEditor/types';

type DraggableProps = {
  id: string;
  children: React.ReactNode;
};

export const Draggable: FC<DraggableProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });
  const style = transform
    ? {
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

export const Droppable: FC<{
  id: string;
  className: string;
  children: React.ReactNode;
}> = ({ id, className, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className={cn(className, isOver && 'bg-muted')} ref={setNodeRef}>
      {children}
    </div>
  );
};

export const ItemCard: FC<{ type: ContentType }> = ({ type }) => {
  const iconMap = {
    text: <Type className="w-4 h-4" />,
    image: <ImageIcon className="w-4 h-4" />,
    carousel: <GalleryHorizontal className="w-4 h-4" />,
  };

  const icon = iconMap[type] || null;

  return (
    <div className="flex items-center gap-4 border border-primary p-2 rounded-md bg-white">
      {icon}
      <span className="capitalize">{type}</span>
    </div>
  );
};

export const ItemCardOverlay: FC<{ draggedItemId: string }> = ({
  draggedItemId,
}) => (
  <DragOverlay>
    {draggedItemId ? <ItemCard type={draggedItemId as ContentType} /> : null}
  </DragOverlay>
);
