import { FC, useState, useCallback, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';

import { cn } from '@/lib/utils';
import {
  DndContext,
  useDroppable,
  useDraggable,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { X as CrossIcon, Image as ImageIcon, Type } from 'lucide-react';

import ReactQuill from 'react-quill';
import { useClickOutside } from '@/hooks/useClickOutside';

type ComponentType = 'text' | 'image';

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

const DraggableItem: FC<{ type: ComponentType }> = ({ type }) => {
  const icon =
    type === 'text' ? (
      <Type className="w-4 h-4" />
    ) : (
      <ImageIcon className="w-4 h-4" />
    );

  return (
    <div className="flex items-center gap-4">
      {icon}
      <span className="capitalize">{type}</span>
    </div>
  );
};

type ImageContent = {
  type: 'image';
  id: string;
  width: number;
  src: string;
};

type TextContent = {
  type: 'text';
  id: string;
  text: string;
};

type TextPreviewEditorProps = {
  content: TextContent;
  onFocus?: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

const TextPreviewEditor: FC<TextPreviewEditorProps> = ({
  content,
  onFocus = () => {},
  onDelete,
  onEdit,
}) => {
  const [text, setText] = useState(content.text);
  const [isEditing, setIsEditing] = useState(false);

  const quillRef = useRef<HTMLDivElement>(null);

  useClickOutside(quillRef, () => setIsEditing(false));

  const handleOpenEdit = () => {
    onFocus(content.id);
    setIsEditing(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(content.id);
  };

  const handleTextChange = (value: string) => {
    setText(value);
    onEdit(content.id, value);
  };

  return (
    <div onDoubleClick={handleOpenEdit}>
      {isEditing ? (
        <div
          ref={quillRef}
          className="p-2 border border-gray-300 rounded-md cursor-pointer"
        >
          <ReactQuill value={text} onChange={handleTextChange} />
        </div>
      ) : (
        <div className="relative cursor-pointer hover:rounded-md hover:border-gray-400 hover:bg-gray-100 group">
          <div
            className="ql-editor render-content"
            dangerouslySetInnerHTML={{ __html: text }}
          />

          <button
            type="button"
            onClick={handleDelete}
            className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100"
          >
            <CrossIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

const ImagePreviewEditor: FC<{
  content: ImageContent;
  onFocus?: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: ({
    id,
    src,
    width,
  }: {
    id: string;
    src: string;
    width: number;
  }) => void;
}> = ({ content, onFocus = () => {}, onDelete, onEdit }) => {
  const [updatedContent, setUpdatedContent] = useState<ImageContent>(content);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useClickOutside(inputRef, () => setIsEditing(false));

  const handleOpenEdit = () => {
    onFocus(content.id);
    setIsEditing(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(content.id);
  };

  const handleUpdateContent = (updated: Partial<ImageContent>) => {
    setUpdatedContent((prev) => ({ ...prev, ...updated }));
    onEdit({ ...updatedContent, ...updated });
  };

  return (
    <div onDoubleClick={handleOpenEdit}>
      {isEditing ? (
        <div ref={inputRef} className="p-2 border border-gray-300 rounded-md">
          <label htmlFor="image-url" className="block mb-1">
            Image URL
          </label>
          <input
            id="image-url"
            type="text"
            value={updatedContent.src}
            onChange={(e) => handleUpdateContent({ src: e.target.value })}
            className="mb-2 p-1 border rounded w-full"
            placeholder="Image URL"
          />
          <label htmlFor="image-width" className="block mb-1">
            Width
          </label>
          <input
            id="image-width"
            type="number"
            value={updatedContent.width}
            onChange={(e) => handleUpdateContent({ width: +e.target.value })}
            className="mb-2 p-1 border rounded w-full"
            placeholder="Width"
          />
        </div>
      ) : (
        <div className="group relative">
          <img
            src={updatedContent.src}
            alt=""
            width={updatedContent.width}
            className="group-hover:ring-4 group-hover:ring-gray-400 group-hover:rounded-md"
          />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-1 py-0.5 opacity-0 group-hover:opacity-70">
            雙擊進行編輯
          </span>
          <button
            type="button"
            onClick={handleDelete}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100"
          >
            <CrossIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

type ContentList = (ImageContent | TextContent)[];

export const ContentEditorPage = () => {
  const [contentList, setContentList] = useState<ContentList>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.log('drag start', event);
    setActiveId(event.active.id.toString());
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    if (event.over && event.over.id === PREVIEW_DROPPABLE_ID) {
      const type = event.active.id as ComponentType;
      const id = Math.random().toString(36).slice(2);
      if (type === 'text') {
        setContentList((prev) => [
          ...prev,
          {
            type,
            id,
            text: '雙擊此處進行更改',
          },
        ]);
      } else {
        setContentList((prev) => [
          ...prev,
          {
            type,
            id,
            width: 100,
            height: 100,
            src: 'https://via.placeholder.com/100',
          },
        ]);
      }
    }
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleDelete = (id: string) => {
    setContentList((prev) => prev.filter((content) => content.id !== id));
  };

  const handleTextEdit = (id: string, text: string) => {
    setContentList((prev) =>
      prev.map((content) =>
        content.id === id ? { ...content, text } : content
      )
    );
  };

  const handleImageEdit = ({
    id,
    src,
    width,
  }: {
    id: string;
    src: string;
    width: number;
  }) => {
    setContentList((prev) =>
      prev.map((content) =>
        content.id === id ? { ...content, src, width } : content
      )
    );
  };

  console.log(contentList);

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
    >
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
          <div className="p-2 w-full">
            {contentList.length === 0 && (
              <p className="text-slate-400-300">拖曳元件至此處新增內容</p>
            )}
            {contentList.map((content) =>
              content.type === 'text' ? (
                <TextPreviewEditor
                  key={content.id}
                  content={content}
                  onDelete={handleDelete}
                  onEdit={handleTextEdit}
                />
              ) : (
                <ImagePreviewEditor
                  key={content.id}
                  content={content}
                  onDelete={handleDelete}
                  onEdit={handleImageEdit}
                />
              )
            )}
          </div>
        </Droppable>

        <DragOverlay>
          {activeId ? (
            <div className="flex items-center gap-4 border border-primary p-2 rounded-md bg-white">
              <DraggableItem type={activeId as ComponentType} />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
