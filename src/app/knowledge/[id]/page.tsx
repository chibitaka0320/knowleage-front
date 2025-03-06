import Link from "next/link";

// 仮のデータ
const knowledge = {
  id: 1,
  title: "Spring Bootの基本的な使い方",
  category: "バックエンド",
  content: `
# Spring Bootの基本的な使い方

## 1. プロジェクトの作成
Spring Initializrを使用して新しいプロジェクトを作成します。

## 2. 依存関係の追加
必要な依存関係をpom.xmlに追加します。

## 3. アプリケーションの実行
mainメソッドを実行してアプリケーションを起動します。
  `,
  createdAt: "2024-03-04",
};

export default function KnowledgeDetail({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{knowledge.title}</h1>
        <div className="flex space-x-4">
          <Link
            href={`/knowledge/${params.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            編集
          </Link>
          <Link
            href="/knowledge"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            戻る
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {knowledge.category}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              作成日: {knowledge.createdAt}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="prose max-w-none">{knowledge.content}</div>
        </div>
      </div>
    </div>
  );
}
