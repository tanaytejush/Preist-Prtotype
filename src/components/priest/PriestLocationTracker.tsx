
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Play, Square, Navigation, AlertCircle } from 'lucide-react';
import { useGeolocation } from '@/hooks/tracking/useGeolocation';
import { usePriestTracking } from '@/hooks/tracking/usePriestTracking';
import { useToast } from '@/hooks/common/use-toast';
import { PriestBooking } from '@/types/priest';

interface PriestLocationTrackerProps {
  booking: PriestBooking;
  priestId: string;
}

const PriestLocationTracker: React.FC<PriestLocationTrackerProps> = ({ booking, priestId }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingInterval, setTrackingInterval] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const {
    latitude,
    longitude,
    accuracy,
    heading,
    speed,
    error: locationError,
    loading: locationLoading
  } = useGeolocation({
    enableHighAccuracy: true,
    watch: isTracking,
    timeout: 15000,
    maximumAge: 5000
  });

  const { updatePriestLocation, startJourney } = usePriestTracking();

  // Auto-update location when tracking is active
  useEffect(() => {
    if (!isTracking || !latitude || !longitude || !booking.id) return;

    const updateLocation = async () => {
      await updatePriestLocation(priestId, booking.id!, {
        latitude,
        longitude,
        heading: heading || undefined,
        speed: speed || undefined,
        accuracy: accuracy || undefined
      });
    };

    // Update location every 10 seconds when tracking
    const interval = setInterval(updateLocation, 10000);
    setTrackingInterval(interval);

    // Update immediately
    updateLocation();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, latitude, longitude, heading, speed, accuracy, booking.id, priestId, updatePriestLocation]);

  const handleStartTracking = useCallback(async () => {
    if (!booking.id) return;

    try {
      // Calculate estimated arrival (30 minutes from now as default)
      const estimatedArrival = new Date();
      estimatedArrival.setMinutes(estimatedArrival.getMinutes() + 30);

      await startJourney(booking.id, estimatedArrival);
      setIsTracking(true);

      toast({
        title: "Location Tracking Started",
        description: "Your location will be shared with the client during the journey"
      });
    } catch (error) {
      console.error('Error starting tracking:', error);
    }
  }, [booking.id, startJourney, toast]);

  const handleStopTracking = useCallback(() => {
    setIsTracking(false);
    if (trackingInterval) {
      clearInterval(trackingInterval);
      setTrackingInterval(null);
    }

    toast({
      title: "Location Tracking Stopped",
      description: "Location sharing has been disabled"
    });
  }, [trackingInterval, toast]);

  const canStartTracking = booking.status === 'confirmed' && !booking.priest_started_journey;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Navigation className="h-5 w-5 text-spiritual-gold" />
          <span>Location Tracking</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Tracking Status:</span>
          <Badge variant={isTracking ? "default" : "secondary"}>
            {isTracking ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Location Information */}
        {latitude && longitude && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-spiritual-gold" />
              <span className="text-sm">Current Location:</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm">
              <p>Lat: {latitude.toFixed(6)}</p>
              <p>Lng: {longitude.toFixed(6)}</p>
              {accuracy && <p>Accuracy: {Math.round(accuracy)}m</p>}
              {speed && <p>Speed: {Math.round(speed)} km/h</p>}
            </div>
          </div>
        )}

        {/* Location Error */}
        {locationError && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{locationError}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex space-x-2">
          {!isTracking ? (
            <Button
              onClick={handleStartTracking}
              disabled={!canStartTracking || locationLoading || !!locationError}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Journey Tracking
            </Button>
          ) : (
            <Button
              onClick={handleStopTracking}
              variant="destructive"
              className="flex-1"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Tracking
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Location tracking helps clients know when you'll arrive</p>
          <p>• Your location is only shared during active bookings</p>
          <p>• Location updates every 10 seconds while tracking is active</p>
          {!canStartTracking && booking.priest_started_journey && (
            <p className="text-green-600">• Journey already started for this booking</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriestLocationTracker;
