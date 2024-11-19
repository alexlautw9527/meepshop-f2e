import { FC, useState, useRef } from 'react';
import { X as CrossIcon } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';

import type { ImageContent } from '@/features/contentEditor/types';

export const ImagePreviewEditor: FC<{
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
  const [imageData, setImageData] = useState<ImageContent['data']>(
    content.data
  );
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useClickOutside(inputRef, () => setIsEditing(false));

  const handleOpenEdit = () => {
    onFocus(content.id);
    setIsEditing(true);
  };

  const handleDelete = () => {
    onDelete(content.id);
  };

  const handleUpdateContent = (updated: Partial<ImageContent['data']>) => {
    setImageData((prev) => ({ ...prev, ...updated }));
    onEdit({ id: content.id, ...imageData, ...updated });
  };

  return (
    <div onDoubleClick={handleOpenEdit}>
      {isEditing ? (
        <div
          ref={inputRef}
          className="mb-1 p-2 border border-gray-300 rounded-md"
        >
          <label htmlFor="image-url" className="block mb-1">
            Image URL
          </label>
          <input
            id="image-url"
            type="text"
            value={imageData.src}
            onChange={(e) => handleUpdateContent({ src: e.target.value })}
            className="mb-2 p-1 border rounded w-full"
            placeholder="Image URL"
          />
          <label htmlFor="image-width" className="block mb-1">
            Width
          </label>
          <input
            id="image-width"
            value={imageData.width}
            onChange={(e) => handleUpdateContent({ width: +e.target.value })}
            className="mb-2 p-1 border rounded w-full"
            placeholder="Width"
          />
        </div>
      ) : (
        <div className="group relative mb-1">
          <img
            src={imageData.src}
            alt=""
            width={imageData.width}
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
