
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { PriestLocation } from '@/types/tracking';

interface TrackingMapProps {
  priestLocation?: PriestLocation | null;
  destinationAddress: string;
  estimatedArrival?: string;
  priestStartedJourney: boolean;
}

const TrackingMap: React.FC<TrackingMapProps> = ({
  priestLocation,
  destinationAddress,
  estimatedArrival,
  priestStartedJourney
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    // For now, we'll show a placeholder map
    // In a real implementation, you would integrate with Google Maps, Mapbox, or similar
    if (!mapRef.current) return;

    // Clear any previous error
    setMapError(null);

    try {
      // Placeholder for map initialization
      console.log('Initializing map with priest location:', priestLocation);
    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to load map');
    }
  }, [priestLocation]);

  const formatETA = (eta: string) => {
    try {
      const etaDate = new Date(eta);
      const now = new Date();
      const diffMs = etaDate.getTime() - now.getTime();
      const diffMinutes = Math.round(diffMs / (1000 * 60));
      
      if (diffMinutes <= 0) return 'Arriving now';
      if (diffMinutes < 60) return `${diffMinutes} min`;
      
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    } catch {
      return 'Calculating...';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        {/* Map Container */}
        <div 
          ref={mapRef}
          className="h-64 bg-gray-100 dark:bg-gray-800 relative rounded-t-lg overflow-hidden"
        >
          {mapError ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">{mapError}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-spiritual-gold" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {priestStartedJourney ? 'Priest is on the way' : 'Waiting for priest to start journey'}
                </p>
                {priestLocation && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {new Date(priestLocation.updated_at).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 right-4">
            <div className="flex justify-between items-start">
              <Badge 
                variant={priestStartedJourney ? "default" : "secondary"}
                className={priestStartedJourney ? "bg-green-500" : ""}
              >
                {priestStartedJourney ? (
                  <>
                    <Navigation className="h-3 w-3 mr-1" />
                    En Route
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    Preparing
                  </>
                )}
              </Badge>
              
              {estimatedArrival && priestStartedJourney && (
                <Badge variant="outline" className="bg-white/90 text-spiritual-brown">
                  ETA: {formatETA(estimatedArrival)}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Location Info */}
        <div className="p-4 border-t">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-1 text-spiritual-gold flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Destination</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{destinationAddress}</p>
              </div>
            </div>
            
            {priestLocation && (
              <div className="flex items-start space-x-2">
                <Navigation className="h-4 w-4 mt-1 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Priest Location</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {priestLocation.latitude.toFixed(6)}, {priestLocation.longitude.toFixed(6)}
                  </p>
                  {priestLocation.speed && (
                    <p className="text-xs text-gray-500">
                      Speed: {Math.round(priestLocation.speed)} km/h
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingMap;
