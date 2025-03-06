export interface Category {
  id: number;
  name: string;
  code: string;
}

export interface Question {
  id?: number;
  title: string;
  content: string;
  exampleAnswer: string;
  detailedContent: string;
  createdAt?: string;
  updatedAt?: string;
  categories?: Category[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}
