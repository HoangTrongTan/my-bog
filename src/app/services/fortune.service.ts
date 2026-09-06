import { Injectable } from '@angular/core';
import { callGeminiAiApi } from '../configs/api.config';

export interface FortuneRequest {
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  gender: 'nam' | 'nu' | 'khac';
  focusArea: 'tong-quan' | 'su-nghiep' | 'tai-loc' | 'tinh-duyen' | 'than-so-hoc';
}

export interface FortuneResponse {
  lifePathNumber: number;
  numerologySummary: string;
  personality: {
    traits: string[];
    strengths: string[];
    weaknesses: string[];
  };
  careerAndWealth: {
    careerOutlook: string;
    wealthOutlook: string;
    favorableSectors: string[];
  };
  loveAndRelationships: string;
  destinyAdvice: string;
  luckyElements: {
    luckyColors: string[];
    luckyNumbers: number[];
    fengShuiDirection: string;
  };
}

export interface FortuneSlip {
  grade: '🌟 ĐẠI CÁT' | '💫 TRUNG CÁT' | '🌸 TIỂU CÁT' | '🍀 CÁT TƯỜNG';
  hexagram: string;
  poem: string[];
  oracleAdvice: string;
  luckyColors: string[];
  luckyNumbers: number[];
}

@Injectable({ providedIn: 'root' })
export class FortuneService {
  /**
   * Generates a 100% dynamic AI Fortune Slip (Quẻ Xăm Cát Tường) using Gemini AI API.
   */
  public async drawFortuneSlipAi(
    focusArea: 'su-nghiep' | 'tai-loc' | 'tinh-duyen' | 'tong-quan' | 'than-so-hoc' = 'su-nghiep',
    fullName?: string,
    birthDate?: string
  ): Promise<FortuneSlip> {
    const focusLabel =
      focusArea === 'su-nghiep'
        ? 'Sự Nghiệp & Công Danh'
        : focusArea === 'tai-loc'
        ? 'Tài Lộc & Tiền Bạc'
        : focusArea === 'tinh-duyen'
        ? 'Tình Duyên & Gia Đạo'
        : 'Vận Mệnh & Thần Số Học';

    const userStr = fullName ? `người dùng tên "${fullName}"` : 'Quý Khách Cát Tường';
    const birthStr = birthDate ? `ngày sinh ${birthDate}` : '';

    const prompt = `
Bạn là một Thầy Bói Toán, Chuyên Gia Tử Vi & Thần Kê Thơ Phú cao cấp hàng đầu Việt Nam.
Hãy gieo một Quẻ Xăm Cát Tường linh ứng, sáng tạo độc đáo dành riêng cho ${userStr} ${birthStr} tập trung vào khía cạnh [${focusLabel}].

YÊU CẦU ĐỊNH DẠNG JSON (Không bọc markdown code block, trả về duy nhất 1 JSON hợp lệ):
{
  "grade": "🌟 ĐẠI CÁT" (hoặc "💫 TRUNG CÁT", "🌸 TIỂU CÁT", "🍀 CÁT TƯỜNG"),
  "hexagram": "Quẻ Tên Quẻ (Mô tả ngắn thời vận 4-6 từ, ví dụ: 'Quẻ Số 18: Càn Vi Thiên (Vận Hội Hanh Thông)')",
  "poem": [
    "Câu thơ thất ngôn 1 (7 chữ, có vần điệu thơ Hán Nôm / Lục bát / Thất ngôn)",
    "Câu thơ thất ngôn 2 (7 chữ)",
    "Câu thơ thất ngôn 3 (7 chữ)",
    "Câu thơ thất ngôn 4 (7 chữ)"
  ],
  "oracleAdvice": "Lời khuyên giải quẻ triết lý, ngắn gọn, súc tích, truyền cảm hứng và hướng dẫn cụ thể (2-3 câu, chứa emoji).",
  "luckyColors": ["Màu may mắn 1", "Màu may mắn 2"],
  "luckyNumbers": [3, 8, 9]
}
`;

    try {
      const rawText = await callGeminiAiApi(prompt);
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        grade: parsed.grade || '🌟 ĐẠI CÁT',
        hexagram: parsed.hexagram || 'Quẻ Linh Sơ Thần Sổ (Thời Vận Hanh Thông)',
        poem:
          Array.isArray(parsed.poem) && parsed.poem.length >= 4
            ? parsed.poem
            : [
                'Càn Khôn Vũ Trụ Ngút Trời Mây,',
                'Sự Nghiệp Công Danh Vẫn Vững Dày.',
                'Kiên Trì Khai Lối Rồng Rẽ Sóng,',
                'Cát Tường Như Ý Vượng Lộc Này.',
              ],
        oracleAdvice:
          parsed.oracleAdvice ||
          'Thời vận hội tụ, quý nhân trợ lực. Hãy tự tin thực hiện các kế hoạch dự án lớn!',
        luckyColors: Array.isArray(parsed.luckyColors) ? parsed.luckyColors : ['Cyan', 'Emerald'],
        luckyNumbers: Array.isArray(parsed.luckyNumbers) ? parsed.luckyNumbers : [6, 8, 9],
      };
    } catch (err) {
      console.warn('Gemini AI Fortune Slip call failed, using fallback:', err);
      return {
        grade: '🌟 ĐẠI CÁT',
        hexagram: 'Quẻ Số 08: Càn Vi Thiên (Khai Sơn Lập Địa)',
        poem: [
          'Rồng Vàng Vươn Cánh Vượt Mây Xanh,',
          'Sự Nghiệp Hanh Thông Chí Lớn Thành.',
          'Tài Lộc Đong Đầy Theo Giáp Tý,',
          'Vạn Sự Cát Tường Bình An Nhanh.',
        ],
        oracleAdvice:
          'Thời vận hội tụ, quý nhân trợ lực. Hãy tự tin thực hiện các kế hoạch dự án lớn, thành công rực rỡ đang chờ đón bạn.',
        luckyColors: ['Xanh Cyan', 'Vàng Hoàng Kim'],
        luckyNumbers: [6, 8, 9],
      };
    }
  }
  public async generateFortune(req: FortuneRequest): Promise<FortuneResponse> {
    const lifePath = this.calculateLifePathNumber(req.birthDate);

    const prompt = `
Bạn là một Thầy Bói Toán, Chuyên Gia Thần Số Học & Tử Vi Tướng Số cao cấp hàng đầu Việt Nam.
Hãy phân tích vận mệnh, tính cách, thần số học, đường sự nghiệp, tài lộc và tình duyên cho người dùng dựa trên thông tin sau:
- Họ và tên: ${req.fullName}
- Ngày tháng năm sinh: ${req.birthDate} ${req.birthTime ? 'Giờ sinh: ' + req.birthTime : ''}
- Giới tính: ${req.gender === 'nam' ? 'Nam' : req.gender === 'nu' ? 'Nữ' : 'Khác'}
- Khía cạnh cần tập trung: ${req.focusArea}
- Con số chủ đạo thần số học tính toán: ${lifePath}

YÊU CẦU: Trả về KẾT QUẢ ĐÚNG ĐỊNH DẠNG JSON duy nhất (không bọc trong markdown code block, không thêm văn bản thừa nào ngoài JSON) theo cấu trúc chính xác sau:
{
  "lifePathNumber": ${lifePath},
  "numerologySummary": "Tóm tắt ngắn gọn ý nghĩa con số chủ đạo thần số học...",
  "personality": {
    "traits": ["Đặc điểm 1", "Đặc điểm 2", "Đặc điểm 3"],
    "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
    "weaknesses": ["Điểm cần lưu ý 1", "Điểm cần lưu ý 2"]
  },
  "careerAndWealth": {
    "careerOutlook": "Dự đoán sự nghiệp và con đường thăng tiến...",
    "wealthOutlook": "Dự đoán tài lộc, dòng tiền...",
    "favorableSectors": ["Lĩnh vực hợp 1", "Lĩnh vực hợp 2", "Lĩnh vực hợp 3"]
  },
  "loveAndRelationships": "Dự đoán tình duyên, gia đạo, các mối quan hệ...",
  "destinyAdvice": "Lời khuyên vận mệnh triết lý và định hướng tương lai...",
  "luckyElements": {
    "luckyColors": ["Màu may mắn 1", "Màu may mắn 2"],
    "luckyNumbers": [3, 8, 9],
    "fengShuiDirection": "Hướng phong thủy đại cát"
  }
}
`;

    try {
      const rawText = await callGeminiAiApi(prompt);
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return parsed as FortuneResponse;
    } catch (err) {
      console.warn('Gemini AI Fortune call failed, using fallback fortune:', err);
      return this.generateFallbackFortune(req, lifePath);
    }
  }

  public calculateLifePathNumber(birthDate: string): number {
    if (!birthDate) return 7;
    const digits = birthDate.replace(/\D/g, '').split('').map(Number);
    let sum = digits.reduce((a, b) => a + b, 0);

    while (sum > 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    return sum;
  }

  private generateFallbackFortune(req: FortuneRequest, lifePath: number): FortuneResponse {
    const name = req.fullName || 'Bạn';
    return {
      lifePathNumber: lifePath,
      numerologySummary: `${name} mang Con số chủ đạo ${lifePath} trong Thần số học Pythagore. Bạn sở hữu nguồn năng lượng trí tuệ, tư duy nhạy bén và khát vọng vươn tới những tầm cao mới trong cuộc sống.`,
      personality: {
        traits: ['Thông minh & Nhạy bén', 'Sáng tạo & Đam mê', 'Trách nhiệm & Kiên trì'],
        strengths: ['Tư duy logic cao', 'Khả năng lãnh đạo tự nhiên', 'Kiên định với mục tiêu'],
        weaknesses: ['Đôi khi ôm đồm công việc', 'Cần giữ bình tĩnh trước áp lực lớn']
      },
      careerAndWealth: {
        careerOutlook: `Đường sự nghiệp của ${name} có quý nhân phù trợ. Giai đoạn sắp tới là thời điểm bứt phá mạnh mẽ trong công nghệ, quản lý và sáng tạo dự án lớn.`,
        wealthOutlook: 'Tài lộc hanh thông, nguồn thu đến từ cả công việc chính lẫn các khoản đầu tư thông minh dài hạn.',
        favorableSectors: ['Công nghệ thông tin & AI', 'Quản lý dự án & Doanh nghiệp', 'Bất động sản & Tài chính']
      },
      loveAndRelationships: 'Tình duyên êm đẹp, hòa hợp. Bạn là người chân thành, biết quan tâm và luôn là chỗ dựa vững chắc cho gia đình và người thương.',
      destinyAdvice: 'Hãy luôn tin tưởng vào con đường mình chọn. Sự kiên trì và tinh thần học hỏi không ngừng sẽ đưa bạn chạm tới mọi đỉnh cao ước mơ.',
      luckyElements: {
        luckyColors: ['Xanh lam / Cyan', 'Vàng kim', 'Tím thạch anh'],
        luckyNumbers: [lifePath, 6, 8, 9],
        fengShuiDirection: 'Đông Nam & Chính Bắc (Đại Cát)'
      }
    };
  }
}
