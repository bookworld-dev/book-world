"use client";

import { useState, useCallback, useMemo } from 'react';
import ReactMap, { Source, Layer } from 'react-map-gl/mapbox';
import type { FillLayerSpecification, MapMouseEvent, ExpressionSpecification } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@/app/lib/types';
import BookDetails from './BookDetails';

type Props = {
  activeLocations: Location[];
};

type HoverInfo = { x: number; y: number; name: string } | null;

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
  ...(codes.length > 0 ? codes.flatMap(code => [code, codeToColor(code)]) : ['__none__', '#cccccc']),
  '#cccccc',
];

export default function Map({ activeLocations }: Props) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [cursor, setCursor] = useState('grab');
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);

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
      'fill-opacity': 1,
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
      'fill-opacity': 1,
    },
  }), [stateCodes]);

  const onMouseMove = useCallback((e: MapMouseEvent) => {
    const feature = e.features?.[0];
    if (feature) {
      setCursor('pointer');
      const name = feature.layer?.id === 'countries-fill'
        ? feature.properties?.name_en
        : feature.properties?.name;
      setHoverInfo(name ? { x: e.point.x, y: e.point.y, name } : null);
    } else {
      setCursor('grab');
      setHoverInfo(null);
    }
  }, []);

  const onClick = useCallback((e: MapMouseEvent) => {
    const feature = e.features?.[0];
    if (!feature) { setSelectedCode(null); return; }

    const code = feature.layer?.id === 'countries-fill'
      ? feature.properties?.iso_3166_1
      : feature.properties?.iso_3166_2;

    if (code && allCodes.has(code)) setSelectedCode(code);
  }, [allCodes]);

  const onLoad = useCallback((e: { target: mapboxgl.Map }) => {
    e.target.getStyle().layers.forEach(layer => {
      if (layer.type === 'symbol') {
        e.target.setLayoutProperty(layer.id, 'visibility', 'none');
      }
    });
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ReactMap
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{ longitude: 0, latitude: 20, zoom: 2 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        interactiveLayerIds={['countries-fill', 'states-fill']}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={() => { setCursor('grab'); setHoverInfo(null); }}
        cursor={cursor}
        onLoad={onLoad}
      >
        <Source id="country-boundaries" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          <Layer {...countryLayer} />
        </Source>

        <Source id="states" type="vector" url="mapbox://ewansheldon.9hicnkvmnwr3">
          <Layer {...stateLayer} />
        </Source>
      </ReactMap>

      {hoverInfo && (
        <div style={{
          position: 'absolute',
          left: hoverInfo.x + 12,
          top: hoverInfo.y - 8,
          background: 'white',
          padding: '4px 8px',
          borderRadius: 4,
          fontSize: 13,
          pointerEvents: 'none',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }}>
          {hoverInfo.name}
        </div>
      )}

      {selectedCode && (
        <>
          <div className="book-panel-backdrop" onClick={() => setSelectedCode(null)} />
          <BookDetails locationCode={selectedCode} onClose={() => setSelectedCode(null)} />
        </>
      )}
    </div>
  );
}
