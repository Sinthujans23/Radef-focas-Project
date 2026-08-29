import { colorForName, initialsForName } from "@/lib/avatarColor";

export default function Avatar({
  name,
  imageUrl,
  size = 40,
}: {
  name: string;
  imageUrl?: string;
  size?: number;
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover ring-1 ring-gold-300"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${colorForName(
        name
      )}`}
    >
      {initialsForName(name)}
    </div>
  );
}
