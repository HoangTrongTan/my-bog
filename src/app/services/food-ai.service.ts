import { Injectable, signal } from '@angular/core';
import { WeatherData } from './weather.service';
import { callGeminiAiApi } from '../utils/ai.utils';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  reason: string;
  calories: number;
  emoji: string;
  color: string;
  tags: string[];
}

export interface DailyMealPlan {
  dayName: string;
  dateStr: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  healthTip: string;
}

export interface AiFoodResponse {
  aiEventNote: string;
  dishes: FoodItem[];
  weeklyPlan: DailyMealPlan[];
}

// Slice color palette matching modern food apps
const PALETTE = [
  '#FF5722', '#3F51B5', '#4CAF50', '#FF9800', 
  '#9C27B0', '#00BCD4', '#E91E63', '#8BC34A', 
  '#FFC107', '#009688'
];

export interface PresetMenu {
  id: string;
  name: string;
  icon: string;
  dishes: FoodItem[];
}

export const PRESET_MENUS: PresetMenu[] = [
  {
    id: 'preset-student',
    name: '🎓 Cơm Tiệm & Bún Phở Văn Phòng',
    icon: 'storefront',
    dishes: [
      { id: 'p1', name: 'Phở Bò Tái Lăn', category: 'Phở / Món Nóng', reason: 'Kinh điển Hà Nội, ấm bụng dễ ăn', calories: 480, emoji: '🍜', color: PALETTE[0], tags: ['Phổ biến', 'Ấm bụng'] },
      { id: 'p2', name: 'Bún Chả Hà Nội', category: 'Bún / Món Nướng', reason: 'Chả nướng thơm lừng quạt than', calories: 520, emoji: '🥗', color: PALETTE[1], tags: ['Đặc sản', 'Đậm đà'] },
      { id: 'p3', name: 'Cơm Tấm Sườn Bì Chả', category: 'Cơm / Món Trưa', reason: 'Đủ chất dinh dưỡng, sườn nướng mỡ hành', calories: 650, emoji: '🍱', color: PALETTE[2], tags: ['Dinh dưỡng', 'No lâu'] },
      { id: 'p4', name: 'Bún Đậu Mắm Tôm', category: 'Bún / Món Nhậu', reason: 'Đậu rán giòn rụm chả cốm thơm ngon', calories: 580, emoji: '🧆', color: PALETTE[3], tags: ['Gây nghiện', 'Đặc sản'] },
      { id: 'p5', name: 'Bánh Mì Thịt Nướng', category: 'Bánh Mì', reason: 'Nhanh gọn tiện lợi, vỏ giòn ruột mềm', calories: 380, emoji: '🥖', color: PALETTE[4], tags: ['Tiện lợi', 'Giòn tan'] },
      { id: 'p6', name: 'Bún Riêu Cua Đồng', category: 'Bún / Món Nóng', reason: 'Vị chua thanh mộc mạc, riêu cua béo ngậy', calories: 420, emoji: '🍲', color: PALETTE[5], tags: ['Chua thanh', 'Nóng hổi'] },
      { id: 'p7', name: 'Bún Cá Chấm Giòn', category: 'Bún / Hải Sản', reason: 'Cá chiên giòn rụm chấm mắm tỏi ớt', calories: 460, emoji: '🐟', color: PALETTE[6], tags: ['Giòn rụm', 'Chua cay'] },
      { id: 'p8', name: 'Cơm Gà Xối Mỡ', category: 'Cơm / Đồ Chiên', reason: 'Đùi gà da giòn rụm cơm hồng ngọc', calories: 680, emoji: '🍗', color: PALETTE[7], tags: ['Béo ngậy', 'Năng lượng'] },
      { id: 'p9', name: 'Phở Cuốn Thịt Bò', category: 'Cuốn / Thanh Mát', reason: 'Bánh phở mềm cuộn thịt bò tươi mát', calories: 390, emoji: '🌯', color: PALETTE[8], tags: ['Thanh mát', 'Tươi ngon'] },
      { id: 'p10', name: 'Miến Lườn Gà Trộn', category: 'Miến / Trộn', reason: 'Miến dẻo dai lườn gà xé phay mát lành', calories: 370, emoji: '🥗', color: PALETTE[9], tags: ['Thanh nhẹ', 'Ít béo'] }
    ]
  },
  {
    id: 'preset-hotpot',
    name: '🍲 Lẩu Nướng & Món Nóng Mùa Đông',
    icon: 'local_fire_department',
    dishes: [
      { id: 'h1', name: 'Lẩu Riêu Cua Bắp Bò', category: 'Lẩu Nóng', reason: 'Nước lẩu chua thanh, sườn sụn bắp bò hoa', calories: 750, emoji: '🥘', color: PALETTE[0], tags: ['Trời mưa', 'Sum vầy'] },
      { id: 'h2', name: 'BBQ Đồ Nướng Hàn Quốc', category: 'Đồ Nướng', reason: 'Thịt ba chỉ nướng giòn cuốn lá kim', calories: 820, emoji: '🥩', color: PALETTE[1], tags: ['Cuối tuần', 'Đồ nướng'] },
      { id: 'h3', name: 'Lẩu Thái Hải Sản Cay', category: 'Lẩu Nóng', reason: 'Vị chua cay tôm hùm mực tươi cực đã', calories: 700, emoji: '🍲', color: PALETTE[2], tags: ['Chua cay', 'Mát trời'] },
      { id: 'h4', name: 'Ốc Luộc Mắm Gừng', category: 'Ăn Vặt Nóng', reason: 'Ốc nhồi luộc lá chanh nước mắm gừng ấm áp', calories: 320, emoji: '🐚', color: PALETTE[3], tags: ['Ốc đêm', 'Ấm áp'] },
      { id: 'h5', name: 'Mì Cay Hàn Quốc 7 Cấp', category: 'Mì Nóng', reason: 'Sợi mì Koreno dai giòn bò Mỹ bắp cải', calories: 510, emoji: '🌶️', color: PALETTE[4], tags: ['Siêu cay', 'Thử thách'] },
      { id: 'h6', name: 'Bánh Xèo Nam Bộ', category: 'Bánh Rán Nóng', reason: 'Vỏ giòn tôm thịt chấm nước mắm chua ngọt', calories: 540, emoji: '🥟', color: PALETTE[5], tags: ['Giòn rụm', 'Rau sống'] },
      { id: 'h7', name: 'Cháo Sườn Quẩy Giòn', category: 'Cháo Nóng', reason: 'Cháo bột mịn sánh ruốc thịt quẩy giòn tan', calories: 360, emoji: '🥣', color: PALETTE[6], tags: ['Ấm bụng', 'Mịn màng'] },
      { id: 'h8', name: 'Bún Bò Huế Đậm Đà', category: 'Bún / Món Cay', reason: 'Nước dùng mắm ruốc sả ớt chả giò heo', calories: 580, emoji: '🍜', color: PALETTE[7], tags: ['Đậm đà', 'Cố đô'] },
      { id: 'h9', name: 'Lẩu Nấm Thiên Nhiên', category: 'Lẩu Thanh Đạm', reason: 'Nấm đùi gà nấm kim châm ngọt nước', calories: 450, emoji: '🍄', color: PALETTE[8], tags: ['Nấm tươi', 'Bổ dưỡng'] },
      { id: 'h10', name: 'Thịt Nướng Ngói Sa Pa', category: 'Món Nướng', reason: 'Nướng ngói giữ trọn vị ngọt tự nhiên', calories: 690, emoji: '🍢', color: PALETTE[9], tags: ['Đặc sắc', 'Sa Pa'] }
    ]
  },
  {
    id: 'preset-healthy',
    name: '🥗 Healthy & Thanh Đạm Eat Clean',
    icon: 'eco',
    dishes: [
      { id: 'e1', name: 'Salad Ức Gà Sốt Nho', category: 'Salad Eatclean', reason: 'Protein cao ít béo tốt cho vóc dáng', calories: 310, emoji: '🥗', color: PALETTE[0], tags: ['Eat clean', 'Gym'] },
      { id: 'e2', name: 'Bún Gạo Lứt Chả Nướng', category: 'Món Lứt', reason: 'Tinh bột chậm no lâu không lo tăng cân', calories: 380, emoji: '🍜', color: PALETTE[1], tags: ['Gạo lứt', 'Low carb'] },
      { id: 'e3', name: 'Gỏi Cuốn Tôm Thịt Fresh', category: 'Món Cuốn', reason: 'Rau sống tươi rói tôm luộc ngọt tự nhiên', calories: 290, emoji: '🌯', color: PALETTE[2], tags: ['Tươi mát', 'Ít calo'] },
      { id: 'e4', name: 'Phở Chay Nấm Rơm', category: 'Món Chay', reason: 'Nước dùng củ quả ngọt thanh tự nhiên', calories: 320, emoji: '🍲', color: PALETTE[3], tags: ['Thanh tịnh', 'Chay'] },
      { id: 'e5', name: 'Cơm Gạo Lứt Cá Hồi', category: 'Cơm Healthy', reason: 'Omega-3 dồi dào bồi bổ trí não', calories: 480, emoji: '🍣', color: PALETTE[4], tags: ['Cá hồi', 'Tốt sức khỏe'] },
      { id: 'e6', name: 'Súp Rau Củ Hạt Quinoa', category: 'Súp Dinh Dưỡng', reason: 'Hạt siêu thực phẩm ngập tràn vitamin', calories: 260, emoji: '🥣', color: PALETTE[5], tags: ['Vitamin', 'Mát gan'] },
      { id: 'e7', name: 'Cháo Yến Mạch Táo Đỏ', category: 'Cháo Dinh Dưỡng', reason: 'Yến mạch giàu chất xơ táo đỏ dẻo ngọt', calories: 280, emoji: '🥣', color: PALETTE[6], tags: ['Yến mạch', 'Chất xơ'] },
      { id: 'e8', name: 'Bún Chay Nấm Đùi Gà', category: 'Bún Chay', reason: 'Nấm đùi gà dai ngọt giòn giòn', calories: 340, emoji: '🍜', color: PALETTE[7], tags: ['Chay ngon', 'Giòn ngọt'] },
      { id: 'e9', name: 'Pokebowl Cá Tươi Hawaii', category: 'Bowl Healthy', reason: 'Bơ chín béo ngậy cá ngừ ngô ngọt', calories: 420, emoji: '🥗', color: PALETTE[8], tags: ['Hawaii', 'Bơ tươi'] },
      { id: 'e10', name: 'Bánh Mì Ngũ Cốc Bơ Trứng', category: 'Bánh Mì Healthy', reason: 'Bơ nghiền mềm mịn trứng ốp la béo ngậy', calories: 350, emoji: '🥑', color: PALETTE[9], tags: ['Bơ tươi', 'Bữa sáng'] }
    ]
  },
  {
    id: 'preset-genz',
    name: '🍢 Ăn Vặt & Trà Sữa Gen Z',
    icon: 'local_cafe',
    dishes: [
      { id: 'z1', name: 'Trà Sữa Chà Nhài Kem Trứng', category: 'Đồ Uống', reason: 'Vị trà thơm lừng kem trứng béo ngậy', calories: 380, emoji: '🧋', color: PALETTE[0], tags: ['Trà sữa', 'Gen Z'] },
      { id: 'z2', name: 'Bánh Tráng Trộn Long An', category: 'Ăn Vặt', reason: 'Bò khô bò xé trứng cút quất chua cay', calories: 320, emoji: '🥗', color: PALETTE[1], tags: ['Bánh tráng', 'Chua cay'] },
      { id: 'z3', name: 'Nem Chua Nướng Chua Cay', category: 'Ăn Vặt Nóng', reason: 'Nem chua nướng than hoa chấm tương ớt', calories: 290, emoji: '🍢', color: PALETTE[2], tags: ['Thơm nức', 'Hà Nội'] },
      { id: 'z4', name: 'Xiên Bẩn Thần Thánh Sốt Mắm', category: 'Chiên Nóng', reason: 'Cá viên tôm viên sốt mắm tỏi bơ cay', calories: 450, emoji: '🍡', color: PALETTE[3], tags: ['Xiên bẩn', 'Gây nghiện'] },
      { id: 'z5', name: 'Chè Thái Sầu Riêng Béo Ngậy', category: 'Tráng Miệng', reason: 'Sầu riêng tươi múi mập nước cốt dừa', calories: 410, emoji: '🍨', color: PALETTE[4], tags: ['Chè thái', 'Sầu riêng'] },
      { id: 'z6', name: 'Bingsu Hoa Quả Tuyết Bay', category: 'Đồ Lạnh', reason: 'Kem tuyết sữa tươi xoài dầm dâu tây', calories: 360, emoji: '🍧', color: PALETTE[5], tags: ['Giải nhiệt', 'Hàn Quốc'] },
      { id: 'z7', name: 'Cá Viên Chiên Mắm Tỏi', category: 'Ăn Vặt', reason: 'Cá viên giòn bơ tỏi ớt hiểm cay nồng', calories: 420, emoji: '🍤', color: PALETTE[6], tags: ['Bơ tỏi', 'Giòn rụm'] },
      { id: 'z8', name: 'Bánh Tart Trứng Hồng Kông', category: 'Bánh Ngọt', reason: 'Vỏ ngàn lớp giòn tan nhân kem trứng nướng', calories: 280, emoji: '🥧', color: PALETTE[7], tags: ['Nướng nóng', 'Giòn ngàn lớp'] },
      { id: 'z9', name: 'Caramen Nếp Cẩm Dừa Nạo', category: 'Tráng Miệng', reason: 'Nếp cẩm dẻo bùi caramen béo ngậy', calories: 260, emoji: '🍮', color: PALETTE[8], tags: ['Caramen', 'Dẻo bùi'] },
      { id: 'z10', name: 'Trà Đào Cam Sả Thơm Mát', category: 'Đồ Uống', reason: 'Đào giòn sả thơm lừng cam tươi mộng nước', calories: 190, emoji: '🍹', color: PALETTE[9], tags: ['Thanh mát', 'Thảo mộc'] }
    ]
  }
];

@Injectable({ providedIn: 'root' })
export class FoodAiService {
  public isAiLoading = signal<boolean>(false);
  public aiError = signal<string | null>(null);

  /**
   * Request Gemini AI to suggest 10 Dishes + 7-Day Meal Plan
   * based on current date, special events, and Open-Meteo weather data.
   */
  public async generateAiFoodSuggestions(weather: WeatherData): Promise<AiFoodResponse> {
    this.isAiLoading.set(true);
    this.aiError.set(null);

    const now = new Date();
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const currentDayName = dayNames[now.getDay()];
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const prompt = `Bạn là Chuyên gia Ẩm thực & AI Chef cá nhân cao cấp.
Hôm nay là: ${currentDayName}, ngày ${dateStr}.
Dữ liệu thời tiết hiện tại từ Open-Meteo ở ${weather.locationName}:
- Nhiệt độ: ${weather.temperature}°C
- Độ ẩm: ${weather.humidity}%
- Tình trạng: ${weather.conditionText}
- Lời khuyên thời tiết: ${weather.recommendation}

Hãy phân tích ngày hôm nay (ngày ${dateStr}) xem có sự kiện đặc biệt gì không (ví dụ: ngày lễ, ngày cuối tuần, tiết khí mùa thu/đông/xuân, ngày nạp năng lượng hay xả stress).
Dựa vào đó, hãy gợi ý đúng 10 MÓN ĂN VIỆT NAM / QUỐC TẾ cực ngon phù hợp với thời tiết và sự kiện hôm nay, kèm LỊCH ĂN 7 NGÀY CẢ TUẦN.

Yêu cầu định dạng phản hồi: Trả về DUY NHẤT một chuỗi JSON hợp lệ (KHÔNG bọc code block markdown, KHÔNG thêm văn bản dẫn dắt):
{
  "aiEventNote": "Phân tích ngắn 2-3 câu về sự kiện ngày hôm nay và lý do thời tiết ${weather.temperature}°C phù hợp với thực đơn này.",
  "dishes": [
    {
      "id": "dish_1",
      "name": "Tên món ăn 1",
      "category": "Loại món",
      "reason": "Lý do AI gợi ý hôm nay",
      "calories": 450,
      "emoji": "🍜",
      "color": "${PALETTE[0]}",
      "tags": ["Thơm ngon", "Nóng hổi"]
    },
    ... (phải đúng 10 món, gán color lần lượt từ ${JSON.stringify(PALETTE)})
  ],
  "weeklyPlan": [
    {
      "dayName": "Thứ Hai",
      "dateStr": "08/09",
      "breakfast": "Phở bò tái",
      "lunch": "Cơm sườn nướng",
      "dinner": "Lẩu thái chua cay",
      "snack": "Trà sữa nhài",
      "healthTip": "Bổ sung nhiều nước"
    },
    ... (đủ 7 ngày từ Thứ Hai đến Chủ Nhật)
  ]
}`;

    try {
      const rawResponse = await callGeminiAiApi(prompt);
      
      // Clean potential JSON markdown blocks ```json ... ```
      let jsonString = rawResponse.trim();
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
      }

      const parsed: AiFoodResponse = JSON.parse(jsonString);

      // Validate structure
      if (parsed && Array.isArray(parsed.dishes) && parsed.dishes.length > 0) {
        // Ensure 10 dishes have proper colors & IDs
        parsed.dishes = parsed.dishes.slice(0, 10).map((dish, idx) => ({
          ...dish,
          id: dish.id || `ai_dish_${idx + 1}`,
          color: PALETTE[idx % PALETTE.length],
          emoji: dish.emoji || '🍲',
        }));

        if (!Array.isArray(parsed.weeklyPlan) || parsed.weeklyPlan.length === 0) {
          parsed.weeklyPlan = this.generateFallbackWeeklyPlan();
        }

        return parsed;
      } else {
        throw new Error('Dữ liệu AI trả về không đúng cấu trúc 10 món.');
      }
    } catch (err: any) {
      console.warn('FoodAiService Gemini Error:', err);
      this.aiError.set('Gemini AI bận, đang dùng gợi ý thực đơn thông minh mẩu.');
      return this.getFallbackAiResponse(weather, currentDayName, dateStr);
    } finally {
      this.isAiLoading.set(false);
    }
  }

  /**
   * Fallback response in case Gemini API is unreachable
   */
  public getFallbackAiResponse(weather: WeatherData, dayName: string, dateStr: string): AiFoodResponse {
    const studentPreset = PRESET_MENUS[0];
    const isCold = weather.temperature < 22;
    const selectedPreset = isCold ? PRESET_MENUS[1] : studentPreset;

    return {
      aiEventNote: `Hôm nay ${dayName} (${dateStr}) thời tiết ${weather.temperature}°C tại ${weather.locationName} (${weather.conditionText}). ${weather.recommendation}`,
      dishes: selectedPreset.dishes,
      weeklyPlan: this.generateFallbackWeeklyPlan(),
    };
  }

  /**
   * Generate default 7-Day Meal Plan
   */
  public generateFallbackWeeklyPlan(): DailyMealPlan[] {
    const days = [
      { day: 'Thứ Hai', breakfast: 'Phở Bò Tái Lăn', lunch: 'Cơm Tấm Sườn Bì', dinner: 'Bún Riêu Cua', snack: 'Bánh Mì Que', tip: 'Đầu tuần nạp đủ năng lượng protein' },
      { day: 'Thứ Ba', breakfast: 'Bún Cá Chấm Giòn', lunch: 'Cơm Gà Xối Mỡ', dinner: 'Canh Chua Cá Lóc', snack: 'Trà Đào Cam Sả', tip: 'Bổ sung chất xơ với rau xanh' },
      { day: 'Thứ Tư', breakfast: 'Cháo Sườn Quẩy', lunch: 'Bún Chả Hà Nội', dinner: 'Cơm Bò Sốt Tiêu', snack: 'Bánh Tráng Trộn', tip: 'Uống đủ 2L nước mỗi ngày' },
      { day: 'Thứ Năm', breakfast: 'Bánh Mì Thịt Nướng', lunch: 'Bún Đậu Mắm Tôm', dinner: 'Phở Cuốn Bò', snack: 'Chè Thái Sầu Riêng', tip: 'Hạn chế đồ quá mặn vào buổi tối' },
      { day: 'Thứ Sáu', breakfast: 'Bún Bò Huế', lunch: 'Cơm Lứt Cá Hồi', dinner: 'Lẩu Riêu Cua Đồng', snack: 'Trà Sữa Trân Châu', tip: 'Thư giãn cuối tuần nhẹ nhàng' },
      { day: 'Thứ Bảy', breakfast: 'Mì Cay Hàn Quốc', lunch: 'BBQ Đồ Nướng', dinner: 'Lẩu Thái Hải Sản', snack: 'Bingsu Hoa Quả', tip: 'Tụ tập bạn bè chill nhẹ' },
      { day: 'Chủ Nhật', breakfast: 'Bánh Xèo Nam Bộ', lunch: 'Cơm Gia Đình', dinner: 'Cháo Yến Mạch', snack: 'Caramen Dừa', tip: 'Thanh lọc cơ thể chuẩn bị tuần mới' },
    ];

    return days.map((d, i) => ({
      dayName: d.day,
      dateStr: `Ngày ${i + 1}`,
      breakfast: d.breakfast,
      lunch: d.lunch,
      dinner: d.dinner,
      snack: d.snack,
      healthTip: d.tip,
    }));
  }
}
