"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import QuestionForm from "@/components/QuestionForm";
import { Question } from "@/types/question";
import { questionApi } from "@/utils/api";

export default function EditQuestionPage() {
  const params = useParams();
  const id = Number(params.id);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuestion = useCallback(async () => {
    try {
      const data = await questionApi.getQuestion(id);
      setQuestion(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "質問の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!question) return <div>質問が見つかりません</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">質問の編集</h1>
      <QuestionForm initialData={question} isEdit={true} />
    </div>
  );
}
