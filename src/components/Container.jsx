import { forwardRef } from 'react'
import clsx from 'clsx'

const Container = forwardRef(function Container(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={clsx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  )
})

export { Container }
