"use client";

import { useState } from "react";
import { Question } from "@/types/question";
import { questionApi } from "@/utils/api";
import MarkdownContent from "./MarkdownContent";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ClipLoader } from "react-spinners";

ChartJS.register(ArcElement, Tooltip, Legend);

interface QuizModeProps {
  questions: Question[];
  onReset: () => void;
}

interface EvaluationResult {
  accuracy: number;
  feedback: string;
  goodPoints: string[];
  improvementPoints: string[];
  detailedAdvice: string;
}

interface AnswerRecord {
  question: Question;
  userAnswer: string;
  evaluation?: EvaluationResult;
}

export default function QuizMode({ questions, onReset }: QuizModeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSubmit = () => {
    setAnswerRecords((prevRecords) => [
      ...prevRecords,
      { question: currentQuestion, userAnswer },
    ]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const updatedRecords = [
        ...answerRecords,
        { question: currentQuestion, userAnswer },
      ];
      const evaluations = await Promise.all(
        updatedRecords.map(async (record) => {
          const result = await questionApi.evaluateAnswer({
            questionContent: record.question.content,
            exampleAnswer: record.question.exampleAnswer,
            userAnswer: record.userAnswer,
          });
          return { ...record, evaluation: result };
        })
      );
      setAnswerRecords(evaluations);
    } catch (error) {
      console.error("評価中にエラーが発生しました:", error);
    } finally {
      setIsLoading(false);
      setShowSummary(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#36A2EB" size={50} />
      </div>
    );
  }

  if (showSummary) {
    const averageAccuracy =
      answerRecords.reduce(
        (sum, record) => sum + (record.evaluation?.accuracy || 0),
        0
      ) / answerRecords.length;

    const data = {
      labels: ["", ""],
      datasets: [
        {
          data: [averageAccuracy, 100 - averageAccuracy],
          backgroundColor: ["#36A2EB", "#E0E0E0"],
          hoverBackgroundColor: ["#36A2EB", "#E0E0E0"],
          borderWidth: 0,
        },
      ],
    };

    const options = {
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
      },
      cutout: "80%",
      responsive: true,
      maintainAspectRatio: false,
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">総評</h2>
        <div className="flex justify-center mb-4">
          <div
            style={{ position: "relative", width: "200px", height: "200px" }}
          >
            <Pie data={data} options={options} />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#36A2EB",
                textAlign: "center",
              }}
            >
              正確性
              <br />
              {averageAccuracy.toFixed(0)}%
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {answerRecords.map((record, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2">
                問題 {index + 1}: {record.question.content}
              </h3>
              <p className="font-bold pb-2">あなたの回答：</p>
              <p className="text-gray-700 mb-5">{record.userAnswer}</p>
              <p className="font-bold pb-2">解答例：</p>
              <p className="text-gray-700 mb-5">
                {record.question.exampleAnswer}
              </p>
              {record.evaluation && (
                <>
                  <p className="font-bold pb-2">正確性スコア：</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${record.evaluation.accuracy}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-gray-600">
                    {record.evaluation.accuracy}%
                  </p>
                  <p className="font-bold pb-2">フィードバック：</p>
                  <p className="text-gray-700 mb-5">
                    {record.evaluation.feedback}
                  </p>
                  <p className="font-bold pb-2">良かった点：</p>
                  <ul className="list-disc list-inside text-gray-700 mb-5">
                    {record.evaluation.goodPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                  <p className="font-bold pb-2">改善点：</p>
                  <ul className="list-disc list-inside text-gray-700 mb-5">
                    {record.evaluation.improvementPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                  <p className="font-bold pb-2">詳細なアドバイス：</p>
                  <p className="text-gray-700 mb-5">
                    {record.evaluation.detailedAdvice}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={onReset}
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          カテゴリ選択に戻る
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold mb-4">
          選択されたカテゴリの問題が見つかりません
        </h2>
        <button onClick={onReset} className="text-blue-500 hover:text-blue-600">
          カテゴリ選択に戻る
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          問題 {currentQuestionIndex + 1} / {questions.length}
        </h2>
        <button onClick={onReset} className="text-blue-500 hover:text-blue-600">
          カテゴリ選択に戻る
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="prose max-w-none mb-6">
          <MarkdownContent content={currentQuestion.content} />
        </div>

        <div className="mb-6">
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            回答を入力してください：
          </label>
          <textarea
            id="answer"
            rows={6}
            className="w-full p-3 border rounded-md"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="ここに回答を入力してください..."
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleAnswerSubmit}
            disabled={!userAnswer.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex < questions.length - 1
              ? "次の問題へ"
              : "終了して総評を見る"}
          </button>
        </div>
      </div>
    </div>
  );
}
