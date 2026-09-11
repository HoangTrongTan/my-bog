import { Injectable, signal, computed } from '@angular/core';

export type GeolocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'error' | 'manual';

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  status: GeolocationStatus;
  error: string | null;
  updatedAt: Date | null;
}

const DEFAULT_STATE: GeolocationState = {
  lat: null,
  lng: null,
  accuracy: null,
  status: 'idle',
  error: null,
  updatedAt: null,
};

/**
 * Global Geolocation Service
 *
 * Singleton service (providedIn: 'root') that manages user location
 * via navigator.geolocation. Exposes an Angular signal so any
 * component or service can reactively read the current position.
 *
 * Usage:
 *   const geo = inject(GeolocationService);
 *   geo.requestLocation();
 *   const { lat, lng } = geo.locationSignal();
 */
@Injectable({ providedIn: 'root' })
export class GeolocationService {
  /** Global reactive location state — accessible across the entire app */
  public readonly locationSignal = signal<GeolocationState>(DEFAULT_STATE);

  /** Convenience computed: true when a valid lat/lng is available */
  public readonly hasLocation = computed(() => {
    const s = this.locationSignal();
    return s.lat !== null && s.lng !== null;
  });

  /**
   * Request user geolocation via Geolocation API.
   * If already granted and fresh (< 5 minutes), returns the cached position.
   * Falls back gracefully when the browser/env doesn't support geolocation.
   */
  public requestLocation(): Promise<GeolocationState> {
    const current = this.locationSignal();

    // Return cached result if still fresh (< 5 minutes)
    if (
      current.status === 'granted' &&
      current.updatedAt &&
      Date.now() - current.updatedAt.getTime() < 5 * 60 * 1000
    ) {
      return Promise.resolve(current);
    }

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      const errorState: GeolocationState = {
        ...DEFAULT_STATE,
        status: 'error',
        error: 'Trình duyệt của bạn không hỗ trợ định vị vị trí.',
        updatedAt: new Date(),
      };
      this.locationSignal.set(errorState);
      return Promise.resolve(errorState);
    }

    this.locationSignal.update((s) => ({ ...s, status: 'loading', error: null }));

    return new Promise<GeolocationState>((resolve) => {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 300_000, // 5 minutes cache in browser
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const granted: GeolocationState = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            status: 'granted',
            error: null,
            updatedAt: new Date(),
          };
          this.locationSignal.set(granted);
          resolve(granted);
        },
        (err) => {
          let errorMsg: string;
          switch (err.code) {
            case GeolocationPositionError.PERMISSION_DENIED:
              errorMsg = 'Bạn đã từ chối quyền định vị. Vui lòng nhập tọa độ thủ công.';
              break;
            case GeolocationPositionError.POSITION_UNAVAILABLE:
              errorMsg = 'Không thể xác định vị trí. Vui lòng thử lại hoặc nhập thủ công.';
              break;
            case GeolocationPositionError.TIMEOUT:
              errorMsg = 'Hết thời gian chờ định vị. Vui lòng nhập tọa độ thủ công.';
              break;
            default:
              errorMsg = 'Lỗi định vị không xác định. Vui lòng nhập tọa độ thủ công.';
          }

          const denied: GeolocationState = {
            ...DEFAULT_STATE,
            status: err.code === GeolocationPositionError.PERMISSION_DENIED ? 'denied' : 'error',
            error: errorMsg,
            updatedAt: new Date(),
          };
          this.locationSignal.set(denied);
          resolve(denied);
        },
        options,
      );
    });
  }

  /**
   * Set location manually (when user types lat/lng in the fallback form).
   * Validates coordinate ranges before accepting.
   */
  public setManualLocation(lat: number, lng: number): boolean {
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return false;
    }
    const manual: GeolocationState = {
      lat,
      lng,
      accuracy: null,
      status: 'manual',
      error: null,
      updatedAt: new Date(),
    };
    this.locationSignal.set(manual);
    return true;
  }

  /**
   * Reset to idle state (e.g. user wants to re-request permission)
   */
  public reset(): void {
    this.locationSignal.set(DEFAULT_STATE);
  }
}
