
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Phone, MessageCircle, Clock, Navigation } from 'lucide-react';
import { usePriestTracking } from '@/hooks/tracking/usePriestTracking';
import TrackingMap from './TrackingMap';
import { PriestBooking } from '@/types/priest';

interface PriestTrackingCardProps {
  booking: PriestBooking;
  priestInfo?: {
    name: string;
    avatar_url?: string;
  };
}

const PriestTrackingCard: React.FC<PriestTrackingCardProps> = ({ booking, priestInfo }) => {
  const { trackingData, priestLocation, loading } = usePriestTracking(booking.id);

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-amber-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="rangoli-spinner"></div>
            <span className="ml-2">Loading tracking information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Priest Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={priestInfo?.avatar_url} alt={priestInfo?.name} />
                <AvatarFallback>
                  {priestInfo?.name?.substring(0, 2) || 'P'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{priestInfo?.name || 'Priest'}</CardTitle>
                <p className="text-sm text-gray-600">{booking.purpose}</p>
              </div>
            </div>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-spiritual-gold" />
                <span className="text-sm">
                  <strong>Scheduled:</strong> {formatTime(booking.booking_date)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-spiritual-gold" />
                <span className="text-sm">
                  <strong>Address:</strong> {booking.address}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Map */}
      {(booking.status === 'confirmed' || trackingData?.priest_started_journey) && (
        <TrackingMap
          priestLocation={priestLocation}
          destinationAddress={booking.address}
          estimatedArrival={trackingData?.estimated_arrival}
          priestStartedJourney={trackingData?.priest_started_journey || false}
        />
      )}

      {/* Journey Status */}
      {trackingData && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Navigation className="h-5 w-5 text-spiritual-gold" />
                <span className="font-medium">Journey Status</span>
              </div>
              
              {trackingData.priest_started_journey ? (
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">Priest is on the way</p>
                  {trackingData.estimated_arrival && (
                    <p className="text-xs text-gray-500">
                      ETA: {formatTime(trackingData.estimated_arrival)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-right">
                  <p className="text-sm font-medium text-amber-600">Preparing for journey</p>
                  <p className="text-xs text-gray-500">Priest will start soon</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PriestTrackingCard;
