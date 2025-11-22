'use client';

import Image from "next/image";

export function LoadingAnimation() {
  return (
    <div
      className="
        relative
        w-32 h-32
        md:w-40 md:h-40
        lg:w-48 lg:h-48
        overflow-hidden
      "
      aria-hidden="true"
    >
      {/* Frame 1 */}
      <Image
        src="/loadingAnimation/frame_01.png"
        alt="Loading animation frame 1"
        fill
        className="
          object-contain
          animate-loading-animation
          delay-[0ms]
        "
        priority
      />

      {/* Frame 2 */}
      <Image
        src="/loadingAnimation/frame_02.png"
        alt="Loading animation frame 2"
        fill
        className="
          object-contain
          animate-loading-animation
          delay-[1000ms]
        "
      />

      {/* Frame 3 */}
      <Image
        src="/loadingAnimation/frame_03.png"
        alt="Loading animation frame 3"
        fill
        className="
          object-contain
          animate-loading-animation
          delay-[2000ms]
        "
      />
    </div>
  );
}

export default LoadingAnimation;
