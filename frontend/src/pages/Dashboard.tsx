import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, AlertTriangle, Inbox } from "lucide-react";
import { DISBURSEMENT_ABI } from "../lib/abis";
import { DISBURSEMENT_ADDRESS, BASE_SEPOLIA_EXPLORER } from "../lib/constants";
import { formatEther } from "viem";

const AMIL_ADDRESS = (import.meta.env.VITE_AMIL_ADDRESS || "") as `0x${string}`;

type DisbursedEvent = {
  did: string;
  recipient: `0x${string}`;
  amount: bigint;
  cycleId: bigint;
  nullifier: bigint;
  txHash: `0x${string}`;
  timestamp: number;
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

export function Dashboard() {
  const { address } = useAccount();
  const reduced = useReducedMotion();
  const anim = (delay = 0) => (reduced ? { initial: {}, animate: {}, transition: {} } : fadeUp(delay));

  const [events, setEvents] = useState<DisbursedEvent[]>([]);

  const { data: cycleId } = useReadContract({ address: DISBURSEMENT_ADDRESS, abi: DISBURSEMENT_ABI, functionName: "currentCycleId" });
  const { data: totalDisbursed } = useReadContract({ address: DISBURSEMENT_ADDRESS, abi: DISBURSEMENT_ABI, functionName: "totalDisbursed" });
  const { data: claimCount } = useReadContract({ address: DISBURSEMENT_ADDRESS, abi: DISBURSEMENT_ABI, functionName: "claimCount" });

  useWatchContractEvent({
    address: DISBURSEMENT_ADDRESS,
    abi: DISBURSEMENT_ABI,
    eventName: "Disbursed",
    onLogs(logs) {
      for (const log of logs) {
        const { did, recipient, amount, cycleId: cId, nullifier } = log.args as {
          did: string; recipient: `0x${string}`; amount: bigint; cycleId: bigint; nullifier: bigint;
        };
        setEvents((prev) => [
          { did, recipient, amount, cycleId: cId, nullifier, txHash: log.transactionHash as `0x${string}`, timestamp: Date.now() },
          ...prev,
        ]);
      }
    },
  });

  const isAmil = AMIL_ADDRESS && address?.toLowerCase() === AMIL_ADDRESS.toLowerCase();

  const STATS = [
    { label: "Active Cycle", value: cycleId?.toString() ?? "—" },
    { label: "Total Disbursed", value: totalDisbursed !== undefined ? `${formatEther(totalDisbursed)} ETH` : "—" },
    { label: "Verified Claims", value: claimCount?.toString() ?? "—" },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 px-6" style={{ background: "var(--color-tawf-sand)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div {...anim()} className="mb-10">
          <p className="text-xs tracking-widest uppercase mb-3 font-medium" style={{ color: "var(--color-tawf-gold)" }}>
            Amil Institution View
          </p>
          <h1 className="text-4xl font-light mb-3" style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}>
            Disbursement Dashboard
          </h1>
          <p className="text-sm" style={{ color: "var(--color-tawf-muted)" }}>
            Real-time verification events and disbursement history from Base Sepolia.
          </p>
        </motion.div>

        {/* Role warning */}
        {address && !isAmil && AMIL_ADDRESS && (
          <motion.div
            {...anim(0.05)}
            className="flex items-start gap-3 p-4 rounded-2xl mb-8 border"
            style={{ background: "color-mix(in srgb, #f59e0b 8%, transparent)", borderColor: "color-mix(in srgb, #f59e0b 25%, transparent)" }}
            role="alert"
          >
            <AlertTriangle size={18} aria-hidden="true" style={{ color: "#f59e0b", flexShrink: 0, marginTop: 2 }} />
            <p className="text-sm" style={{ color: "var(--color-tawf-ink)" }}>
              Connected wallet is not the registered amil address. Disbursement actions are restricted.
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {STATS.map(({ label, value }, i) => (
            <motion.div
              key={label}
              {...anim(i * 0.08)}
              className="p-6 rounded-2xl border"
              style={{ background: "var(--color-tawf-white)", borderColor: "color-mix(in srgb, var(--color-tawf-green) 10%, transparent)" }}
            >
              <p className="text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: "var(--color-tawf-muted)" }}>
                {label}
              </p>
              <p
                className="text-3xl font-light"
                style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)", fontVariantNumeric: "tabular-nums" }}
              >
                {value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Events table */}
        <motion.div {...anim(0.2)} className="rounded-2xl border overflow-hidden" style={{ borderColor: "color-mix(in srgb, var(--color-tawf-green) 10%, transparent)" }}>
          <div className="px-6 py-4 border-b" style={{ background: "var(--color-tawf-white)", borderColor: "color-mix(in srgb, var(--color-tawf-green) 8%, transparent)" }}>
            <h2 className="text-lg font-medium" style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}>
              Disbursement Events
            </h2>
          </div>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3" style={{ background: "var(--color-tawf-white)" }}>
              <Inbox size={32} aria-hidden="true" style={{ color: "var(--color-tawf-muted)" }} />
              <p className="text-sm" style={{ color: "var(--color-tawf-muted)" }}>
                No disbursement events yet. Events appear in real-time as claims are verified.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Disbursement events">
                <thead>
                  <tr style={{ background: "var(--color-tawf-sand)" }}>
                    {["DID", "Recipient", "Amount", "Cycle", "Nullifier", "Tx Hash", "Time"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase font-medium" style={{ color: "var(--color-tawf-muted)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev, i) => (
                    <tr
                      key={`${ev.txHash}-${i}`}
                      style={{ background: i % 2 === 0 ? "var(--color-tawf-white)" : "var(--color-tawf-sand)", borderTop: "1px solid color-mix(in srgb, var(--color-tawf-green) 6%, transparent)" }}
                    >
                      <td className="px-4 py-3 font-mono max-w-[140px] truncate" style={{ color: "var(--color-tawf-green)" }} title={ev.did}>
                        {ev.did}
                      </td>
                      <td className="px-4 py-3 font-mono" style={{ color: "var(--color-tawf-muted)" }}>
                        {ev.recipient.slice(0, 6)}…{ev.recipient.slice(-4)}
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--color-tawf-ink)", fontVariantNumeric: "tabular-nums" }}>
                        {formatEther(ev.amount)} ETH
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--color-tawf-muted)", fontVariantNumeric: "tabular-nums" }}>
                        {ev.cycleId.toString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-tawf-muted)" }}>
                        {ev.nullifier.toString().slice(0, 10)}…
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`${BASE_SEPOLIA_EXPLORER}/tx/${ev.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tawf-gold rounded"
                          style={{ color: "var(--color-tawf-gold)" }}
                          aria-label={`View transaction ${ev.txHash} on Basescan`}
                        >
                          {ev.txHash.slice(0, 8)}… <ExternalLink size={10} aria-hidden="true" />
                        </a>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--color-tawf-muted)" }}>
                        {new Intl.DateTimeFormat("id-ID", { dateStyle: "short", timeStyle: "short" }).format(new Date(ev.timestamp))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
