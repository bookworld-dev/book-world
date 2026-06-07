"use client";

import { useState, useCallback, useMemo } from 'react';
import ReactMap, { Source, Layer } from 'react-map-gl/mapbox';
import type { FillLayerSpecification, MapMouseEvent, ExpressionSpecification } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@/app/lib/types';
import BookPanel from './BookPanel';

type Props = {
  activeLocations: Location[];
};

const ZOOM_THRESHOLD = 4;

const codeToColor = (code: string): string => {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 60%, 55%)`;
};

const colorMatchExpression = (codes: string[], property: string): ExpressionSpecification => [
  'match',
  ['get', property],
  ...codes.flatMap(code => [code, codeToColor(code)]),
  '#cccccc',
];

export default function Map({ activeLocations }: Props) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [cursor, setCursor] = useState('grab');

  const countryCodes = useMemo(
    () => activeLocations.filter(l => !l.code.includes('-')).map(l => l.code),
    [activeLocations]
  );

  const stateCodes = useMemo(
    () => activeLocations.filter(l => l.code.includes('-')).map(l => l.code),
    [activeLocations]
  );

  const allCodes = useMemo(() => new Set([...countryCodes, ...stateCodes]), [countryCodes, stateCodes]);

  const countryLayer: FillLayerSpecification = useMemo(() => ({
    id: 'countries-fill',
    type: 'fill',
    source: 'country-boundaries',
    'source-layer': 'country_boundaries',
    filter: ['in', ['get', 'iso_3166_1'], ['literal', countryCodes]],
    paint: {
      'fill-color': colorMatchExpression(countryCodes, 'iso_3166_1'),
      'fill-opacity': 0.4,
    },
  }), [countryCodes]);

  const stateLayer: FillLayerSpecification = useMemo(() => ({
    id: 'states-fill',
    type: 'fill',
    source: 'states',
    'source-layer': 'aeb401cde63422d9585e',
    minzoom: ZOOM_THRESHOLD,
    filter: ['in', ['get', 'iso_3166_2'], ['literal', stateCodes]],
    paint: {
      'fill-color': colorMatchExpression(stateCodes, 'iso_3166_2'),
      'fill-opacity': 0.6,
    },
  }), [stateCodes]);

  const onClick = useCallback((e: MapMouseEvent) => {
    const feature = e.features?.[0];
    if (!feature) { setSelectedCode(null); return; }

    const code = feature.layer?.id === 'countries-fill'
      ? feature.properties?.iso_3166_1
      : feature.properties?.iso_3166_2;

    if (code && allCodes.has(code)) setSelectedCode(code);
  }, [allCodes]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ReactMap
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{ longitude: 0, latitude: 20, zoom: 2 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        interactiveLayerIds={['countries-fill', 'states-fill']}
        onClick={onClick}
        onMouseEnter={() => setCursor('pointer')}
        onMouseLeave={() => setCursor('grab')}
        cursor={cursor}
      >
        <Source id="country-boundaries" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          <Layer {...countryLayer} />
        </Source>

        <Source id="states" type="vector" url="mapbox://ewansheldon.9hicnkvmnwr3">
          <Layer {...stateLayer} />
        </Source>
      </ReactMap>

      {selectedCode && (
        <BookPanel locationCode={selectedCode} onClose={() => setSelectedCode(null)} />
      )}
    </div>
  );
}
