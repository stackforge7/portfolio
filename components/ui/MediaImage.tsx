import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";
import type { ImageAsset } from "@/types/portfolio";

interface MediaImageProps extends Omit<ImageProps, "src" | "alt" | "fill" | "placeholder"> {
  image: ImageAsset;
  /** Render with empty alt when adjacent text already conveys the content. */
  decorative?: boolean;
}

/** Fills its (positioned) parent; static imports get an automatic blur placeholder. */
export function MediaImage({ image, decorative = false, className, ...props }: MediaImageProps) {
  return (
    <Image
      src={image.src}
      alt={decorative ? "" : image.alt}
      fill
      placeholder={typeof image.src === "string" ? "empty" : "blur"}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}
