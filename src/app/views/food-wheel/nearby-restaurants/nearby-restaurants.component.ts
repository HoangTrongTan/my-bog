import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { GeolocationService } from '../../../services/geolocation.service';
import {
  NearbyRestaurantsService,
  Restaurant,
  NearbyRestaurantOptions,
} from '../../../services/nearby-restaurants.service';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const AMENITY_OPTIONS = [
  { value: 'restaurant', label: '🍜 Nhà hàng', icon: 'restaurant' },
  { value: 'cafe',       label: '☕ Cà phê',   icon: 'local_cafe' },
  { value: 'fast_food',  label: '🍔 Đồ ăn nhanh', icon: 'fastfood' },
  { value: 'bar',        label: '🍺 Quán bar',  icon: 'local_bar' },
  { value: 'food_court', label: '🏪 Food court', icon: 'storefront' },
] as const;

export const RADIUS_OPTIONS = [
  { value: 500,  label: '500m' },
  { value: 1000, label: '1 km' },
  { value: 2000, label: '2 km' },
  { value: 5000, label: '5 km' },
] as const;

type LoadState = 'idle' | 'loading' | 'success' | 'error';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@Component({
  selector: 'app-nearby-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule],
  templateUrl: './nearby-restaurants.component.html',
  styleUrl: './nearby-restaurants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NearbyRestaurantsComponent implements OnInit, OnDestroy {
  public readonly geoService    = inject(GeolocationService);
  public readonly nearbyService = inject(NearbyRestaurantsService);

  // Expose constants to template
  public readonly amenityOptions = AMENITY_OPTIONS;
  public readonly radiusOptions  = RADIUS_OPTIONS;

  // Filter state
  public selectedAmenities = signal<string[]>(['restaurant']);
  public selectedRadius    = signal<number>(1000);
  public nameSearch        = signal<string>('');

  // Results state
  public restaurants    = signal<Restaurant[]>([]);
  public loadState      = signal<LoadState>('idle');
  public errorMessage   = signal<string>('');
  public lastFetchedAt  = signal<Date | null>(null);

  // Manual location fallback form
  public manualLat = signal<string>('');
  public manualLng = signal<string>('');
  public manualFormError = signal<string>('');

  // Debounce subjects
  private readonly filterChange$ = new Subject<void>();
  private subs = new Subscription();

  public readonly locationState = computed(() => this.geoService.locationSignal());

  public readonly skeletonItems = Array.from({ length: 5 });

  ngOnInit(): void {
    // Debounced filter → re-fetch
    const debounceSub = this.filterChange$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.fetchIfLocationAvailable());

    this.subs.add(debounceSub);

    // Auto-request location on mount
    this.requestLocation();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ---------------------------------------------------------------------------
  // Location
  // ---------------------------------------------------------------------------

  public async requestLocation(): Promise<void> {
    const state = await this.geoService.requestLocation();
    if (state.status === 'granted' || state.status === 'manual') {
      this.fetchRestaurants();
    }
  }

  public submitManualLocation(): void {
    this.manualFormError.set('');
    const lat = parseFloat(this.manualLat());
    const lng = parseFloat(this.manualLng());

    if (isNaN(lat) || isNaN(lng)) {
      this.manualFormError.set('Vui lòng nhập số thực hợp lệ cho vĩ độ và kinh độ.');
      return;
    }

    const ok = this.geoService.setManualLocation(lat, lng);
    if (!ok) {
      this.manualFormError.set('Tọa độ ngoài phạm vi hợp lệ (Vĩ độ: -90..90, Kinh độ: -180..180).');
      return;
    }
    this.fetchRestaurants();
  }

  // ---------------------------------------------------------------------------
  // Fetch
  // ---------------------------------------------------------------------------

  public fetchIfLocationAvailable(): void {
    const { status } = this.geoService.locationSignal();
    if (status === 'granted' || status === 'manual') {
      this.fetchRestaurants();
    }
  }

  public fetchRestaurants(): void {
    const { lat, lng } = this.geoService.locationSignal();
    if (lat === null || lng === null) return;

    this.loadState.set('loading');
    this.errorMessage.set('');

    const opts: NearbyRestaurantOptions = {
      radius: this.selectedRadius(),
      amenityTypes: this.selectedAmenities(),
      nameSearch: this.nameSearch(),
    };

    const sub = this.nearbyService.getNearbyRestaurants(lat, lng, opts).subscribe({
      next: (list) => {
        this.restaurants.set(list);
        this.loadState.set('success');
        this.lastFetchedAt.set(new Date());
      },
      error: (err) => {
        this.errorMessage.set(
          err?.message ?? 'Đã xảy ra lỗi khi tải dữ liệu quán ăn. Vui lòng thử lại.',
        );
        this.loadState.set('error');
      },
    });

    this.subs.add(sub);
  }

  public retryFetch(): void {
    const { lat, lng } = this.geoService.locationSignal();
    if (lat !== null && lng !== null) {
      this.nearbyService.clearAllCache();
      this.fetchRestaurants();
    }
  }

  // ---------------------------------------------------------------------------
  // Filter handlers (trigger debounce)
  // ---------------------------------------------------------------------------

  public onAmenityToggle(type: string): void {
    const current = this.selectedAmenities();
    if (current.includes(type)) {
      // Keep at least one selected
      if (current.length === 1) return;
      this.selectedAmenities.set(current.filter((t) => t !== type));
    } else {
      this.selectedAmenities.set([...current, type]);
    }
    this.filterChange$.next();
  }

  public onRadiusChange(radius: number): void {
    this.selectedRadius.set(radius);
    this.filterChange$.next();
  }

  public onNameSearchChange(value: string): void {
    this.nameSearch.set(value);
    this.filterChange$.next();
  }

  public clearNameSearch(): void {
    this.nameSearch.set('');
    this.filterChange$.next();
  }

  // ---------------------------------------------------------------------------
  // Display helpers
  // ---------------------------------------------------------------------------

  public formatDistance(metres: number | undefined): string {
    if (metres === undefined) return '';
    if (metres < 1000) return `${metres}m`;
    return `${(metres / 1000).toFixed(1)}km`;
  }

  public getAmenityLabel(type: string): string {
    return AMENITY_OPTIONS.find((a) => a.value === type)?.label ?? type;
  }

  public getAmenityIcon(type: string): string {
    return AMENITY_OPTIONS.find((a) => a.value === type)?.icon ?? 'restaurant';
  }

  public getCuisineDisplay(cuisine: string): string {
    if (!cuisine || cuisine === 'Chưa rõ') return '';
    // Capitalise first letter of each word
    return cuisine
      .split(/[;,]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' · ');
  }

  public getDistanceColor(metres: number | undefined): string {
    if (!metres) return 'text-slate-400';
    if (metres < 300)  return 'text-emerald-400';
    if (metres < 800)  return 'text-amber-400';
    return 'text-rose-400';
  }

  /**
   * Open Google Maps navigation in a new tab/app.
   * Uses dir_action=navigate to launch turn-by-turn navigation immediately
   * (on mobile with Google Maps app installed). No origin passed so Maps
   * auto-uses the user's current location as starting point.
   */
  public openInGoogleMaps(restaurant: Restaurant): void {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}&dir_action=navigate`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /** Track by id for @for performance */
  public trackById(_: number, r: Restaurant): number {
    return r.id;
  }
}
