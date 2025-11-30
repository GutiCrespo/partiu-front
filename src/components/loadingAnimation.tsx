'use client';

export function LoadingAnimation() {
  return (
    <div
      className="flex items-center justify-center"
      aria-hidden="true"
    >
      <div
        className="
          overflow-hidden
          bg-[url('/loadingAnimation/sprite.png')]
          bg-no-repeat
          bg-left-top
          animate-loading-sprite
          w-[347.77px]
          h-[128px]
        "
      />
    </div>
  );
}

export default LoadingAnimation;