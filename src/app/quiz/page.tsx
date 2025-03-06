"use client";

import { useState, useEffect } from "react";
import { Question, Category } from "@/types/question";
import { questionApi, categoryApi } from "@/utils/api";
import CategorySelector from "@/components/CategorySelector";
import QuizMode from "@/components/QuizMode";

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryApi.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "カテゴリの取得に失敗しました"
      );
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    try {
      setLoading(true);
      const data = await questionApi.getAllQuestions();
      // カテゴリでフィルタリング
      let filteredQuestions =
        selectedCategories.length > 0
          ? data.filter((q) =>
              q.categories?.some((qc) =>
                selectedCategories.some((sc) => sc.id === qc.id)
              )
            )
          : data;

      // ランダムに5問選択
      filteredQuestions = filteredQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      setQuestions(filteredQuestions);
      setStarted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "質問の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStarted(false);
    setQuestions([]);
    setSelectedCategories([]);
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!started) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">模擬試験モード</h1>
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <CategorySelector
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />
          <div className="flex justify-center">
            <button
              onClick={startQuiz}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              開始
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <QuizMode questions={questions} onReset={handleReset} />;
}
