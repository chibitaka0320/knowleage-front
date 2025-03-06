"use client";

import { useEffect, useState } from "react";
import { Question, Category } from "@/types/question";
import { questionApi, categoryApi } from "@/utils/api";
import Link from "next/link";
import MarkdownContent from "./MarkdownContent";
import CategorySelector from "./CategorySelector";

export default function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const pageSize = 10;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [currentPage, selectedCategories]);

  const loadCategories = async () => {
    try {
      const data = await categoryApi.getCategories();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "カテゴリの取得に失敗しました"
      );
    }
  };

  const loadQuestions = async () => {
    try {
      const categoryIds = selectedCategories.map((category) => category.id);
      const data = await questionApi.getQuestionsByPage(
        currentPage,
        pageSize,
        categoryIds
      );
      setQuestions(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "質問の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setExpandedId(null); // ページ変更時に展開状態をリセット
  };

  const handleCategoryChange = (newCategories: Category[]) => {
    setSelectedCategories(newCategories);
    setCurrentPage(0); // カテゴリ変更時にページをリセット
    setExpandedId(null); // カテゴリ変更時に展開状態をリセット
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">質問一覧</h1>
        <div className="space-x-2">
          <Link
            href="/quiz"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            模擬試験モード
          </Link>
        </div>
      </div>

      <CategorySelector
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
      />

      {questions.length === 0 ? (
        <p>質問がありません</p>
      ) : (
        <>
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.id}
                className="border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            question.id && toggleAnswer(question.id)
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <span className="text-xl font-bold">
                            {expandedId === question.id ? "−" : "＋"}
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            question.id && toggleAnswer(question.id)
                          }
                          className="text-left hover:text-gray-700 flex-1"
                        >
                          <div className="text-gray-600">
                            <div className="text-lg font-semibold line-clamp-2">
                              {question.content}
                            </div>
                          </div>
                        </button>
                      </div>
                      {/* カテゴリタグの表示 */}
                      {question.categories &&
                        question.categories.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {question.categories.map((category) => (
                              <span
                                key={category.id}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {category.name}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                  {expandedId === question.id && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">解答例：</h3>
                        <MarkdownContent content={question.exampleAnswer} />
                      </div>
                      <div className="mt-4">
                        <Link
                          href={`/questions/${question.id}`}
                          className="inline-flex items-center text-blue-500 hover:text-blue-600"
                        >
                          <span>詳細な解説を見る</span>
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    作成日: {new Date(question.createdAt!).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ページネーション */}
          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              前へ
            </button>
            <span className="text-gray-600">
              {currentPage + 1} / {totalPages} ページ （全{totalElements}件）
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              次へ
            </button>
          </div>
        </>
      )}
    </div>
  );
}
