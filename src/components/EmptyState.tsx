// components/EmptyState.tsx
import React from "react";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  hasSearchQuery: boolean;
  onAddClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasSearchQuery,
  onAddClick,
}) => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Plus className="w-10 h-10 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {hasSearchQuery ? "No tasks found" : "No tasks yet"}
      </h3>
      <p className="text-gray-600 mb-6">
        {hasSearchQuery
          ? "Try adjusting your search query"
          : "Get started by creating your first task"}
      </p>
      {!hasSearchQuery && onAddClick && (
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      )}
    </div>
  );
};

export default EmptyState;
