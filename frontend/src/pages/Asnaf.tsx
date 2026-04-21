import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const fadeUpView = (delay = 0) => ({
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const ASNAF = [
  {
    name: "Fakir",
    short: "Individuals with almost no material possessions or means of livelihood.",
    detail:
      "A fakir is someone who has less than half of what is needed to meet basic daily living needs. For illustrative context, if the reasonable daily cost of basic sustenance is S$15 and an individual has only S$3 available daily to cover essentials, this reflects a level of insufficiency consistent with the fakir category under MUIS guidance.",
  },
  {
    name: "Miskin",
    short: "Individuals whose income and assets are insufficient to meet basic needs.",
    detail:
      "A miskin possesses some means of livelihood but still falls short of covering essential daily living costs. For example, if the reasonable daily cost of basic sustenance is S$15 and an individual has S$10 available daily, they have partial means but insufficient resources, which aligns with the miskin category under MUIS guidance.",
  },
  {
    name: "Amil",
    short: "Those appointed to collect, manage, and distribute zakat.",
    detail:
      "Amil are individuals or institutions formally entrusted with the collection, management, and distribution of zakat funds. In accordance with MUIS guidance, up to one-eighth (1/8) of the zakat collected may be allocated toward legitimate administrative costs associated with zakat management and distribution.",
  },
  {
    name: "Muallaf",
    short: "Individuals newly embracing Islam or whose alignment with the community is being strengthened.",
    detail:
      "This category includes individuals whose hearts are to be reconciled and supported in strengthening their faith and integration into the Muslim community. Zakat in this category may be used to assist with religious education and essential needs as recognised under MUIS guidance.",
  },
  {
    name: "Riqab",
    short: "Those seeking liberation from severe constraints or bondage.",
    detail:
      "Historically, riqab referred to freeing enslaved individuals. In the contemporary context, as recognised under MUIS guidance, this category may include individuals experiencing severe socio-economic constraints that significantly restrict their freedom, including those requiring support in overcoming structural limitations through education and rehabilitation.",
  },
  {
    name: "Gharimin",
    short: "Individuals burdened by legitimate debt and unable to cover basic needs.",
    detail:
      "A gharimin refers to a person in debt that resulted from necessary and permissible expenditures, and who is unable to meet basic living needs due to that debt. Zakat may be allocated to assist in settling such debts so that essential needs are not compromised, in line with MUIS guidance.",
  },
  {
    name: "Fisabilillah",
    short: "Those striving for the betterment of the Muslim community in accordance with Islamic principles.",
    detail:
      "This category includes efforts undertaken for the advancement of Islam and the collective welfare of the Muslim community. In the contemporary context recognised by MUIS, this may encompass initiatives such as religious education, community welfare programmes, and institutional support that align with the principles of fi sabilillah.",
  },
  {
    name: "Ibnus Sabil",
    short: "Travelers who are temporarily in need of financial assistance.",
    detail:
      "Ibnus sabil refers to a wayfarer who, despite having wealth at home, is stranded or in need during travel and lacks the means to return or continue. Zakat may be used to assist such individuals in meeting their immediate needs and facilitating their return, as recognised under MUIS guidance.",
  },
];

function AsnafCard({ name, short, detail, delay }: { name: string; short: string; detail: string; delay: number }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const animView = (d = 0) =>
    reduced ? { initial: {}, whileInView: {}, viewport: { once: true }, transition: {} } : fadeUpView(d);

  return (
    <motion.div
      {...animView(delay)}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "color-mix(in srgb, var(--color-tawf-green) 12%, transparent)", background: "var(--color-tawf-white)" }}
    >
      <div className="p-6">
        <p className="text-xs tracking-widest uppercase mb-1 font-medium" style={{ color: "var(--color-tawf-gold)" }}>
          Asnaf
        </p>
        <h2 className="text-2xl font-light mb-2" style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}>
          {name}
        </h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-tawf-muted)" }}>
          {short}
        </p>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs tracking-widest uppercase font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tawf-gold rounded"
          style={{ color: "var(--color-tawf-green)" }}
          aria-expanded={open}
        >
          {open ? "Show less" : "Learn more"}
        </button>
      </div>
      {open && (
        <div
          className="px-6 pb-6 pt-0 text-sm leading-relaxed border-t"
          style={{ color: "var(--color-tawf-muted)", borderColor: "color-mix(in srgb, var(--color-tawf-green) 8%, transparent)", background: "var(--color-tawf-sand)" }}
        >
          <p className="pt-4">{detail}</p>
        </div>
      )}
    </motion.div>
  );
}

export function Asnaf() {
  const reduced = useReducedMotion();
  const anim = (delay = 0) =>
    reduced ? { initial: {}, animate: {}, transition: {} } : fadeUp(delay);

  return (
    <div style={{ background: "var(--color-tawf-sand)" }}>
      {/* Header */}
      <section className="pt-40 pb-16 px-6" style={{ background: "var(--color-tawf-green)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.p {...anim()} className="text-xs tracking-widest uppercase mb-4 font-medium" style={{ color: "var(--color-tawf-gold)" }}>
            Quran 9:60
          </motion.p>
          <motion.h1
            {...anim(0.1)}
            className="text-5xl font-light mb-6"
            style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-sand)", textWrap: "balance" }}
          >
            The 8 Asnaf
          </motion.h1>
          <motion.p {...anim(0.2)} className="text-base leading-relaxed" style={{ color: "rgba(249,246,240,0.65)" }}>
            The Quran specifies 8 categories of people eligible to receive Zakat. tawf-did uses zero-knowledge proofs to verify eligibility for these categories without disclosing personal financial data.
          </motion.p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {ASNAF.map(({ name, short, detail }, i) => (
            <AsnafCard key={name} name={name} short={short} detail={detail} delay={i * 0.07} />
          ))}
        </div>
      </section>
    </div>
  );
}
