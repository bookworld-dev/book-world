"use client";

import dynamic from 'next/dynamic';
import { Location } from '@/app/lib/types';

const Map = dynamic(() => import('./Map'), { ssr: false });

export default function MapLoader({ activeLocations }: { activeLocations: Location[] }) {
  return <Map activeLocations={activeLocations} />;
}
