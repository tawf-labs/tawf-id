import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Float, IsoBox, FILLS, PAL, draw, drop, fade, pop, isoBox, VIEW } from '../../motion';
import Coin from './Coin';

/* Three small iso glyphs, one per feature. Same frame as the hero: 96 x 96, floor centre at (48, 74). */
function Frame({ label, className, children }: { label?: string; className: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 96 96"
      className={`overflow-visible ${className}`}
      aria-hidden="true"
      focusable="false"
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={VIEW}
    >
      <motion.ellipse variants={fade(0.05, 0.5)} cx="48" cy="78" rx="38" ry="11" fill="rgba(16,38,31,.07)" />
      {children}
    </motion.svg>
  );
}

/* Matrix that lays flat drawing onto the top face of a box: x runs up-right, y runs up-left, origin at the front corner. */
const topPlane = (F1: [number, number]) => `matrix(.866 -.5 -.866 -.5 ${F1[0]} ${F1[1]})`;

/* Proof: a ledger slab stamped with a check. */
export function ProofGlyph({ className = '' }: { className?: string }) {
  return (
    <Frame className={className}>
      <IsoBox x={48} y={76} a={34} b={34} h={12} fills={[...FILLS.ledger]} variants={drop(0, 0.1, 0.15, -30)} />
      <IsoBox x={48} y={64} a={34} b={34} h={8} fills={[...FILLS.paper]} variants={drop(1, 0.1, 0.15, -30)} />
      <Float as="g" amplitude={2.5} duration={6} delay={1}>
        <Coin cx={48} cy={36} r={17} color={PAL.accent} face={PAL.accent} variants={pop(0.6)} />
        <motion.path
          variants={draw(0.9, 0.5)}
          d="M40 36.5 L46 41 L57 31"
          stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"
        />
      </Float>
    </Frame>
  );
}

/* DID: an identity card lying on a plinth, with a key coin beside it. */
export function DidGlyph({ className = '' }: { className?: string }) {
  const card = isoBox(48, 70, 46, 30, 8);
  return (
    <Frame className={className}>
      <IsoBox x={48} y={76} a={50} b={34} h={6} fills={[...FILLS.sadaqah]} variants={drop(0, 0.1, 0.15, -30)} />
      <Float as="g" amplitude={2.5} duration={6.5} delay={0.6}>
        <IsoBox x={48} y={70} a={46} b={30} h={8} fills={[...FILLS.paper]} variants={drop(1, 0.1, 0.15, -30)} />
        <motion.g variants={fade(0.7, 0.5)}><g transform={topPlane(card.F1)}>
          <circle cx="11" cy="14" r="6.5" fill={PAL.accent} />
          <rect x="23" y="8" width="16" height="3" rx="1.5" fill={PAL.ink} />
          <rect x="23" y="14" width="11" height="3" rx="1.5" fill={PAL.line} />
          <rect x="23" y="20" width="14" height="3" rx="1.5" fill={PAL.line} />
        </g></motion.g>
        <Coin cx={76} cy={30} r={9} color={PAL.honey} face={PAL.butter} variants={pop(0.9)} />
      </Float>
    </Frame>
  );
}

/* Sharia: an eight-point star laid on a slab, the geometric motif of the stack. */
export function ShariaGlyph({ className = '' }: { className?: string }) {
  const slab = isoBox(48, 74, 44, 44, 12);
  return (
    <Frame className={className}>
      <IsoBox x={48} y={74} a={44} b={44} h={12} fills={[...FILLS.zakat]} variants={drop(0, 0.1, 0.15, -30)} />
      <motion.g variants={pop(0.55)}><g transform={topPlane(slab.F1)}>
        <rect x="9" y="9" width="26" height="26" fill={PAL.butter} />
        <rect x="9" y="9" width="26" height="26" fill={PAL.butter} transform="rotate(45 22 22)" />
        <rect x="14.5" y="14.5" width="15" height="15" fill={PAL.accent} />
        <rect x="14.5" y="14.5" width="15" height="15" fill={PAL.accent} transform="rotate(45 22 22)" />
      </g></motion.g>
    </Frame>
  );
}
