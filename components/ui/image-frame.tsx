import Image from "next/image";

type ImageFrameProps = {
  /** Optional club photo; when absent the slot renders the crest band. */
  src?: string;
  /** Alt text for a real photo; the decorative fallback stays empty. */
  alt?: string;
  /** Fixed aspect ratio shared by the photo and its fallback (no layout shift). */
  ratio?: "3/1" | "16/9" | "4/3";
  className?: string;
};

const ratioClasses = {
  "3/1": "aspect-[3/1]",
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
} as const;

// A fixed-ratio imagery slot with a crest fallback: club photos can drop in
// later without reflowing the surrounding layout.
export default function ImageFrame({
  src,
  alt = "",
  ratio = "16/9",
  className = "",
}: ImageFrameProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-surface squircle bg-club-100 ${ratioClasses[ratio]} ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-gradient-to-br from-club-700 to-club-950">
          <Image
            src="/eultc-badge.png"
            alt=""
            width={56}
            height={56}
            className="size-12 opacity-90 sm:size-14"
          />
        </div>
      )}
    </div>
  );
}
