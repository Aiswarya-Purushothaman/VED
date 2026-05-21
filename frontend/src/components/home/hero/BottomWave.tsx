export default function BottomWave() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden z-20"
      style={{ height: "60px", transform: "translateY(1px)" }}
    >
      <style>{`
        @keyframes waveShift  { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-30px); } }
        @keyframes waveShift2 { 0%,100% { transform: translateX(0); } 50% { transform: translateX(20px); } }
      `}</style>

      <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-full"
        style={{ animation: "waveShift 7s ease-in-out infinite" }}
        xmlns="http://www.w3.org/2000/svg">
        <path d="M0,80 C180,40 360,70 540,50 C720,30 900,60 1080,42 C1260,24 1380,55 1440,38 L1440,80 Z" fill="rgba(237,250,250,0.4)" />
      </svg>

      <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-full"
        style={{ animation: "waveShift2 5.5s ease-in-out infinite" }}
        xmlns="http://www.w3.org/2000/svg">
        <path d="M0,80 C220,35 440,65 660,45 C880,25 1100,55 1320,35 C1380,28 1420,40 1440,32 L1440,80 Z" fill="rgba(237,250,250,0.6)" />
      </svg>

      <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M0,80 C240,28 480,60 720,38 C960,16 1200,50 1440,28 L1440,80 Z" fill="#EDFAFA" />
      </svg>
    </div>
  );
}
