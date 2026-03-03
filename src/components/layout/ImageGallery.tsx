import { ResizeCard } from "./resizeCard";

interface ImageItem {
  id: string;
  src: string;
  alt?: string;
  ratio?: "1:1" | "3:4" | "4:3";
  href?: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
}

export function ImageGallery({ 
  images
}: ImageGalleryProps) {
  return (
    <div className=" columns-2 lg:columns-3 xl:columns-4 gap-3">
      {images.map((image) => (
        <ResizeCard
          key={image.id}
          src={image.src}
          alt={image.alt}
          ratio={image.ratio || "1:1"}
          href={image.href}
          className="break-inside-avoid"
        />
      ))}
    </div>
  );
}
