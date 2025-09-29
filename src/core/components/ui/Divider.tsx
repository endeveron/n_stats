'use client';

import { cn } from '@/core/utils';

type DividerProps = {
  className?: string;
};

const Divider = ({ className }: DividerProps) => {
  return <div className={cn('w-full border-t border-t-border', className)} />;
};

export default Divider;
