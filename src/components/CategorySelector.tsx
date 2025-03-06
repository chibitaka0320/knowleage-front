import { Category } from "@/types/question";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategories: Category[];
  onCategoryChange: (categories: Category[]) => void;
}

export default function CategorySelector({
  categories,
  selectedCategories,
  onCategoryChange,
}: CategorySelectorProps) {
  const toggleCategory = (category: Category) => {
    const isSelected = selectedCategories.some((c) => c.id === category.id);
    if (isSelected) {
      onCategoryChange(selectedCategories.filter((c) => c.id !== category.id));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">カテゴリを選択</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.some(
            (c) => c.id === category.id
          );
          return (
            <button
              key={category.id}
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
      {selectedCategories.length === 0 && (
        <p className="text-sm text-gray-500">
          ※ カテゴリを選択しない場合、すべての問題から出題されます
        </p>
      )}
    </div>
  );
}
