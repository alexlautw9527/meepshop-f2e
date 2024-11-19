import { useEffect, useState, FC } from 'react';

import {
  Carousel,
  CarouselContent as Content,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

import { Card, CardContent } from '@/components/ui/card';
import { X as CrossIcon } from 'lucide-react';
import type { CarouselContent } from '@/features/contentEditor/types';

type CarousePreviewEditorProps = {
  content: CarouselContent;
  onDelete: (id: string) => void;
};

export const CarouselPreviewEditor: FC<CarousePreviewEditorProps> = ({
  content,
  onDelete,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const handleDelete = () => {
    onDelete(content.id);
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex justify-center items-center flex-col group relative">
      <button
        type="button"
        onClick={handleDelete}
        className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100"
      >
        <CrossIcon className="w-4 h-4" />
      </button>
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <Content>
          {content?.data?.images.map((item) => (
            <CarouselItem key={item.src}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img
                    className="object-cover"
                    src={item.src}
                    width={item.width}
                    alt=""
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </Content>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        {current} of {count}
      </div>
    </div>
  );
};
