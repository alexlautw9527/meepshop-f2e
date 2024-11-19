import type { ContentType, Content } from '@/features/contentEditor/types';
import {
  textDefaultData,
  imageDefaultData,
  carouselDefaultData,
} from '@/features/contentEditor/data';

export const createNewContent = (
  type: ContentType,
  id: string
): Content | null => {
  switch (type) {
    case 'text':
      return {
        type,
        id,
        data: textDefaultData,
      };
    case 'image':
      return {
        type,
        id,
        data: imageDefaultData,
      };
    case 'carousel':
      return {
        type,
        id,
        data: carouselDefaultData,
      };
    default:
      return null;
  }
};
