'use client';

import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

// The children of this component will not be rendered until the Google Maps API is loaded.
export function GoogleMapsLoader({ children }: { children: ReactNode }) {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <Loader2 className="animate-spin" />;
      case Status.FAILURE:
        console.error('Failed to load Google Maps API. Please check your API key and network connection.');
        return <div>Error loading maps.</div>;
      case Status.SUCCESS:
        return <>{children}</>;
    }
  };

  return (
    <Wrapper
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      render={render}
      libraries={['places']}
    />
  );
}
