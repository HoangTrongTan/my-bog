import { Injectable, signal } from '@angular/core';
import { FEEDBACK_API_BASE_URL } from '../constants/feedback.constants';
import { FeedbackItem, CreateFeedbackPayload, ApiResponse } from '../types';

export * from '../types';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  public feedbackListSignal = signal<FeedbackItem[]>([]);
  public isLoadingSignal = signal<boolean>(false);
  public isSubmittingSignal = signal<boolean>(false);
  public errorSignal = signal<string | null>(null);

  /**
   * 1. READ ALL (Lấy toàn bộ danh sách feedback)
   * Method: GET
   * Endpoint: ${BASE_URL}?action=read
   */
  public async getAllFeedback(): Promise<FeedbackItem[]> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const url = `${FEEDBACK_API_BASE_URL}?action=read`;
      const res = await fetch(url, { method: 'GET', redirect: 'follow' });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const resJson: ApiResponse<FeedbackItem[]> = await res.json();
      if (resJson.status === 'success' && Array.isArray(resJson.data)) {
        this.feedbackListSignal.set(resJson.data);
        return resJson.data;
      } else {
        throw new Error(resJson.message || 'Lỗi dữ liệu từ máy chủ');
      }
    } catch (err: any) {
      console.error('getAllFeedback Error:', err);
      this.errorSignal.set(err.message || 'Không thể tải danh sách góp ý');
      return [];
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * 2. GET DETAILS (Lấy chi tiết 1 item)
   * Method: GET
   * Endpoint: ${BASE_URL}?action=get&id=${id}
   */
  public async getFeedbackById(id: string): Promise<FeedbackItem | null> {
    try {
      const url = `${FEEDBACK_API_BASE_URL}?action=get&id=${encodeURIComponent(id)}`;
      const res = await fetch(url, { method: 'GET', redirect: 'follow' });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const resJson: ApiResponse<FeedbackItem> = await res.json();
      if (resJson.status === 'success' && resJson.data) {
        return resJson.data;
      }
      return null;
    } catch (err) {
      console.error('getFeedbackById Error:', err);
      return null;
    }
  }

  /**
   * 3. CREATE (Thêm bản ghi mới)
   * Method: POST
   * Headers: Content-Type: text/plain;charset=utf-8
   * Body: { action: "create", fullName, email, category, rating, content }
   */
  public async createFeedback(payload: CreateFeedbackPayload): Promise<string> {
    this.isSubmittingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const requestBody = JSON.stringify({
        action: 'create',
        fullName: payload.fullName.trim(),
        email: (payload.email || '').trim(),
        category: payload.category,
        rating: Number(payload.rating) || 5,
        content: payload.content.trim(),
      });

      const res = await fetch(FEEDBACK_API_BASE_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: requestBody,
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const resJson: ApiResponse = await res.json();
      if (resJson.status === 'success' && resJson.id) {
        // Refresh feedback list after creation
        await this.getAllFeedback();
        return resJson.id;
      } else {
        throw new Error(resJson.message || 'Tạo phản hồi thất bại');
      }
    } catch (err: any) {
      console.error('createFeedback Error:', err);
      this.errorSignal.set(err.message || 'Không thể gửi phản hồi');
      throw err;
    } finally {
      this.isSubmittingSignal.set(false);
    }
  }

  /**
   * 4. DELETE SINGLE (Xóa 1 dòng)
   * Method: POST
   * Headers: Content-Type: text/plain;charset=utf-8
   * Body: { action: "delete", id: string }
   */
  public async deleteFeedback(id: string): Promise<boolean> {
    this.errorSignal.set(null);
    try {
      const requestBody = JSON.stringify({
        action: 'delete',
        id: id,
      });

      const res = await fetch(FEEDBACK_API_BASE_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: requestBody,
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const resJson: ApiResponse = await res.json();
      if (resJson.status === 'success') {
        // Optimistic UI update
        this.feedbackListSignal.update((list) => list.filter((item) => item.id !== id));
        return true;
      }
      this.errorSignal.set(resJson.message || 'Xóa phản hồi thất bại');
      return false;
    } catch (err: any) {
      console.error('deleteFeedback Error:', err);
      this.errorSignal.set(err.message || 'Không thể xóa phản hồi');
      return false;
    }
  }

  /**
   * 5. MULTI-DELETE (Xóa nhiều dòng cùng lúc)
   * Method: POST
   * Headers: Content-Type: text/plain;charset=utf-8
   * Body: { action: "multi_delete", ids: string[] }
   */
  public async multiDeleteFeedback(ids: string[]): Promise<boolean> {
    this.errorSignal.set(null);
    try {
      const requestBody = JSON.stringify({
        action: 'multi_delete',
        ids: ids,
      });

      const res = await fetch(FEEDBACK_API_BASE_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: requestBody,
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const resJson: ApiResponse = await res.json();
      if (resJson.status === 'success') {
        const idSet = new Set(ids);
        this.feedbackListSignal.update((list) => list.filter((item) => !idSet.has(item.id)));
        return true;
      }
      this.errorSignal.set(resJson.message || 'Xóa các phản hồi đã chọn thất bại');
      return false;
    } catch (err: any) {
      console.error('multiDeleteFeedback Error:', err);
      this.errorSignal.set(err.message || 'Không thể xóa các phản hồi đã chọn');
      return false;
    }
  }
}
