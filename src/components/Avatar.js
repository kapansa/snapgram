import Image from "next/image";

export default function Avatar({ name, image, size = 36, className = "" }) {
  const style = { width: size, height: size };

  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={size}
        height={size}
        unoptimized
        style={style}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{ ...style, fontSize: size * 0.4 }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-500 font-bold text-white ${className}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
