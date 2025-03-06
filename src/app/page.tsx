import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">技術面接対策</h1>
          <p className="text-xl text-gray-600 mb-8">
            技術面接の質問と回答を管理し、効果的な学習をサポートします
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/questions"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              質問一覧を見る
            </Link>
            <Link
              href="/quiz"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              模擬試験を始める
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">主な機能</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>技術面接の質問と回答の管理</li>
              <li>OpenAIを活用した回答評価</li>
              <li>ランダムな問題出題</li>
              <li>マークダウン形式での回答表示</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">使い方</h2>
            <ul className="list-decimal list-inside space-y-2 text-gray-600">
              <li>質問一覧から学習したい項目を選択</li>
              <li>模擬試験モードで実践的な練習</li>
              <li>AIによる回答評価でスキルアップ</li>
              <li>定期的な復習で知識を定着</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
