'use client';

import React from 'react';
import { useLocation } from '@/context/LocationContext';

interface DynamicPageTitleProps {
  prefix: string;
  defaultCity?: string;
  suffix?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'span';
  className?: string;
  style?: React.CSSProperties;
}

export function DynamicPageTitle({
  prefix,
  defaultCity = 'Noida',
  suffix = '',
  tag: Tag = 'h1',
  className,
  style,
}: DynamicPageTitleProps) {
  const { city } = useLocation();
  const cityName = city?.name || defaultCity;

  return (
    <Tag className={className} style={style}>
      {prefix} in {cityName}{suffix ? ` ${suffix}` : ''}
    </Tag>
  );
}
