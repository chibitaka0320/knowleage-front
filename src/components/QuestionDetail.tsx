"use client";

import { useEffect, useState } from "react";
import { Question } from "@/types/question";
import { questionApi } from "@/utils/api";
import Link from "next/link";
import MarkdownContent from "./MarkdownContent";

interface QuestionDetailProps {
  id: number;
}

export default function QuestionDetail({ id }: QuestionDetailProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const data = await questionApi.getQuestion(id);
        setQuestion(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "質問の取得に失敗しました"
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [id]);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!question) return <div>質問が見つかりません</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{question.title}</h1>
        <div className="space-x-2">
          <Link
            href="/questions"
            className="text-white bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
          >
            一覧に戻る
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">質問内容</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <MarkdownContent content={question.content} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">解答例</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <MarkdownContent content={question.exampleAnswer} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">詳細な解説</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <MarkdownContent content={question.detailedContent} />
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <div>作成日: {new Date(question.createdAt!).toLocaleString()}</div>
            <div>更新日: {new Date(question.updatedAt!).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
