import { FaGoogle } from "react-icons/fa";
import { welcomeFeaturesList } from "./constants/welcome.constant";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen text-white px-6 py-22 max-w-sm mx-auto font-sans selection:bg-orange-500/30">
      <div className="flex flex-col items-center text-center mt-12 w-full relative">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-600/20 rounded-full blur-[80px] pointer-events-none z-0" />

        <div className="relative z-10 w-28 h-28 bg-gradient-to-b from-orange-400 to-orange-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-orange-600/10 mb-8">
          <span className="text-5xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
            🔥
          </span>
        </div>

        <h1 className="relative z-10 text-4xl font-bold tracking-tight text-white mb-6">
          Codestreak
        </h1>

        <div className="relative z-10 text-neutral-400 text-[15px] font-normal leading-relaxed">
          <p>Grind daily. Track together.</p>
          <p>Stay consistent.</p>
        </div>
      </div>

      <div className="w-full bg-[#121212]/90 border border-neutral-800/60 rounded-3xl overflow-hidden mt-4 backdrop-blur-sm">
        {welcomeFeaturesList.map((welcomeFeature, index) => (
          <div
            key={welcomeFeature.id}
            className={`flex items-center gap-4 px-6 py-[18px] ${
              index !== welcomeFeaturesList.length - 1
                ? "border-b border-neutral-800/40"
                : ""
            }`}>
            <div className="flex-shrink-0 mt-0.5 w-6 flex justify-center">
              {welcomeFeature.icon}
            </div>
            <p className="text-neutral-400 text-[15px] font-medium tracking-wide max-w-[200px] leading-snug">
              {welcomeFeature.title}
            </p>
          </div>
        ))}
      </div>

      <div className="w-full mt-auto pt-8">
        <button className="w-full bg-white hover:bg-neutral-100 text-black font-bold py-[18px] px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-200 shadow-lg active:scale-[0.99] cursor-pointer">
          <FaGoogle className="text-lg" />
          <span className="text-[15px] tracking-wide font-semibold">
            Continue with Google
          </span>
        </button>
      </div>
    </div>
  );
};

export default Welcome;
