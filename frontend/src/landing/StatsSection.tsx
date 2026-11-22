import { Reveal, IsoGrid, CONTAINER } from "../motion";

/* The protocol numbers, stated exactly as the protocol states them. */
const STATS = [
  { value: "5", label: "Protocol Actors" },
  { value: "3", label: "Smart Contracts" },
  { value: "Groth16", label: "Proof System" },
  { value: "Base", label: "Sepolia Network" },
];

export function StatsSection() {
  return (
    <section aria-label="Protocol statistics" className="relative overflow-hidden border-y border-line bg-ink py-11">
      <IsoGrid color="#2A4A3E" cy="50%" />
      <div className={`${CONTAINER} relative`}>
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map(({ value, label }, i) => (
            <Reveal key={label} delay={i * 0.08} className="text-center" blur={false} y={16}>
              <dt className="text-[clamp(26px,3vw,36px)] font-medium leading-none tracking-[-0.03em] text-paper">
                {value}
              </dt>
              <dd className="mt-2.5 text-[13px] font-medium uppercase tracking-[0.08em] text-white/80">
                {label}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
