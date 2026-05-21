export default function HeroSliderSkeleton() {
  return (
    <section className="relative overflow-hidden w-full flex flex-col items-stretch justify-start min-h-[80vh] lg:min-h-[85vh] bg-[#fcf6ef]">
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #ede8e1 25%, #f5f0e8 50%, #ede8e1 75%);
          background-size: 600px 100%;
          animation: shimmer 1.6s ease-in-out infinite;
          border-radius: 8px;
        }
      `}</style>
      <div className="w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row h-full relative z-10">
        <div className="w-full lg:w-[50%] xl:w-[55%] h-[45vh] lg:h-[85vh] skeleton" />
        <div className="w-full lg:w-[50%] xl:w-[45%] flex items-center justify-center p-6 sm:p-10 pb-28 lg:p-16 bg-[#fcf6ef]">
          <div className="flex flex-col items-center w-full max-w-lg gap-4">
            <div className="skeleton h-3 w-32 rounded-full" />
            <div className="skeleton h-10 w-72 rounded-lg mt-2" />
            <div className="skeleton h-9 w-56 rounded-lg" />
            <div className="skeleton h-[1px] w-48 mt-2" style={{ animationDelay: "0.1s" }} />
            <div className="skeleton h-3 w-64 rounded-full mt-1" />
            <div className="skeleton h-3 w-56 rounded-full" />
            <div className="skeleton h-12 w-48 rounded-xl mt-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
