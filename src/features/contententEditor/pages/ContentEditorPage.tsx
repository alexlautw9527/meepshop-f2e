import { FC, useState, useCallback } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import 'react-quill/dist/quill.snow.css';
import { Image as ImageIcon, Type } from 'lucide-react';

type ConpoentType = 'text' | 'image';

const PREVIEW_DROPPABLE_ID = 'preview-droppable';

const Droppable: FC<{
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

type DraggableProps = {
  id: string;
  children: React.ReactNode;
};

const Draggable: FC<DraggableProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });
  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div className="flex items-center gap-4 border border-primary p-2 rounded-md">
        {children}
      </div>
    </div>
  );
};

export const ContentEditorPage = () => {
  // const [components, setComponents] = useState([]);
  // const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.log('drag start', event);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (event.over && event.over.id === PREVIEW_DROPPABLE_ID) {
      console.log('drag end', event);
    }
  }, []);

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="flex h-screen">
        <div className="w-64 p-4 border-r space-y-4 min-h-screen">
          <h2 className="font-semibold mb-4">新增內容元件</h2>
          <Draggable id="text">
            <Type className="w-4 h-4" />
            <span>Text</span>
          </Draggable>
          <Draggable id="image">
            <ImageIcon className="w-4 h-4" />
            <span>Image</span>
          </Draggable>
        </div>

        <Droppable id={PREVIEW_DROPPABLE_ID} className="p-2 w-full">
          <div className="p-2 w-full" />
        </Droppable>
      </div>
    </DndContext>
  );
};
