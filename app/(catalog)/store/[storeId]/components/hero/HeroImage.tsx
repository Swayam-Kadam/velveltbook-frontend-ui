import Image from "next/image";

import type { Store } from "../types";

interface Props {
  store: Store;
}

export default function HeroImage({ store }: Props) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={store.coverImage}
        alt={store.name}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 70vw"
        className="object-cover"
      />
    </div>
  );
}
