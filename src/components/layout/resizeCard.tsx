interface ImageProps {
  src: string;
  alt?: string;
  ratio?: "1:1" | "3:4" | "4:3";
  width?: string;
  href?: string;
  className?: string;
}

const RATIO_MAP = {
  "1:1": "aspect-square",
  "3:4": "aspect-[3/4]",
  "4:3": "aspect-[4/3]",
};

export function ResizeCard({ 
  src, 
  alt = "", 
  ratio = "1:1",
  width = "100%",
  href,
  className = ""
}: ImageProps) {
  const containerWidth = width === "100%" ? "w-full" : "";
  
  return (
    <div
      style={width !== "100%" ? { width } : undefined}
      className={`${containerWidth} mb-3 rounded-none overflow-hidden leading-none break-inside-avoid shadow-lg border-8 border-white transition-transform duration-300 hover:scale-105 hover:rotate-3 hover:shadow-2xl cursor-pointer ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-auto ${RATIO_MAP[ratio]} object-cover block`}
      />
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white px-4 py-3 text-center text-gray-900 font-semibold  transition-colors"
        >
          Haz click aquí
        </a>
      )}
    </div>
  );
}
