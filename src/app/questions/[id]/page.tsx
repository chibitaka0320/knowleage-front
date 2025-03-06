"use client";

import QuestionDetail from "@/components/QuestionDetail";
import { useParams } from "next/navigation";

export default function QuestionDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <QuestionDetail id={id} />
    </div>
  );
}
