import Link from 'next/link'
import clsx from 'clsx'

const variantStyles = {
  primary:
    'bg-teal-600 font-semibold text-white hover:bg-teal-700 active:bg-teal-800 active:text-white/90 dark:bg-teal-600 dark:hover:bg-teal-700 dark:active:bg-teal-800 dark:active:text-white/90',
  secondary:
    'bg-zinc-100 font-medium text-zinc-900 hover:bg-zinc-200 active:bg-zinc-200 active:text-zinc-900/80 border border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70 dark:border-zinc-700',
  outline:
    'bg-white font-medium text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 border border-zinc-300 shadow-sm dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:active:bg-zinc-800',
}

const sizeStyles = {
  sm: 'py-1.5 px-2.5 text-sm',
  md: 'py-2 px-3 text-sm',
  lg: 'py-3 px-6 text-base',
  xl: 'py-4 px-8 text-lg',
}

export function Button({ variant = 'primary', size = 'md', className, href, ...props }) {
  className = clsx(
    'inline-flex items-center gap-2 justify-center rounded-md font-medium outline-offset-2 transition active:transition-none',
    variantStyles[variant],
    sizeStyles[size],
    className
  )

  return href ? (
    <Link href={href} className={className} {...props} />
  ) : (
    <button className={className} {...props} />
  )
}
