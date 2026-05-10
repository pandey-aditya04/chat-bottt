import { cn } from "@/lib/utils";

export const RobotFlyby = () => {
  return (
    <div className={cn("w-full h-screen flex items-center justify-center bg-black")}>
      <div className="w-full h-full max-w-5xl rounded-xl overflow-hidden border border-gray-700 shadow-2xl scale-90 md:scale-100 transition-transform duration-700">
        <iframe
          src="https://my.spline.design/untitled-rv0hx3zVdoM6t2ydngxuS7zi/"
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  );
};
