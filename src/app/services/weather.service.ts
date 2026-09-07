import { Injectable, signal } from '@angular/core';

export interface WeatherData {
  temperature: number;       // °C
  humidity: number;          // %
  windSpeed: number;         // km/h
  weatherCode: number;       // WMO weather code
  conditionText: string;     // e.g. "Mưa rào mát mẻ"
  icon: string;              // Material icon name
  recommendation: string;    // Food recommendation context
  locationName: string;      // e.g. "Hà Nội"
  updatedAt: Date | null;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_WEATHER: WeatherData = {
  temperature: 28,
  humidity: 75,
  windSpeed: 10,
  weatherCode: 0,
  conditionText: 'Nắng ấm nhẹ nhàng',
  icon: 'wb_sunny',
  recommendation: 'Thời tiết cực kỳ mát mẻ, thích hợp ăn cơm văn phòng, phở cuốn hoặc sinh tố trái cây!',
  locationName: 'Hà Nội',
  updatedAt: null,
  isLoading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class WeatherService {
  public weatherSignal = signal<WeatherData>(DEFAULT_WEATHER);

  constructor() {
    this.fetchWeather();
  }

  /**
   * Fetch current weather from Open-Meteo API
   * Lat: 21.0285, Lng: 105.8542 (Hanoi)
   */
  public async fetchWeather(): Promise<WeatherData> {
    this.weatherSignal.update((state) => ({ ...state, isLoading: true, error: null }));

    try {
      const url =
        'https://api.open-meteo.com/v1/forecast?latitude=21.0285&longitude=105.8542&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m';

      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) {
        throw new Error(`Open-Meteo HTTP Error ${res.status}`);
      }

      const data = await res.json();
      const current = data.current || {};
      const temp = Math.round((current.temperature_2m ?? 28) * 10) / 10;
      const humidity = Math.round(current.relative_humidity_2m ?? 70);
      const wind = Math.round((current.wind_speed_10m ?? 10) * 10) / 10;
      const code = current.weather_code ?? 0;

      const { conditionText, icon, recommendation } = this.interpretWeatherCode(code, temp);

      const updatedData: WeatherData = {
        temperature: temp,
        humidity,
        windSpeed: wind,
        weatherCode: code,
        conditionText,
        icon,
        recommendation,
        locationName: 'Hà Nội',
        updatedAt: new Date(),
        isLoading: false,
        error: null,
      };

      this.weatherSignal.set(updatedData);
      return updatedData;
    } catch (err: any) {
      console.warn('WeatherService Fetch Warning:', err);
      // Fallback with current mock temp & clear error flag
      const fallback: WeatherData = {
        ...DEFAULT_WEATHER,
        updatedAt: new Date(),
        isLoading: false,
        error: 'Không thể kết nối Open-Meteo, đang dùng dữ liệu mẩu thời tiết Hà Nội.',
      };
      this.weatherSignal.set(fallback);
      return fallback;
    }
  }

  /**
   * Interpret WMO weather codes to human readable Vietnamese description + food advice
   */
  private interpretWeatherCode(code: number, temp: number): { conditionText: string; icon: string; recommendation: string } {
    // High temp check override (>33°C)
    if (temp >= 33) {
      return {
        conditionText: 'Nắng gắt oi nóng',
        icon: 'wb_sunny',
        recommendation: 'Trời oi nóng đỉnh điểm! Rất thích hợp ăn chè thái, sinh tố giải nhiệt, bún chả, hoặc phở cuốn thanh mát.',
      };
    }

    // Cold temp check (<19°C)
    if (temp <= 19) {
      return {
        conditionText: 'Se lạnh / Gió mùa',
        icon: 'ac_unit',
        recommendation: 'Thời tiết se lạnh cay cay! Ưu tiên lẩu nướng, phở bò tái lăn nóng hổi hoặc bún bò Huế thơm nức.',
      };
    }

    switch (code) {
      case 0:
        return {
          conditionText: 'Trời quang nắng dịu',
          icon: 'wb_sunny',
          recommendation: 'Thời tiết đẹp tuyệt vời! Thích hợp thưởng thức bún chả Hà Nội, cơm tấm Sài Gòn hoặc bún đậu mắm tôm.',
        };
      case 1:
      case 2:
      case 3:
        return {
          conditionText: 'Nhiều mây mát rượi',
          icon: 'cloud',
          recommendation: 'Trời dịu mát thích hợp dạo phố ăn vặt, bún riêu cua, bánh mì chảo hoặc trà sữa Gen Z!',
        };
      case 45:
      case 48:
        return {
          conditionText: 'Sương mù mờ ảo',
          icon: 'filter_drama',
          recommendation: 'Trời nhiều sương mát mẻ, làm ngay bát phở gầu bò nóng hoặc cháo sườn quẩy giòn nát con tim.',
        };
      case 51:
      case 53:
      case 55:
      case 61:
      case 63:
      case 65:
        return {
          conditionText: 'Mưa rào / Mưa phùn',
          icon: 'water_drop',
          recommendation: 'Trời mưa lãng mạn, ăn lẩu thái hải sản, đồ nướng BBQ hoặc ốc luộc mắm gừng là số 1!',
        };
      case 80:
      case 81:
      case 82:
        return {
          conditionText: 'Mưa giông rải rác',
          icon: 'rainy',
          recommendation: 'Mưa giông rải rác, đặt ship lẩu riêu cua đồng tận nơi hoặc làm bát mì cay cấp độ 3 xì xụp.',
        };
      case 95:
      case 96:
      case 99:
        return {
          conditionText: 'Giông bão mạnh',
          icon: 'thunderstorm',
          recommendation: 'Giông bão ở nhà cho lành, tự tay nấu cơm gia đình nóng sốt hoặc ăn lẩu ấm cúng.',
        };
      default:
        return {
          conditionText: 'Mát mẻ dễ chịu',
          icon: 'thermostat',
          recommendation: 'Thời tiết lý tưởng cho mọi món ăn ngon, từ bún cá, cơm văn phòng đến bánh xèo Nam Bộ!',
        };
    }
  }
}
