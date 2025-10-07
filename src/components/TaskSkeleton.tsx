import React from "react";

export const TaskSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded-lg w-2/3"></div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>

      <div className="h-3 bg-gray-200 rounded w-32"></div>
    </div>
  );
};

export default TaskSkeleton;
