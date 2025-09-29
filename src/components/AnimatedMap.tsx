import { useEffect, useMemo, useState } from 'react';
import Map, { Layer, Marker, Source } from 'react-map-gl/maplibre';
import type { ViewState } from 'react-map-gl/maplibre';
import maplibregl, { type ExpressionSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type LngLat = [number, number];

type MapViewState = Pick<ViewState, 'longitude' | 'latitude' | 'zoom' | 'bearing' | 'pitch' | 'padding'>;

type CorridorMeta = {
  label: string;
  country: string;
  coordinates: LngLat;
};

const DEFAULT_VIEW_STATE: MapViewState = {
  longitude: 0,
  latitude: 15,
  zoom: 1.2,
  bearing: 0,
  pitch: 25,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

const CURRENCY_GEOMETRY: Record<string, CorridorMeta> = {
  USD: { label: 'New York, United States', country: 'United States', coordinates: [-74.006, 40.7128] },
  EUR: { label: 'Frankfurt, Germany', country: 'Germany', coordinates: [8.6821, 50.1109] },
  GBP: { label: 'London, United Kingdom', country: 'United Kingdom', coordinates: [-0.1276, 51.5072] },
  INR: { label: 'Mumbai, India', country: 'India', coordinates: [72.8777, 19.076] },
  AUD: { label: 'Sydney, Australia', country: 'Australia', coordinates: [151.2093, -33.8688] },
  CAD: { label: 'Toronto, Canada', country: 'Canada', coordinates: [-79.3832, 43.6532] },
  JPY: { label: 'Tokyo, Japan', country: 'Japan', coordinates: [139.6917, 35.6895] },
  CHF: { label: 'Zurich, Switzerland', country: 'Switzerland', coordinates: [8.5417, 47.3769] },
  CNY: { label: 'Shanghai, China', country: 'China', coordinates: [121.4737, 31.2304] },
};

const BASEMAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getCorridorMeta = (currency: string): CorridorMeta => {
  return CURRENCY_GEOMETRY[currency] ?? {
    label: 'Global Hub',
    country: currency,
    coordinates: [0, 0],
  };
};

const buildArc = (from: LngLat, to: LngLat) => ({
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: [from, to],
      },
      properties: {},
    },
  ],
});

const buildGradientExpression = (progress: number): ExpressionSpecification => {
  const endStop = clamp(progress + 0.05, 0, 1);
  const midStop = clamp(progress, 0, 1);
  const startStop = clamp(progress - 0.1, 0, 1);

  return [
    'interpolate',
    ['linear'],
    ['line-progress'],
    0,
    'rgba(14,165,233,0)',
    startStop,
    'rgba(14,165,233,0.4)',
    midStop,
    'rgba(16,185,129,0.95)',
    endStop,
    'rgba(16,185,129,0)',
    1,
    'rgba(14,165,233,0)',
  ];
};

const deriveViewState = (from: LngLat, to: LngLat): MapViewState => {
  const centerLng = (from[0] + to[0]) / 2;
  const centerLat = (from[1] + to[1]) / 2;
  const lngDiff = Math.abs(from[0] - to[0]);
  const latDiff = Math.abs(from[1] - to[1]);
  const distance = Math.max(lngDiff, latDiff);
  const zoom = clamp(4 - Math.log(distance + 1), 1.2, 4.2);

  return {
    longitude: Number.isFinite(centerLng) ? centerLng : DEFAULT_VIEW_STATE.longitude,
    latitude: Number.isFinite(centerLat) ? centerLat : DEFAULT_VIEW_STATE.latitude,
    zoom: Number.isFinite(zoom) ? zoom : DEFAULT_VIEW_STATE.zoom,
    bearing: DEFAULT_VIEW_STATE.bearing,
    pitch: DEFAULT_VIEW_STATE.pitch,
    padding: DEFAULT_VIEW_STATE.padding,
  };
};

interface AnimatedMapProps {
  fromCurrency: string;
  toCurrency: string;
  sendAmount: number;
  receiveAmount: number;
  isActive: boolean;
  recipientCountry?: string;
}

const AnimatedMap = ({
  fromCurrency,
  toCurrency,
  sendAmount,
  receiveAmount,
  isActive,
  recipientCountry,
}: AnimatedMapProps) => {
  const [progress, setProgress] = useState(0);
  const origin = useMemo(() => getCorridorMeta(fromCurrency), [fromCurrency]);
  const destination = useMemo(() => getCorridorMeta(toCurrency), [toCurrency]);
  const arcGeoJson = useMemo(() => buildArc(origin.coordinates, destination.coordinates), [origin, destination]);
  const viewState = useMemo(
    () => deriveViewState(origin.coordinates, destination.coordinates),
    [origin, destination],
  );

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    let animationFrame: number;
    const duration = 4500;

    const animate = (timestamp: number) => {
      const looped = (timestamp % duration) / duration;
      setProgress(looped);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isActive]);

  const movingBadgeLngLat = useMemo<LngLat | null>(() => {
    const [fromLng, fromLat] = origin.coordinates;
    const [toLng, toLat] = destination.coordinates;

    if (!Number.isFinite(fromLng) || !Number.isFinite(toLng)) {
      return null;
    }

    return [
      fromLng + (toLng - fromLng) * progress,
      fromLat + (toLat - fromLat) * progress,
    ];
  }, [origin, destination, progress]);

  const lineGradient = useMemo(() => buildGradientExpression(progress), [progress]);
  const exchangeRate = useMemo(() => {
    if (!sendAmount || Number.isNaN(sendAmount)) {
      return 0;
    }
    return Number((receiveAmount / sendAmount).toFixed(4));
  }, [sendAmount, receiveAmount]);

  const corridorLabel = useMemo(() => {
    const destinationLabel = recipientCountry?.trim() || destination.country;
    return `${origin.country} → ${destinationLabel}`;
  }, [destination.country, origin.country, recipientCountry]);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 text-white shadow-lg">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300/80">Live corridor</p>
          <h3 className="text-base font-semibold">{corridorLabel}</h3>
          <p className="text-[11px] text-slate-300">Rate locked at {exchangeRate ? `${exchangeRate}` : '—'}</p>
        </div>
        <div className="text-right text-[11px] text-slate-300">
          <p>{origin.label}</p>
          <p>{destination.label}</p>
        </div>
      </header>
      <div className="relative h-64 w-full">
        <style>{`
          .maplibregl-ctrl-attrib-inner,
          .maplibregl-ctrl-attrib,
          .mapboxgl-ctrl-attrib-inner,
          .mapboxgl-ctrl-attrib {
            display: none !important;
          }
        `}</style>
        <Map
          mapLib={maplibregl}
          initialViewState={viewState as ViewState}
          reuseMaps
          mapStyle={BASEMAP_STYLE}
          attributionControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <Source id="transfer-arc" type="geojson" data={arcGeoJson} lineMetrics>
            <Layer
              id="transfer-arc-layer"
              type="line"
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{
                'line-width': 4,
                'line-opacity': 0.9,
                'line-blur': 0.6,
                'line-gradient': lineGradient,
              }}
            />
          </Source>

          <Marker longitude={origin.coordinates[0]} latitude={origin.coordinates[1]}>
            <div className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-300" />
            </div>
          </Marker>

          <Marker longitude={destination.coordinates[0]} latitude={destination.coordinates[1]}>
            <div className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400/60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-300" />
            </div>
          </Marker>

          {movingBadgeLngLat && (
            <Marker longitude={movingBadgeLngLat[0]} latitude={movingBadgeLngLat[1]} anchor="center">
              <div className="rounded-lg border border-white/20 bg-slate-950/80 px-2 py-1 text-[10px] font-medium backdrop-blur">
                <div className="text-[9px] text-emerald-300">In flight</div>
                <div className="font-semibold">
                  {sendAmount.toFixed(0)} {fromCurrency}
                </div>
                <div className="text-[9px] text-slate-300">
                  Recipient gets {receiveAmount.toFixed(0)} {toCurrency}
                </div>
              </div>
            </Marker>
          )}
        </Map>
      </div>
    </section>
  );
};

export default AnimatedMap;
