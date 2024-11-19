import { FC, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import { X as CrossIcon } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import 'react-quill/dist/quill.snow.css';

import { TextContent } from '@/features/contentEditor/types';

type TextPreviewEditorProps = {
  content: TextContent;
  onFocus?: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

export const TextPreviewEditor: FC<TextPreviewEditorProps> = ({
  content,
  onFocus = () => {},
  onDelete,
  onEdit,
}) => {
  const [text, setText] = useState(content.data.text);
  const [isEditing, setIsEditing] = useState(false);

  const quillRef = useRef<HTMLDivElement>(null);

  useClickOutside(quillRef, () => setIsEditing(false));

  const handleOpenEdit = () => {
    onFocus(content.id);
    setIsEditing(true);
  };

  const handleDelete = () => {
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
