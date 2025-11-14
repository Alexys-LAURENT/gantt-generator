import { Task } from "@/app/page";
import { generatePastelColorFromText } from "@/lib/colors";
import { formatDateToFrench } from "@/lib/dateUtils";

type TaskGroupProps = {
  groupName: string;
  tasks: Task[];
  isTaskSelected: (key: number) => boolean;
  onTaskHover: (key: number | null) => void;
  onTaskClick: (key: number) => void;
  getTaskPosition: (task: Task) => { left: string; width: string };
  dependencyMode: "hidden" | "hover" | "click" | "all";
};

export default function TaskGroup({
  groupName,
  tasks,
  isTaskSelected,
  onTaskHover,
  onTaskClick,
  getTaskPosition,
  dependencyMode,
}: TaskGroupProps) {
  return (
    <div
      className="mb-4 rounded-lg p-4"
      style={{ backgroundColor: generatePastelColorFromText(groupName) }}
    >
      <div className="font-bold text-gray-800 mb-2">{groupName}</div>
      {tasks.map((task, index) => (
        <div
          key={`${groupName}-${index}`}
          className="flex items-center mb-3"
        >
          {/* Colonne des noms de tâches */}
          <div className="w-48 shrink-0 pr-4">
            <div className="text-sm text-gray-700" title={task.name}>
              <div className="font-medium truncate">{task.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {formatDateToFrench(task.start_date)} -{" "}
                {formatDateToFrench(task.end_date)}
              </div>
            </div>
          </div>

          {/* Barre de la tâche */}
          <div 
          style={{ zIndex: 2 }}
          className="flex-1 relative h-10">
            <div
              data-task-key={task.key}
              className={`absolute text-white text-xs px-2 py-2 rounded shadow-md truncate cursor-pointer transition-colors ${
                isTaskSelected(task.key)
                  ? "bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-400"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
              style={getTaskPosition(task)}
              title={`${task.name}: ${formatDateToFrench(task.start_date)} - ${formatDateToFrench(task.end_date)}`}
              onMouseEnter={() =>
                dependencyMode === "hover" && onTaskHover(task.key)
              }
              onMouseLeave={() =>
                dependencyMode === "hover" && onTaskHover(null)
              }
              onClick={() => onTaskClick(task.key)}
            >
              {task.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
