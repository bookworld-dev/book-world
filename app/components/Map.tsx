"use client";

import { useState, useCallback, useMemo } from 'react';
import ReactMap, { Source, Layer } from 'react-map-gl/mapbox';
import type { FillLayerSpecification, MapMouseEvent } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@/app/lib/types';
import BookDetails from './BookDetails';

type Props = {
  activeLocations: Location[];
};

type HoverInfo = { x: number; y: number; name: string } | null;

const ZOOM_THRESHOLD = 4;

const OCEAN_COLOR  = '#b8d8e8';
const LAND_COLOR   = '#e8f2e0';
const COUNTRY_COLOR = '#c5ddb0';
const STATE_COLOR   = '#9ec887';
const HOVER_COLOR   = '#72a85a';

export default function Map({ activeLocations }: Props) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [cursor, setCursor] = useState('grab');
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

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
      'fill-color': hoveredCode
        ? ['case', ['==', ['get', 'iso_3166_1'], hoveredCode], HOVER_COLOR, COUNTRY_COLOR]
        : COUNTRY_COLOR,
      'fill-opacity': 1,
      'fill-outline-color': 'rgba(100, 140, 80, 0.2)',
    },
  }), [countryCodes, hoveredCode]);

  const stateLayer: FillLayerSpecification = useMemo(() => ({
    id: 'states-fill',
    type: 'fill',
    source: 'states',
    'source-layer': 'aeb401cde63422d9585e',
    minzoom: ZOOM_THRESHOLD,
    filter: ['in', ['get', 'iso_3166_2'], ['literal', stateCodes]],
    paint: {
      'fill-color': hoveredCode
        ? ['case', ['==', ['get', 'iso_3166_2'], hoveredCode], HOVER_COLOR, STATE_COLOR]
        : STATE_COLOR,
      'fill-opacity': 1,
      'fill-outline-color': 'rgba(100, 140, 80, 0.2)',
    },
  }), [stateCodes, hoveredCode]);

  const onMouseMove = useCallback((e: MapMouseEvent) => {
    const feature = e.features?.[0];
    if (feature) {
      setCursor('pointer');
      const isCountry = feature.layer?.id === 'countries-fill';
      const name = isCountry ? feature.properties?.name_en : feature.properties?.name;
      const code = isCountry ? feature.properties?.iso_3166_1 : feature.properties?.iso_3166_2;
      setHoverInfo(name ? { x: e.point.x, y: e.point.y, name } : null);
      setHoveredCode(code ?? null);
    } else {
      setCursor('grab');
      setHoverInfo(null);
      setHoveredCode(null);
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
    const map = e.target;
    map.getStyle().layers.forEach(layer => {
      if (layer.type === 'symbol') {
        map.setLayoutProperty(layer.id, 'visibility', 'none');
      }
      if (layer.type === 'background') {
        map.setPaintProperty(layer.id, 'background-color', LAND_COLOR);
      }
      if (layer.type === 'fill' && layer.id === 'land') {
        map.setPaintProperty(layer.id, 'fill-color', LAND_COLOR);
      }
      if (layer.type === 'fill' && (layer.id === 'water' || layer.id === 'water-shadow')) {
        map.setPaintProperty(layer.id, 'fill-color', OCEAN_COLOR);
      }
    });
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ReactMap
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{ longitude: 14.423, latitude: 50.086, zoom: 2.5 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        interactiveLayerIds={['countries-fill', 'states-fill']}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={() => { setCursor('grab'); setHoverInfo(null); setHoveredCode(null); }}
        cursor={cursor}
        onLoad={onLoad}
        minZoom={2}
        maxZoom={7}
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
