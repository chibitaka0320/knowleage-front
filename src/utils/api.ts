import { Question, ApiResponse, Category } from "@/types/question";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

// 共通のフェッチオプション
const defaultFetchOptions: RequestInit = {
  credentials: "include" as RequestCredentials, // CSRFトークンのためにクッキーを含める
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest", // CSRF対策
  },
};

// 安全なURLパラメータの作成
const createSafeUrlParams = (
  params: Record<string, string | number | string[] | number[]>
) => {
  const url = new URL(`${API_BASE_URL}/questions/page`);
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(key, v.toString()));
    } else {
      url.searchParams.append(key, value.toString());
    }
  });
  return url;
};

interface EvaluationRequest {
  questionContent: string;
  exampleAnswer: string;
  userAnswer: string;
}

interface EvaluationResponse {
  accuracy: number;
  feedback: string;
  goodPoints: string[];
  improvementPoints: string[];
  detailedAdvice: string;
}

export const questionApi = {
  // 全ての質問を取得
  async getAllQuestions(): Promise<Question[]> {
    const response = await fetch(
      `${API_BASE_URL}/questions`,
      defaultFetchOptions
    );
    const data: ApiResponse<Question[]> = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message);
  },

  // ページング付きで質問を取得
  async getQuestionsByPage(
    page: number,
    size: number = 10,
    categoryIds?: number[]
  ): Promise<{
    content: Question[];
    totalPages: number;
    totalElements: number;
  }> {
    // パラメータのバリデーション
    if (page < 0) throw new Error("ページ番号は0以上である必要があります");
    if (size <= 0) throw new Error("ページサイズは1以上である必要があります");
    if (categoryIds?.some((id) => id <= 0))
      throw new Error("カテゴリIDは1以上である必要があります");

    const url = createSafeUrlParams({
      page: page.toString(),
      size: size.toString(),
      ...(categoryIds && categoryIds.length > 0 ? { categoryIds } : {}),
    });

    const response = await fetch(url.toString(), defaultFetchOptions);
    const data = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message);
  },

  // 特定の質問を取得
  async getQuestion(id: number): Promise<Question> {
    if (id <= 0) throw new Error("質問IDは1以上である必要があります");

    const response = await fetch(
      `${API_BASE_URL}/questions/${id}`,
      defaultFetchOptions
    );
    const data: ApiResponse<Question> = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message);
  },

  // 新しい質問を作成
  async createQuestion(question: Question): Promise<Question> {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      ...defaultFetchOptions,
      method: "POST",
      body: JSON.stringify(question),
    });
    const data: ApiResponse<Question> = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message);
  },

  // 質問を更新
  async updateQuestion(id: number, question: Question): Promise<Question> {
    if (id <= 0) throw new Error("質問IDは1以上である必要があります");

    const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
      ...defaultFetchOptions,
      method: "PUT",
      body: JSON.stringify(question),
    });
    const data: ApiResponse<Question> = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message);
  },

  // 質問を削除
  async deleteQuestion(id: number): Promise<void> {
    if (id <= 0) throw new Error("質問IDは1以上である必要があります");

    const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
      ...defaultFetchOptions,
      method: "DELETE",
    });
    const data: ApiResponse<void> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
  },

  evaluateAnswer: async (
    request: EvaluationRequest
  ): Promise<EvaluationResponse> => {
    const response = await fetch(`${API_BASE_URL}/evaluate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("回答の評価に失敗しました");
    }

    return response.json();
  },
};

export const categoryApi = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data: ApiResponse<Category[]> = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message);
  },

  // 全てのカテゴリを取得
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data: ApiResponse<Category[]> = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message);
  },
};
