import { Route, TransportPoint, AccessPoint, TravelStationPoint } from '../../domain/entities';

export interface TravelPointResponse {
  type: 'transport' | 'access';
}

export interface TransportPointResponse extends TravelPointResponse {
  type: 'transport';
  id: string;
  name: string;
  stations: Array<{
    id: string;
    name: string;
    location: { longitude: number; latitude: number };
  }>;
  estimatedTravelSeconds: number;
}

export interface AccessPointResponse extends TravelPointResponse {
  type: 'access';
  startWalkSeconds: number;
  destinationWalkSeconds: number;
  startPoint: { longitude: number; latitude: number };
  destinationPoint: { longitude: number; latitude: number };
}

export interface RouteResponseDto {
  routes: Array<{
    travelStationPoints: (TransportPointResponse | AccessPointResponse)[];
  }>;
}

export class RouteResponseMapper {
  static toResponse(routes: Route[]): RouteResponseDto {
    return {
      routes: routes.map((route) => ({
        travelStationPoints: route.travelStationPoints.map((point) =>
          RouteResponseMapper.mapTravelPoint(point)
        ),
      })),
    };
  }

  private static mapTravelPoint(
    point: TravelStationPoint
  ): TransportPointResponse | AccessPointResponse {
    if (point instanceof TransportPoint) {
      return {
        type: 'transport',
        id: point.id,
        name: point.name,
        stations: point.stations.map((s) => ({
          id: s.id,
          name: s.name,
          location: { longitude: s.location.longitude, latitude: s.location.latitude },
        })),
        estimatedTravelSeconds: point.estimatedTravelSeconds,
      };
    } else {
      const accessPoint = point as AccessPoint;
      return {
        type: 'access',
        startWalkSeconds: accessPoint.startWalkSeconds,
        destinationWalkSeconds: accessPoint.destinationWalkSeconds,
        startPoint: {
          longitude: accessPoint.startPoint.longitude,
          latitude: accessPoint.startPoint.latitude,
        },
        destinationPoint: {
          longitude: accessPoint.destinationPoint.longitude,
          latitude: accessPoint.destinationPoint.latitude,
        },
      };
    }
  }
}
