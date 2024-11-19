export type ContentType = 'text' | 'image' | 'carousel';

export type ImageContent = {
  type: Extract<ContentType, 'image'>;
  id: string;
  data: {
    width: number;
    src: string;
  };
};

export type TextContent = {
  type: Extract<ContentType, 'text'>;
  id: string;
  data: {
    text: string;
  };
};

export type CarouselContent = {
  type: Extract<ContentType, 'carousel'>;
  id: string;
  data: {
    images: ImageContent['data'][];
  };
};

export type Content = ImageContent | TextContent | CarouselContent;

export type ContentList = Content[];
