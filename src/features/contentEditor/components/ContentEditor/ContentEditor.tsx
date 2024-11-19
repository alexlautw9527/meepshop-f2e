import { useState, useCallback, FC, PropsWithChildren } from 'react';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

import {
  Draggable,
  Droppable,
  ItemCardOverlay,
  ItemCard,
} from '@/features/contentEditor/components/DnD/';

import { TextPreviewEditor } from '@/features/contentEditor/components/TextPreviewEditor';
import { ImagePreviewEditor } from '@/features/contentEditor/components/ImagePreviewEditor';

import { PREVIEW_DROPPABLE_ID } from '@/features/contentEditor/constants';
import type {
  Content,
  ContentList,
  ContentType,
} from '@/features/contentEditor/types';

import { createNewContent } from '@/features/contentEditor/utils';
import { generateUniqueId } from '@/lib/utils';
import { CarouselPreviewEditor } from '@/features/contentEditor/components/CarouselPreviewEditor/CarouselPreviewEditor';

const Container = ({ children }: PropsWithChildren) => (
  <div className="flex h-screen relative">{children}</div>
);

const MainContent = ({ children }: PropsWithChildren) => (
  <main className="w-full overflow-y-auto z-10 relative">{children}</main>
);

const Sidebar: FC = () => (
  <div className="w-64 p-4 border-r space-y-4 h-screen relative">
    <h2 className="font-semibold mb-4">新增內容元件</h2>
    <Draggable id="text">
      <ItemCard type="text" />
    </Draggable>
    <Draggable id="image">
      <ItemCard type="image" />
    </Draggable>
    <Draggable id="carousel">
      <ItemCard type="carousel" />
    </Draggable>
  </div>
);

type ContentListViewProps = {
  contentList: ContentList;
  onDelete: (id: string) => void;
  onEdit: (content: Content) => void;
};

export const ContentListView = ({
  contentList,
  onDelete,
  onEdit,
}: ContentListViewProps) => (
  <div className="p-2 w-full">
    {contentList.length === 0 && (
      <p className="text-slate-400">拖曳元件至此處新增內容</p>
    )}

    {contentList.map((content) => {
      switch (content.type) {
        case 'text':
          return (
            <TextPreviewEditor
              key={content.id}
              content={content}
              onDelete={onDelete}
              onEdit={(id, text) => onEdit({ ...content, id, data: { text } })}
            />
          );
        case 'image':
          return (
            <ImagePreviewEditor
              key={content.id}
              content={content}
              onDelete={onDelete}
              onEdit={({ id, src, width }) =>
                onEdit({ ...content, id, data: { src, width } })
              }
            />
          );
        case 'carousel':
          return (
            <CarouselPreviewEditor
              key={content.id}
              content={content}
              onDelete={onDelete}
            />
          );
        default:
          return null;
      }
    })}
  </div>
);

export const ContentEditor = () => {
  const [contentList, setContentList] = useState<ContentList>([]);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDraggedItemId(event.active.id.toString());
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setDraggedItemId(null);
    if (event.over && event.over.id === PREVIEW_DROPPABLE_ID) {
      const type = event.active.id as ContentType;
      const id = generateUniqueId();

      const newContent = createNewContent(type, id);
      if (newContent) {
        setContentList((prev) => [...prev, newContent]);
      }
    }
  }, []);

  const handleDragCancel = useCallback(() => {
    setDraggedItemId(null);
  }, []);

  const handleDelete = (id: string) => {
    setContentList((prev) => prev.filter((content) => content.id !== id));
  };

  const handleEdit: ContentListViewProps['onEdit'] = (targetContent) => {
    setContentList((prev) =>
      prev.map((item) => (item.id === targetContent.id ? targetContent : item))
    );
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
    >
      <Container>
        <Sidebar />
        <MainContent>
          <Droppable
            id={PREVIEW_DROPPABLE_ID}
            className="p-2 w-full min-h-full"
          >
            <ContentListView
              contentList={contentList}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </Droppable>
        </MainContent>
      </Container>
      {draggedItemId ? (
        <ItemCardOverlay draggedItemId={draggedItemId as ContentType} />
      ) : null}
    </DndContext>
  );
};
