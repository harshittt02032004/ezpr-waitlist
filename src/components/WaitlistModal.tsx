"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./WaitlistModal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Status = "idle" | "submitting" | "success";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s().-]{7,20}$/;

const ADMIN_WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "";

function buildWhatsAppUrl(name: string, phone: string, email: string): string {
  const message =
    `New Waitlist Entry:\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Email: ${email}`;
  const encoded = encodeURIComponent(message);
  const digits = ADMIN_WHATSAPP.replace(/[^\d]/g, "");
  return digits
    ? `https://wa.me/${digits}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}

const WaitlistModal: React.FC<Props> = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<number | null>(null);
  const successTimer = useRef<number | null>(null);

  const reset = useCallback(() => {
    setName("");
    setPhone("");
    setEmail("");
    setError(null);
    setStatus("idle");
  }, []);

  const handleClose = useCallback(() => {
    if (status === "submitting") return;
    setClosing(true);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setClosing(false);
      reset();
      onClose();
    }, 180);
  }, [onClose, reset, status]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const raf = window.requestAnimationFrame(() => {
      firstInputRef.current?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, handleClose]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      if (successTimer.current) window.clearTimeout(successTimer.current);
    };
  }, []);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setError(null);

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!PHONE_RE.test(trimmedPhone)) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
          email: trimmedEmail,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("idle");
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      const waUrl = buildWhatsAppUrl(trimmedName, trimmedPhone, trimmedEmail);
      window.open(waUrl, "_blank", "noopener,noreferrer");

      setStatus("success");
      successTimer.current = window.setTimeout(() => {
        handleClose();
      }, 1800);
    } catch {
      setStatus("idle");
      setError("Network error. Please try again.");
    }
  };

  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.closing : ""}`}
      onClick={onOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
    >
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.close}
          onClick={handleClose}
          aria-label="Close"
          disabled={status === "submitting"}
        >
          ×
        </button>

        {status === "success" ? (
          <div className={styles.success}>
            <div className={styles.successCheck} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className={styles.successTitle}>You&apos;re on the list.</div>
            <div className={styles.successSub}>
              Check your inbox for confirmation.
            </div>
          </div>
        ) : (
          <>
            <h2 id="waitlist-title" className={styles.title}>
              Join the Waitlist
            </h2>
            <p className={styles.subtitle}>
              Be among the first to get early access.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label htmlFor="wl-name" className={styles.label}>
                  Name
                </label>
                <input
                  ref={firstInputRef}
                  id="wl-name"
                  type="text"
                  className={styles.input}
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  disabled={status === "submitting"}
                  maxLength={120}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="wl-phone" className={styles.label}>
                  Phone
                </label>
                <input
                  id="wl-phone"
                  type="tel"
                  className={styles.input}
                  placeholder="+1 555 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="tel"
                  disabled={status === "submitting"}
                  maxLength={40}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="wl-email" className={styles.label}>
                  Email
                </label>
                <input
                  id="wl-email"
                  type="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={status === "submitting"}
                  maxLength={200}
                />
              </div>

              {error ? <div className={styles.error}>{error}</div> : null}

              <button
                type="submit"
                className={styles.submit}
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Joining…" : "Join Waitlist"}
              </button>

              <p className={styles.microcopy}>
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;
