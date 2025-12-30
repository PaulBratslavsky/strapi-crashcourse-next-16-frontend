import Image from "next/image";
import { cn, getStrapiMedia } from "@/lib/utils";

interface StrapiImageProps {
  readonly src: string;
  readonly alt?: string | null;
  readonly className?: string;
  readonly width?: number;
  readonly height?: number;
  readonly priority?: boolean;
  readonly fill?: boolean;
  readonly sizes?: string;
}

export function StrapiImage({
  src,
  alt,
  className = "",
  width = 800,
  height = 600,
  priority = false,
  fill = false,
  sizes,
}: StrapiImageProps) {
  if (!src) return null;

  const imageUrl = getStrapiMedia(src);

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt || ""}
        fill
        priority={priority}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt || ""}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={cn("w-full h-auto", className)}
    />
  );
}
