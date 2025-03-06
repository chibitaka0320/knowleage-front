"use client";

import { useState } from "react";
import { Question } from "@/types/question";
import { questionApi } from "@/utils/api";
import { useRouter } from "next/navigation";

interface QuestionFormProps {
  initialData?: Question;
  isEdit?: boolean;
}

export default function QuestionForm({
  initialData,
  isEdit = false,
}: QuestionFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Question>(
    initialData || {
      title: "",
      content: "",
      exampleAnswer: "",
      detailedContent: "",
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && initialData?.id) {
        await questionApi.updateQuestion(initialData.id, formData);
      } else {
        await questionApi.createQuestion(formData);
      }
      router.push("/questions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          質問内容
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="exampleAnswer"
          className="block text-sm font-medium text-gray-700"
        >
          解答例
        </label>
        <textarea
          id="exampleAnswer"
          name="exampleAnswer"
          value={formData.exampleAnswer}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="detailedContent"
          className="block text-sm font-medium text-gray-700"
        >
          詳細な解説
        </label>
        <textarea
          id="detailedContent"
          name="detailedContent"
          value={formData.detailedContent}
          onChange={handleChange}
          required
          rows={8}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          マークダウン形式で記述できます
        </p>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "保存中..." : isEdit ? "更新" : "作成"}
        </button>
      </div>
    </form>
  );
}
