import QuestionForm from "@/components/QuestionForm";

export default function NewQuestionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">新規質問作成</h1>
      <QuestionForm />
    </div>
  );
}
