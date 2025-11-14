"use client";

import { Task } from "@/app/page";
import { generateArrowColorFromKeys } from "@/lib/colors";
import { FRENCH_MONTH_NAMES } from "@/lib/dateUtils";
import {
  calculateDateRange,
  calculateTaskPosition,
  groupTasksByGroup,
} from "@/lib/taskUtils";
import { useEffect, useRef, useState } from "react";
import DependencyModeControls from "./DependencyModeControls";
import TaskGroup from "./TaskGroup";
import TimelineHeader from "./TimelineHeader";

type GanttChartProps = {
  tasks: Task[];
};

type TaskPosition = {
  key: number;
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};

type DependencyMode = "hidden" | "hover" | "click" | "all";

export default function GanttChart({ tasks }: GanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ganttContentRef = useRef<HTMLDivElement>(null);
  const [taskPositions, setTaskPositions] = useState<Map<number, TaskPosition>>(
    new Map()
  );
  const [hoveredTask, setHoveredTask] = useState<number | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [dependencyMode, setDependencyMode] = useState<DependencyMode>("hover");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Erreur fullscreen:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Écouter les changements de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Calculer les positions des tâches pour les flèches
  useEffect(() => {
    const updatePositions = () => {
      if (!ganttContentRef.current) return;

      const positions = new Map<number, TaskPosition>();
      const taskElements = ganttContentRef.current.querySelectorAll(
        "[data-task-key]"
      );

      taskElements.forEach((element) => {
        const key = parseInt(element.getAttribute("data-task-key") || "0");
        const rect = element.getBoundingClientRect();
        const containerRect = ganttContentRef.current!.getBoundingClientRect();

        positions.set(key, {
          key,
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
          width: rect.width,
          height: rect.height,
          centerX: rect.left - containerRect.left + rect.width / 2,
          centerY: rect.top - containerRect.top + rect.height / 2,
        });
      });

      setTaskPositions(positions);
    };

    // Petit délai pour s'assurer que le DOM est bien rendu
    const timeoutId = setTimeout(updatePositions, 100);

    // Observer les changements de taille pour recalculer les positions
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updatePositions();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [tasks, dependencyMode, selectedTasks]);

  if (!tasks.length) return null;

  // Calculs de la timeline
  const { minDate, maxDate, months } = calculateDateRange(tasks);
  const groupedTasks = groupTasksByGroup(tasks);

  // Générer les années
  const years: Array<{ year: number; monthCount: number }> = [];
  let currentYear = minDate.getFullYear();
  let yearMonthCount = 0;

  months.forEach((month) => {
    if (month.getFullYear() !== currentYear) {
      years.push({ year: currentYear, monthCount: yearMonthCount });
      currentYear = month.getFullYear();
      yearMonthCount = 1;
    } else {
      yearMonthCount++;
    }
  });
  years.push({ year: currentYear, monthCount: yearMonthCount });

  // Générer les trimestres
  const quarters: Array<{
    year: number;
    quarter: number;
    monthCount: number;
  }> = [];
  months.forEach((month) => {
    const year = month.getFullYear();
    const quarter = Math.floor(month.getMonth() / 3) + 1;

    const lastQuarter = quarters[quarters.length - 1];
    if (
      lastQuarter &&
      lastQuarter.year === year &&
      lastQuarter.quarter === quarter
    ) {
      lastQuarter.monthCount++;
    } else {
      quarters.push({ year, quarter, monthCount: 1 });
    }
  });

  // Déterminer si une flèche doit être affichée
  const shouldShowArrow = (task: Task): boolean => {
    switch (dependencyMode) {
      case "hidden":
        return false;
      case "all":
        return true;
      case "hover":
        return (
          hoveredTask === null ||
          hoveredTask === task.key ||
          task.depends?.includes(hoveredTask) ||
          false
        );
      case "click":
        return (
          selectedTasks.size === 0 ||
          selectedTasks.has(task.key) ||
          (task.depends?.some((dep) => selectedTasks.has(dep)) ?? false)
        );
    }
  };

  // Déterminer si une flèche est mise en surbrillance
  const isArrowHighlighted = (task: Task): boolean => {
    if (dependencyMode === "all" || dependencyMode === "hover") {
      return (
        hoveredTask === task.key ||
        (task.depends?.includes(hoveredTask || -1) ?? false)
      );
    }
    if (dependencyMode === "click") {
      return (
        selectedTasks.has(task.key) ||
        (task.depends?.some((dep) => selectedTasks.has(dep)) ?? false)
      );
    }
    return false;
  };

  // Calculer l'opacité d'une flèche
  const calculateArrowOpacity = (
    isHighlighted: boolean,
    mode: DependencyMode
  ): number => {
    if (mode === "all") {
      return isHighlighted ? 1 : 0.3;
    } else if (mode === "hover") {
      return hoveredTask === null ? 0.6 : isHighlighted ? 1 : 0.2;
    } else if (mode === "click") {
      return selectedTasks.size === 0 ? 0.6 : isHighlighted ? 1 : 0.2;
    }
    return 0.6;
  };

  // Créer les flèches de dépendances
  const renderDependencyArrows = () => {
    const arrows: React.ReactElement[] = [];

    if (dependencyMode === "hidden") return arrows;

    tasks.forEach((task) => {
      if (!task.depends || task.depends.length === 0) return;

      const targetPos = taskPositions.get(task.key);
      if (!targetPos) return;

      task.depends.forEach((dependencyKey) => {
        if (!shouldShowArrow(task)) return;

        const sourcePos = taskPositions.get(dependencyKey);
        if (!sourcePos) return;

        // Points de départ et d'arrivée
        const startX = sourcePos.x + sourcePos.width;
        const startY = sourcePos.centerY;
        const endX = targetPos.x;
        const endY = targetPos.centerY;

        // Créer une courbe de Bézier
        const controlPointX = (startX + endX) / 2;

        const arrowColor = generateArrowColorFromKeys(dependencyKey, task.key);
        const isHighlighted = isArrowHighlighted(task);
        const opacity = calculateArrowOpacity(isHighlighted, dependencyMode);

        arrows.push(
          <g key={`arrow-${dependencyKey}-${task.key}`}>
            <path
              d={`M ${startX} ${startY} C ${controlPointX} ${startY}, ${controlPointX} ${endY}, ${endX} ${endY}`}
              stroke={arrowColor}
              strokeWidth={isHighlighted ? "3" : "2"}
              fill="none"
              opacity={opacity}
              markerEnd={`url(#arrowhead-${dependencyKey}-${task.key})`}
              style={{ transition: "all 0.2s ease" }}
            />
          </g>
        );
      });
    });

    return arrows;
  };

  // Générer les markers de flèche
  const renderArrowMarkers = () => {
    const markers: React.ReactElement[] = [];

    tasks.forEach((task) => {
      if (!task.depends || task.depends.length === 0) return;

      task.depends.forEach((dependencyKey) => {
        const arrowColor = generateArrowColorFromKeys(dependencyKey, task.key);

        markers.push(
          <marker
            key={`marker-${dependencyKey}-${task.key}`}
            id={`arrowhead-${dependencyKey}-${task.key}`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill={arrowColor} />
          </marker>
        );
      });
    });

    return markers;
  };

  // Gestionnaires d'événements
  const handleModeChange = (mode: DependencyMode) => {
    setDependencyMode(mode);
    setSelectedTasks(new Set());
  };

  const handleTaskClick = (taskKey: number) => {
    if (dependencyMode === "click") {
      const newSelected = new Set(selectedTasks);
      if (newSelected.has(taskKey)) {
        newSelected.delete(taskKey);
      } else {
        newSelected.add(taskKey);
      }
      setSelectedTasks(newSelected);
    }
  };

  const getTaskPositionStyle = (task: Task) => {
    return calculateTaskPosition(task, minDate, maxDate);
  };

  return (
    <div className={`w-full ${isFullscreen ? 'bg-white p-8 h-screen overflow-auto' : ''}`} ref={containerRef}>
      {/* Contrôles des modes de dépendances */}
      <div className="gantt-controls-no-export">
        <div className="flex justify-between items-center mb-4">
          <DependencyModeControls
            currentMode={dependencyMode}
            selectedTasksCount={selectedTasks.size}
            onModeChange={handleModeChange}
          />
          <button
            onClick={toggleFullscreen}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
            title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          >
            {isFullscreen ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Quitter
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Plein écran
              </>
            )}
          </button>
        </div>
      </div>

      <div className="min-w-[1200px] relative" ref={ganttContentRef}>
        {/* SVG pour les flèches de dépendances */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <defs>{renderArrowMarkers()}</defs>
          {renderDependencyArrows()}
        </svg>

        {/* En-tête de la timeline */}
        <TimelineHeader
          years={years}
          quarters={quarters}
          months={months}
          monthNames={FRENCH_MONTH_NAMES}
          totalMonths={months.length}
        />

        {/* Tâches groupées */}
        <div className="relative">
          {/* Lignes verticales pour chaque mois */}
          <div className="absolute inset-0 flex pointer-events-none" style={{ zIndex: 0 }}>
            <div className="w-48 shrink-0"></div>
            <div className="flex-1 flex">
              {months.map((month, index) => (
                <div
                  key={`month-line-${index}`}
                  className="border-r border-gray-200"
                  style={{ width: `${100 / months.length}%` }}
                />
              ))}
            </div>
          </div>

          {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
            <TaskGroup
              key={groupName}
              groupName={groupName}
              tasks={groupTasks}
              isTaskSelected={(key) => selectedTasks.has(key)}
              onTaskHover={setHoveredTask}
              onTaskClick={handleTaskClick}
              getTaskPosition={getTaskPositionStyle}
              dependencyMode={dependencyMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
