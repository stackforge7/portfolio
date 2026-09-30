"use client";

import { useState, type PointerEvent } from "react";
import { motion, useSpring } from "motion/react";
import { Mail, Phone, Send, X } from "lucide-react";
import { LinkedInIcon } from "@/components/ui/icons";
import { MediaImage } from "@/components/ui/MediaImage";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { roomAudio } from "@/lib/studio/audio";
import { cn } from "@/lib/cn";

const TILT = 8;
const SPRING = { stiffness: 160, damping: 18, mass: 0.6 };
const TOPICS = ["An engineering role", "A collaboration", "A technical conversation"];

type Tab = "card" | "message";

/** The desk phone, lifted off its stand. Tilts with the pointer within limits and settles back on exit. */
export function PhoneInspector({ onClose }: { onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const tiltX = useSpring(0, SPRING);
  const tiltY = useSpring(0, SPRING);
  const [tab, setTab] = useState<Tab>("card");

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    tiltY.set(((event.clientX - rect.left) / rect.width - 0.5) * TILT * 2);
    tiltX.set(-((event.clientY - rect.top) / rect.height - 0.5) * TILT * 2);
  }

  function settle() {
    tiltX.set(0);
    tiltY.set(0);
  }

  function switchTab(next: Tab) {
    if (next === tab) return;
    roomAudio.play("tick");
    setTab(next);
  }

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center p-4 pt-16 pb-20 [perspective:1400px]"
      onPointerMove={onPointerMove}
      onPointerLeave={settle}
    >
      <motion.section
        aria-label="Phone: contact William"
        initial={{ opacity: 0, y: 220, rotateX: 28, scale: 0.72 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        exit={{ opacity: 0, y: 200, rotateX: 24, scale: 0.75, transition: { duration: 0.45, ease: [0.4, 0, 0.6, 1] } }}
        transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9, delay: 0.25 }}
        className="relative aspect-[300/620] h-[min(40rem,100%)] [transform-style:preserve-3d]"
      >
        <motion.div
          style={{ rotateX: tiltX, rotateY: tiltY }}
          className="absolute inset-0 rounded-[3rem] border border-white/20 bg-[#0b0d11] p-2.5 shadow-[0_40px_80px_-20px_rgb(0_0_0/0.8),inset_0_0_0_1px_rgb(255_255_255/0.06)]"
        >
          <div className="relative flex h-full flex-col overflow-hidden rounded-[2.4rem] bg-[radial-gradient(ellipse_at_top,#1b3550,#0a0f18_65%)] text-white">
            <div aria-hidden="true" className="mx-auto mt-2.5 h-6 w-24 shrink-0 rounded-full bg-black" />

            <div className="flex items-center justify-between px-5 pt-4">
              <p className="font-mono text-[0.625rem] tracking-[0.18em] text-white/50 uppercase">Contacts</p>
              <button
                type="button"
                onClick={onClose}
                data-autofocus
                aria-label="Put the phone down"
                className="inline-flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex flex-col items-center px-5 text-center">
              <span className="relative size-20 overflow-hidden rounded-full ring-2 ring-white/20">
                {profile.photo ? (
                  <MediaImage image={profile.photo} decorative sizes="80px" className="object-[50%_30%]" />
                ) : (
                  <span className="flex size-full items-center justify-center bg-gradient-to-br from-accent to-accent-deep text-2xl font-semibold text-canvas">
                    WG
                  </span>
                )}
              </span>
              <h3 className="mt-3 text-xl font-semibold">{profile.name}</h3>
              <p className="mt-1 text-xs leading-snug text-white/60">{profile.headline}</p>
            </div>

            <div role="tablist" aria-label="Phone screens" className="mx-5 mt-5 grid grid-cols-2 rounded-full bg-white/10 p-1 text-sm">
              {(["card", "message"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  id={`phone-tab-${value}`}
                  aria-selected={tab === value}
                  aria-controls={`phone-panel-${value}`}
                  onClick={() => switchTab(value)}
                  className={cn(
                    "h-8 rounded-full transition-colors",
                    tab === value ? "bg-white text-canvas" : "text-white/70 hover:text-white",
                  )}
                >
                  {value === "card" ? "Card" : "Message"}
                </button>
              ))}
            </div>

            <div className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-6">
              {tab === "card" ? <ContactCard /> : <MessageComposer />}
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}

function ContactCard() {
  const { contact } = profile;
  const rows = [
    { label: "Email", value: contact.email, href: `mailto:${contact.email}`, Icon: Mail, external: false },
    { label: "LinkedIn", value: "/in/will-glas-056a94143", href: contact.linkedin.url, Icon: LinkedInIcon, external: true },
    { label: "Mobile", value: contact.phone, href: `tel:+1${contact.phone.replace(/\D/g, "")}`, Icon: Phone, external: false },
  ];

  return (
    <div id="phone-panel-card" role="tabpanel" aria-labelledby="phone-tab-card" className="space-y-2">
      {rows.map(({ label, value, href, Icon, external }) => (
        <a
          key={label}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="flex items-center gap-3 rounded-2xl bg-white/[0.07] px-4 py-3 transition-colors hover:bg-white/[0.12]"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-[0.6875rem] text-white/50">{label}</span>
            <span className="block truncate text-sm">{value}</span>
          </span>
          {external && <span className="sr-only">(opens in a new tab)</span>}
        </a>
      ))}
    </div>
  );
}

function MessageComposer() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const href = `mailto:${profile.contact.email}?subject=${encodeURIComponent(`${topic} (via your portfolio)`)}&body=${encodeURIComponent(message)}`;

  return (
    <div id="phone-panel-message" role="tabpanel" aria-labelledby="phone-tab-message">
      <fieldset>
        <legend className="text-[0.6875rem] text-white/55">What&apos;s it about?</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {TOPICS.map((value) => (
            <label
              key={value}
              className={cn(
                "cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
                topic === value ? "border-white bg-white text-canvas" : "border-white/20 text-white/75 hover:border-white/40",
              )}
            >
              <input
                type="radio"
                name="phone-topic"
                value={value}
                checked={topic === value}
                onChange={() => setTopic(value)}
                className="sr-only"
              />
              {value}
            </label>
          ))}
        </div>
      </fieldset>
      <label htmlFor="phone-message" className="mt-4 block text-[0.6875rem] text-white/55">
        Message
      </label>
      <textarea
        id="phone-message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={4}
        placeholder="Hi William, …"
        className="mt-2 w-full resize-none rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-white/40 focus:outline-none"
      />
      <a
        href={href}
        className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-accent py-3 text-sm font-medium text-canvas transition-colors hover:bg-accent-strong"
      >
        <Send className="size-4" aria-hidden="true" />
        Open in your email app
      </a>
    </div>
  );
}
