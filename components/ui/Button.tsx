import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const base =
  "group/button inline-flex items-center justify-center gap-2 rounded-full font-mono text-xs uppercase tracking-[0.16em] transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-out-expo disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-canvas shadow-[0_0_0_1px_rgb(76_201_240/0.4),0_10px_40px_-12px_rgb(76_201_240/0.6)] hover:bg-accent-strong hover:shadow-[0_0_0_1px_rgb(143_220_245/0.6),0_14px_48px_-12px_rgb(76_201_240/0.75)] active:scale-[0.98]",
  secondary:
    "border border-line-strong bg-white/[0.02] text-fg hover:border-accent/50 hover:bg-white/[0.05] active:scale-[0.98]",
  ghost: "text-muted hover:text-fg",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-10 px-5",
  lg: "h-12 px-7",
};

export function buttonStyles({ variant = "primary", size = "md" }: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size]);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleProps;

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & StyleProps;

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <a className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}
