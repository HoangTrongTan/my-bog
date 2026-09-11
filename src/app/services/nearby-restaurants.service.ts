import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { timeout, retry, catchError, map, switchMap } from 'rxjs/operators';

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------
export interface Restaurant {
  id: number;
  name: string;
  lat: number;
  lng: number;
  cuisine: string;
  address?: string;
  openingHours?: string;
  phone?: string;
  website?: string;
  distance?: number; // metres from user position
  amenityType?: string; // restaurant | cafe | fast_food | bar ...
}

export interface NearbyRestaurantOptions {
  radius?: number;                // metres, default 1000
  amenityTypes?: string[];        // default ['restaurant']
  nameSearch?: string;            // client-side filter by name
}

// ---------------------------------------------------------------------------
// Overpass raw response types
// ---------------------------------------------------------------------------
interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/** Cache entry */
interface CacheEntry {
  data: Restaurant[];
  expiresAt: number; // timestamp ms
}

const OVERPASS_MAIN    = 'https://overpass-api.de/api/interpreter';
const OVERPASS_BACKUP  = 'https://overpass.kumi.systems/api/interpreter';
const TIMEOUT_MS       = 10_000;
const CACHE_TTL_MS     = 5 * 60 * 1_000; // 5 minutes

function cacheKey(lat: number, lng: number, radius: number, types: string[]): string {
  return `${lat.toFixed(4)}_${lng.toFixed(4)}_${radius}_${[...types].sort().join(',')}`;
}

/**
 * Haversine distance in metres between two lat/lng points.
 */
function haversineMetres(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000; // Earth radius in metres
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Build Overpass QL query using a union of node/way queries per amenity type.
 * Example output:
 *   [out:json][timeout:10];
 *   (
 *     node["amenity"="restaurant"](around:1000,21.02,105.85);
 *     node["amenity"="cafe"](around:1000,21.02,105.85);
 *   );
 *   out center tags;
 */
function buildOverpassQuery(
  lat: number,
  lng: number,
  radius: number,
  amenityTypes: string[],
): string {
  const stmts = amenityTypes
    .map(
      (t) =>
        `  node["amenity"="${t}"](around:${radius},${lat},${lng});\n` +
        `  way["amenity"="${t}"](around:${radius},${lat},${lng});`,
    )
    .join('\n');

  return `[out:json][timeout:10];\n(\n${stmts}\n);\nout center tags;`;
}

/**
 * Map a raw Overpass element to the Restaurant model.
 */
function mapElement(el: OverpassElement, userLat: number, userLng: number): Restaurant | null {
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (!lat || !lng) return null;

  const tags = el.tags ?? {};

  // Build address
  const houseNo = tags['addr:housenumber'] ?? '';
  const street  = tags['addr:street'] ?? '';
  const city    = tags['addr:city'] ?? '';
  let address: string | undefined;
  if (street) {
    address = [houseNo, street, city].filter(Boolean).join(' ');
  } else if (tags['address']) {
    address = tags['address'];
  }

  return {
    id: el.id,
    name: tags['name'] || tags['name:vi'] || tags['name:en'] || 'Chưa rõ tên',
    lat,
    lng,
    cuisine: tags['cuisine'] || tags['food'] || 'Chưa rõ',
    address,
    openingHours: tags['opening_hours'],
    phone: tags['phone'] || tags['contact:phone'],
    website: tags['website'] || tags['contact:website'],
    amenityType: tags['amenity'] ?? 'restaurant',
    distance: Math.round(haversineMetres(userLat, userLng, lat, lng)),
  };
}

// ---------------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class NearbyRestaurantsService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, CacheEntry>();

  /**
   * Fetch nearby restaurants/cafes/etc from Overpass API.
   * Results are sorted by distance ascending.
   * Repeated calls with the same parameters within TTL return cached data.
   */
  getNearbyRestaurants(
    lat: number,
    lng: number,
    options: NearbyRestaurantOptions = {},
  ): Observable<Restaurant[]> {
    const radius       = options.radius      ?? 1_000;
    const amenityTypes = options.amenityTypes ?? ['restaurant'];

    const key = cacheKey(lat, lng, radius, amenityTypes);
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      // Apply name filter on cached results
      return new Observable((obs) => {
        obs.next(this.applyNameFilter(cached.data, options.nameSearch));
        obs.complete();
      });
    }

    const query = buildOverpassQuery(lat, lng, radius, amenityTypes);
    const body  = `data=${encodeURIComponent(query)}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    const postTo = (url: string) =>
      this.http.post<OverpassResponse>(url, body, { headers }).pipe(
        timeout(TIMEOUT_MS),
        map((res) => {
          const restaurants: Restaurant[] = (res.elements ?? [])
            .map((el) => mapElement(el, lat, lng))
            .filter((r): r is Restaurant => r !== null)
            .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

          // Cache raw (unfiltered) results
          this.cache.set(key, { data: restaurants, expiresAt: Date.now() + CACHE_TTL_MS });
          return this.applyNameFilter(restaurants, options.nameSearch);
        }),
      );

    // Try main server first, fallback to backup on any error
    return postTo(OVERPASS_MAIN).pipe(
      retry(1),
      catchError(() =>
        postTo(OVERPASS_BACKUP).pipe(
          retry(1),
          catchError((err) =>
            throwError(() => ({
              message:
                'Không thể kết nối Overpass API. Vui lòng kiểm tra mạng và thử lại.',
              originalError: err,
            })),
          ),
        ),
      ),
    );
  }

  /** Client-side name filter (applied after cache lookup) */
  private applyNameFilter(list: Restaurant[], nameSearch?: string): Restaurant[] {
    if (!nameSearch || nameSearch.trim() === '') return list;
    const q = nameSearch.toLowerCase().trim();
    return list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.cuisine ?? '').toLowerCase().includes(q),
    );
  }

  /** Expose haversine for external use (e.g. manual distance display) */
  static distanceMetres = haversineMetres;

  /** Invalidate cached result for a specific key */
  clearCache(lat: number, lng: number, radius: number, amenityTypes: string[]): void {
    this.cache.delete(cacheKey(lat, lng, radius, amenityTypes));
  }

  /** Clear all cache entries */
  clearAllCache(): void {
    this.cache.clear();
  }
}
