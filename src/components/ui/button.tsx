import * as React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'secondary' };

export function Button({ className = '', variant = 'default', ...props }: Props) {
  const base = 'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition';
  const styles = variant === 'secondary'
    ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
    : 'bg-blue-600 text-white hover:bg-blue-700';
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
