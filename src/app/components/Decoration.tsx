import Image from "next/image";
import minar from "@/public/minarepakistan.png";
import mandala from "@/public/mandala.png";

export default function Decoration() {
  return (
    <>
      {/* Bottom-left decoration (Minar) */}
      <Image
        src={minar}
        alt="Minar-e-Pakistan"
        width={170}
        height={170}
        className="decoration fixed z-10"
        style={{
          bottom: "64px", // distance from bottom of viewport
          left: "72px",   // distance from left edge
        }}
        priority
      />

      {/* Bottom-right decoration (Mandala) */}
      <Image
        src={mandala}
        alt="Mandala Design"
        width={150}
        height={150}
        className="decoration fixed animate-float z-10"
        style={{
          bottom: "60px", // adjust to align visually with Minar
          right: "68px",  // distance from right edge
        }}
        priority
      />
    </>
  );
}
