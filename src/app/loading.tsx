import LoadingAnimation from "@/components/loadingAnimation";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="flex justify-center -mt-48">
        <LoadingAnimation />
      </div>
    </div>
  );
}