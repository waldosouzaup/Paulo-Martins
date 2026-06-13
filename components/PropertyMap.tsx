import React, { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin, HelpCircle, Loader2 } from 'lucide-react';

interface PropertyMapProps {
  location: string;
  title: string;
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export const PropertyMap: React.FC<PropertyMapProps> = ({ location, title }) => {
  const [coordinates, setCoordinates] = useState<google.maps.LatLngLiteral | null>(null);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Approximate default center (Brasília, Brazil)
  const defaultCenter = { lat: -15.793889, lng: -47.882778 };

  // Only run geocoding if hasValidKey is true and we have a valid window.google
  useEffect(() => {
    if (!hasValidKey || !location) return;

    let isMounted = true;
    setIsLoading(true);
    setGeocodingError(null);

    const performGeocoding = () => {
      if (!window.google || !window.google.maps) {
        // Wait a bit and retry in case SDK isn't loaded yet
        setTimeout(() => {
          if (isMounted) performGeocoding();
        }, 1000);
        return;
      }

      try {
        const geocoder = new google.maps.Geocoder();
        const addressToSearch = `${location}, Brasília, DF, Brasil`;

        geocoder.geocode({ address: addressToSearch }, (results, status) => {
          if (!isMounted) return;
          setIsLoading(false);

          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const loc = results[0].geometry.location;
            setCoordinates({
              lat: loc.lat(),
              lng: loc.lng(),
            });
          } else {
            console.warn('Geocoding status was not OK:', status);
            // Fallback second attempt with just the city/general region
            geocoder.geocode({ address: `${location}, Brasil` }, (fallbackResults, fallbackStatus) => {
              if (!isMounted) return;
              if (fallbackStatus === google.maps.GeocoderStatus.OK && fallbackResults && fallbackResults[0]) {
                const loc = fallbackResults[0].geometry.location;
                setCoordinates({
                  lat: loc.lat(),
                  lng: loc.lng(),
                });
              } else {
                setGeocodingError('Não foi possível localizar o endereço exato no mapa.');
                // Fallback to Brasília center so we show something
                setCoordinates(defaultCenter);
              }
            });
          }
        });
      } catch (err) {
        console.error('Erro ao instanciar Geocoder:', err);
        setIsLoading(false);
        setGeocodingError('Erro ao carregar o localizador de endereços.');
        setCoordinates(defaultCenter);
      }
    };

    // We can run this after the Google library starts loading via APIProvider
    // But since APIProvider handles loading asynchronously, we wait for google global
    const checkGoogleInterval = setInterval(() => {
      if (window.google?.maps) {
        clearInterval(checkGoogleInterval);
        performGeocoding();
      }
    }, 500);

    return () => {
      isMounted = false;
      clearInterval(checkGoogleInterval);
    };
  }, [location, hasValidKey]);

  if (!hasValidKey) {
    return (
      <div className="w-full bg-dark-900 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <MapPin className="text-gold-400" size={24} />
          <h3 className="text-xl font-serif text-white">Localização do Imóvel</h3>
        </div>

        <div className="bg-[#121212] border border-white/10 rounded-xl p-6 text-center space-y-4 max-w-xl mx-auto">
          <HelpCircle size={36} className="text-gold-400 mx-auto animate-pulse" />
          <h4 className="text-white font-medium text-sm uppercase tracking-wider">Chave da API do Google Maps Necessária</h4>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Para visualizar a localização interativa deste imóvel em tempo real no Google Maps, é necessário configurar uma chave de API.
          </p>
          
          <div className="text-left text-xs bg-black/40 p-4 rounded-lg space-y-2 border border-white/5">
            <p className="text-gold-400 font-semibold">Como configurar:</p>
            <ol className="list-decimal list-inside text-gray-400 space-y-1.5 leading-relaxed">
              <li>Adquira uma chave oficial: <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-gold-400 underline hover:text-gold-300">Criar Chave GMP</a></li>
              <li>Abra as <span className="font-semibold text-white">Configurações</span> (ícone de engrenagem ⚙️ no canto superior direito)</li>
              <li>Acesse a aba <span className="font-semibold text-white">Secrets</span></li>
              <li>Insira o nome <code className="bg-dark-800 text-gold-400 px-1 py-0.5 rounded">GOOGLE_MAPS_PLATFORM_KEY</code> e salve com o valor da sua Chave.</li>
            </ol>
          </div>
          <p className="text-[10px] text-gray-500 font-light italic">
            O aplicativo será reconstruído de forma totalmente automática após a adição da credencial.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-dark-900 border border-white/5 rounded-2xl p-6 md:p-8 space-y-4">
      <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <MapPin className="text-gold-400 shrink-0" size={24} />
          <div>
            <h3 className="text-xl font-serif text-white">Localização</h3>
            <p className="text-xs text-gray-400 font-light mt-0.5">{location}</p>
          </div>
        </div>
        {isLoading && (
          <span className="flex items-center gap-1.5 text-xs text-gold-500">
            <Loader2 className="animate-spin text-gold-500" size={14} />
            Buscando mapa...
          </span>
        )}
      </div>

      <div className="relative w-full h-[350px] md:h-[400px] bg-dark-950 rounded-xl overflow-hidden border border-white/10 shadow-inner">
        {coordinates ? (
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={coordinates}
              center={coordinates}
              defaultZoom={15}
              gestureHandling={'cooperative'}
              disableDefaultUI={false}
              mapId="PROPERTY_DETAIL_DEMO_MAP"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
            >
              <AdvancedMarker position={coordinates} title={title}>
                <Pin background="#c5a028" borderColor="#ffffff" glyphColor="#ffffff" scale={1.2} />
              </AdvancedMarker>
            </Map>
          </APIProvider>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 bg-dark-950 p-4">
            <Loader2 className="animate-spin text-gold-500" size={32} />
            <p className="text-xs text-gray-400 font-light">Carregando mapa interativo...</p>
          </div>
        )}

        {geocodingError && (
          <div className="absolute top-3 left-3 right-3 bg-red-950/90 border border-red-500/20 text-red-200 text-xs py-2 px-3 rounded-lg backdrop-blur-md flex items-center justify-between shadow-lg">
            <span>{geocodingError} (Mostrando localização de referência)</span>
          </div>
        )}
      </div>
    </div>
  );
};
