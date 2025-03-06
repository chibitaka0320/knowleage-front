import Link from "next/link";

export default function NewKnowledge() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">新規ナレッジ作成</h1>
        <Link
          href="/knowledge"
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          戻る
        </Link>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                タイトル
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                カテゴリー
              </label>
              <div className="mt-1">
                <select
                  id="category"
                  name="category"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option>バックエンド</option>
                  <option>フロントエンド</option>
                  <option>インフラ</option>
                  <option>その他</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                内容
              </label>
              <div className="mt-1">
                <textarea
                  id="content"
                  name="content"
                  rows={10}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
