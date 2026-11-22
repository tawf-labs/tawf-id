import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Float, FlowLine, IsoBox, FILLS, PAL, draw, drop, fade, pop, isoBox, isoAt, pts, useInViewLoop, useLoopClock, type Pt } from '../../motion';
import Coin from './Coin';

/* Hero art: a sealed credential block slides along a path up to a predicate gate. The gate scans it and only a
 * tick comes out the other side; the block (and what is written on it) goes back where it came from.
 * Every coordinate comes from one iso frame: O is the floor origin, u runs up-right along the path, v down-right. */
const O: Pt = [118, 352];
const at = (u: number, v: number, z = 0): Pt => { const p = isoAt(O[0], O[1], u, v); return [p[0], p[1] - z]; };
const box = (u: number, v: number, a: number, b: number, h: number, z = 0) => {
  const p = at(u, v + b / 2, z); // front-bottom corner of a box centred on v
  return { x: p[0], y: p[1], a, b, h };
};

const LEN = 390, TRACK_W = 84, TRACK_H = 10, TOP = TRACK_H;
const GATE_U = 205, PILLAR_V = 41, PILLAR_H = 96;
const BLOCK = 42, BU0 = 34, BU1 = GATE_U - BLOCK - 4;
const TICK_U0 = GATE_U + 10, PAD_U = 322, TICK_Z = TOP + 20;
const DUR = 9.5, INTRO = 2.6;

const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
const seg = (p: number, a: number, b: number) => ease((p - a) / (b - a));
const shift = (du: number, dz = 0) => `translate(${(0.866 * du).toFixed(2)}px, ${(-0.5 * du - dz).toFixed(2)}px)`;

/* Where everything is at loop phase p (0..1). */
function pose(p: number) {
  const going = seg(p, 0.0, 0.2), back = seg(p, 0.36, 0.56);
  const blockU = BU0 + (BU1 - BU0) * (going - back);
  const scan = p < 0.18 ? 0 : p < 0.34 ? Math.sin(((p - 0.18) / 0.16) * Math.PI) : 0;
  const tickIn = seg(p, 0.3, 0.38), tickOut = 1 - seg(p, 0.9, 0.98);
  const tickU = TICK_U0 + (PAD_U - TICK_U0) * seg(p, 0.34, 0.7);
  const ring = p < 0.7 || p > 0.9 ? 0 : (p - 0.7) / 0.2;
  return { blockU, scan, tickScale: 0.4 + 0.6 * tickIn, tickOpacity: tickIn * tickOut, tickU, ring };
}

const path = (a: Pt[], close = true) => `M${a.map((q) => q.join(' ')).join(' L')}${close ? ' Z' : ''}`;
const STATIC = pose(0.74);

export default function CredentialGateArt({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  const root = useRef<SVGSVGElement>(null);
  const blockRef = useRef<SVGGElement>(null);
  const tickRef = useRef<SVGGElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const ringRef = useRef<SVGGElement>(null);
  const [armed, setArmed] = useState(false);
  const live = useInViewLoop(root) && armed;

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setArmed(true), INTRO * 1000);
    return () => window.clearTimeout(t);
  }, [reduce]);

  useLoopClock(live, (p) => {
    const s = pose(p);
    if (blockRef.current) blockRef.current.style.transform = shift(s.blockU - BU0);
    if (planeRef.current) planeRef.current.style.opacity = String(0.18 + 0.6 * s.scan);
    if (tickRef.current) {
      tickRef.current.style.opacity = String(s.tickOpacity);
      tickRef.current.style.transform = `${shift(s.tickU - TICK_U0)} scale(${s.tickScale.toFixed(3)})`;
    }
    if (ringRef.current) {
      ringRef.current.style.opacity = String((0.7 * (1 - s.ring)).toFixed(3));
      ringRef.current.style.transform = `scale(${(1 + 0.9 * s.ring).toFixed(3)})`;
    }
  }, DUR);

  const still = !!reduce;
  const track = isoBox(...(Object.values(box(0, 0, LEN, TRACK_W, TRACK_H)) as [number, number, number, number, number]));
  const shadow = at(LEN / 2, 0);
  const gateFront = box(GATE_U, PILLAR_V, 16, 14, PILLAR_H);
  const gateBack = box(GATE_U, -PILLAR_V, 16, 14, PILLAR_H);
  const lintel = box(GATE_U, 0, 16, 2 * PILLAR_V + 14, 12, PILLAR_H);
  const blk = box(BU0, 0, BLOCK, BLOCK, 34, TOP);
  const bg = isoBox(blk.x, blk.y, blk.a, blk.b, blk.h);
  const pad = at(PAD_U, 0, TOP);
  const tick = at(TICK_U0, 0, TICK_Z);
  const lineD = `M${at(10, 0, TOP).join(' ')} L${at(LEN - 12, 0, TOP).join(' ')}`;

  /* A vertical scan plane stands in the gate opening. */
  const inner = PILLAR_V - 7;
  const plane = [at(GATE_U + 8, -inner, TOP), at(GATE_U + 8, inner, TOP), at(GATE_U + 8, inner, PILLAR_H - 2), at(GATE_U + 8, -inner, PILLAR_H - 2)];

  const mount = still ? undefined : 'hidden';
  return (
    <motion.svg
      ref={root}
      viewBox="40 90 500 330"
      className={`overflow-visible ${className}`}
      aria-hidden="true"
      focusable="false"
      initial={reduce ? false : mount}
      animate="show"
    >
      <motion.ellipse variants={fade(0.05, 0.7)} cx={shadow[0] + 10} cy={shadow[1] + 22} rx={205} ry={70} fill="rgba(16,38,31,.07)" />

      <Float as="g" amplitude={4} duration={9.5} run={armed} delay={0.5}>
        {/* the path: a low slab with a dashed line running down its middle */}
        <motion.g variants={drop(0, 0.15, 0.16, -36)}>
          <polygon points={pts(track.left)} fill={FILLS.paper[0]} />
          <polygon points={pts(track.right)} fill={FILLS.paper[1]} />
          <polygon points={pts(track.top)} fill={PAL.paper} />
          <polyline points={pts(track.edge)} fill="none" stroke="#fff" strokeOpacity=".7" />
        </motion.g>
        <motion.path variants={draw(0.5, 1)} d={lineD} stroke={PAL.line} strokeWidth="2" strokeLinecap="round" fill="none" />
        <FlowLine d={lineD} stroke={PAL.accent} strokeWidth={2.2} dash="1.4 5" duration={4} opacity={0.55} startAfter={INTRO} />

        {/* receiving pad where the tick lands */}
        <motion.g variants={pop(0.95)}>
          <ellipse cx={pad[0]} cy={pad[1]} rx={34} ry={19.6} fill={PAL.mint} stroke={PAL.accent} strokeOpacity=".35" />
          <ellipse cx={pad[0]} cy={pad[1]} rx={19} ry={11} fill="none" stroke={PAL.accent} strokeOpacity=".35" strokeDasharray="2 4" />
        </motion.g>
        <g style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: still ? 0 : 0 }} ref={ringRef}>
          <ellipse cx={pad[0]} cy={pad[1]} rx={34} ry={19.6} fill="none" stroke={PAL.accent} strokeWidth="2" />
        </g>

        {/* the gate: back pillar, scan plane, front pillar, lintel */}
        <IsoBox {...gateBack} fills={[...FILLS.ledger]} variants={drop(0, 0.35, 0.12, -50)} />
        <motion.g variants={fade(1.5, 0.7)}>
          <g ref={planeRef} style={{ opacity: still ? 0.45 : 0.18 }}>
            <polygon points={pts(plane)} fill={PAL.mint} />
            <polyline points={pts(plane.slice(0, 2) as Pt[])} fill="none" stroke={PAL.accent} strokeWidth="1.5" />
          </g>
        </motion.g>

        {/* the sealed credential block: its data rows stay on its own face */}
        <g ref={blockRef} style={{ transform: still ? shift(0) : undefined }}>
          <IsoBox {...blk} fills={[...FILLS.ledger]} variants={drop(0, 1.15, 0.16, -60)} />
          <motion.g variants={fade(1.7, 0.5)}>
            <g transform={`matrix(-.866 -.5 0 -1 ${blk.x} ${blk.y})`} fill="#fff" fillOpacity=".3">
              <rect x="6" y="7" width="24" height="4" rx="2" />
              <rect x="6" y="15" width="30" height="4" rx="2" />
              <rect x="6" y="23" width="17" height="4" rx="2" />
            </g>
            <ellipse cx={bg.top[0][0] + (bg.top[2][0] - bg.top[0][0]) / 2 + 0} cy={(bg.top[0][1] + bg.top[2][1]) / 2} rx={11} ry={6.4} fill={PAL.butter} />
            <ellipse cx={(bg.top[0][0] + bg.top[2][0]) / 2} cy={(bg.top[0][1] + bg.top[2][1]) / 2} rx={4} ry={2.3} fill={FILLS.ledger[1]} />
          </motion.g>
        </g>

        <IsoBox {...gateFront} fills={[...FILLS.ledger]} variants={drop(1, 0.35, 0.12, -50)} />
        <IsoBox {...lintel} fills={[...FILLS.zakat]} variants={drop(2, 0.35, 0.12, -50)} />

        {/* the only thing that comes out: a tick */}
        <g
          ref={tickRef}
          style={{
            transformBox: 'fill-box', transformOrigin: 'center',
            opacity: still ? STATIC.tickOpacity : 0,
            transform: still ? `${shift(STATIC.tickU - TICK_U0)} scale(1)` : 'scale(.4)',
          }}
        >
          <Coin cx={tick[0]} cy={tick[1]} r={18} color={PAL.accent} face={PAL.accent} />
          <path
            d={`M${tick[0] - 8} ${tick[1] + 0.5} L${tick[0] - 2} ${tick[1] + 5} L${tick[0] + 9} ${tick[1] - 5}`}
            stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round"
          />
        </g>
      </Float>
    </motion.svg>
  );
}
