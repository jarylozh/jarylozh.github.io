import Image from "next/image";

import { cn } from "../lib/utils.js";

/** Photograph faded out along its lower edge. */
export function Portrait({
  alt,
  className,
  ...props
}: React.ComponentProps<typeof Image>) {
  return (
    <Image
      alt={alt}
      data-slot="portrait"
      className={cn("h-auto mask-b-from-80% mask-b-to-100%", className)}
      {...props}
    />
  );
}
