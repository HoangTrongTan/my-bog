import { Injectable } from '@angular/core';
import { getGeminiApiKey } from '../configs/api.config';

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

@Injectable({ providedIn: 'root' })
export class FortuneService {
  private readonly MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];

  public async generateFortune(req: FortuneRequest): Promise<FortuneResponse> {
    const lifePath = this.calculateLifePathNumber(req.birthDate);
    const apiKey = getGeminiApiKey();

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

    // Try Gemini API models
    for (const model of this.MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            return parsed as FortuneResponse;
          }
        }
      } catch (err) {
        console.warn(`Model ${model} call failed, trying fallback...`, err);
      }
    }

    // Fallback Numerology Generator if API is unreachable
    return this.generateFallbackFortune(req, lifePath);
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
