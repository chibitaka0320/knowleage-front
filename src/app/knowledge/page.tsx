import Link from "next/link";

// 仮のデータ
const knowledgeItems = [
  {
    id: 1,
    title: "Spring Bootの基本的な使い方",
    category: "バックエンド",
    createdAt: "2024-03-04",
  },
  {
    id: 2,
    title: "Next.jsのApp Routerについて",
    category: "フロントエンド",
    createdAt: "2024-03-04",
  },
];

export default function KnowledgeList() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">ナレッジ一覧</h1>
        <Link
          href="/knowledge/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          新規作成
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {knowledgeItems.map((item) => (
            <li key={item.id}>
              <Link
                href={`/knowledge/${item.id}`}
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-blue-600 truncate">
                      {item.title}
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        作成日: {item.createdAt}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
