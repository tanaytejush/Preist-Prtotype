
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PriestLocation, TrackingData, LocationUpdate } from '@/types/tracking';
import { PriestLocationService } from '@/services/priest/priestLocationService';
import { PriestJourneyService } from '@/services/priest/priestJourneyService';
import { PriestTrackingDataService } from '@/services/priest/priestTrackingDataService';
import { usePriestTrackingSubscriptions } from './usePriestTrackingSubscriptions';

export const usePriestTracking = (bookingId?: string) => {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [priestLocation, setPriestLocation] = useState<PriestLocation | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Update priest location
  const updatePriestLocation = useCallback(async (
    priestId: string,
    bookingId: string,
    locationUpdate: LocationUpdate
  ) => {
    try {
      await PriestLocationService.updateLocation(priestId, bookingId, locationUpdate);
      console.log('Priest location updated successfully');
    } catch (error: any) {
      console.error('Error updating priest location:', error);
      toast({
        variant: "destructive",
        title: "Location Update Failed",
        description: "Failed to update priest location"
      });
    }
  }, [toast]);

  // Start journey
  const startJourney = useCallback(async (bookingId: string, estimatedArrival?: Date) => {
    try {
      await PriestJourneyService.startJourney(bookingId, estimatedArrival);
      toast({
        title: "Journey Started",
        description: "Tracking has been enabled for this booking"
      });
    } catch (error: any) {
      console.error('Error starting journey:', error);
      toast({
        variant: "destructive",
        title: "Failed to Start Journey",
        description: error.message
      });
    }
  }, [toast]);

  // Fetch current tracking data
  const fetchTrackingData = useCallback(async (bookingId: string) => {
    if (!bookingId) return;

    setLoading(true);
    try {
      const { trackingData: data, priestLocation: location } = 
        await PriestTrackingDataService.fetchTrackingData(bookingId);
      
      setTrackingData(data);
      if (location) {
        setPriestLocation(location);
      }
    } catch (error: any) {
      console.error('Error fetching tracking data:', error);
      // Don't show toast for fetch errors to avoid spam
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle tracking data updates from subscriptions
  const handleTrackingDataUpdate = useCallback((updates: Partial<TrackingData>) => {
    setTrackingData(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  // Handle location updates from subscriptions
  const handleLocationUpdate = useCallback((location: PriestLocation) => {
    setPriestLocation(location);
  }, []);

  // Set up real-time subscriptions only if bookingId exists
  if (bookingId) {
    usePriestTrackingSubscriptions({
      bookingId,
      onTrackingDataUpdate: handleTrackingDataUpdate,
      onLocationUpdate: handleLocationUpdate
    });
  }

  return {
    trackingData,
    priestLocation,
    isTracking,
    loading,
    updatePriestLocation,
    startJourney,
    fetchTrackingData
  };
};
