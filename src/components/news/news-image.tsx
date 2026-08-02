import Image from "next/image";

export function NewsImage({
  src,
  alt,
  className,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
      className={`object-cover ${className ?? ""}`}
    />
  );
}
