"use client";

import { useTranslations } from "@/lib/i18n";

type DependencyModeControlsProps = {
  currentMode: "hidden" | "hover" | "click" | "all";
  selectedTasksCount: number;
  onModeChange: (mode: "hidden" | "hover" | "click" | "all") => void;
};

export default function DependencyModeControls({
  currentMode,
  selectedTasksCount,
  onModeChange,
}: DependencyModeControlsProps) {
  const t = useTranslations("dependencyModes");

  const modes = [
    {
      id: "hidden" as const,
      icon: "🚫",
      label: t("hidden.title"),
      description: t("hidden.description"),
    },
    {
      id: "hover" as const,
      icon: "👆",
      label: t("hover.title"),
      description: t("hover.description"),
    },
    {
      id: "click" as const,
      icon: "🖱️",
      label: t("click.title"),
      description: t("click.description"),
    },
    {
      id: "all" as const,
      icon: "👁️",
      label: t("all.title"),
      description: t("all.description"),
    },
  ];

  const currentModeDescription =
    modes.find((m) => m.id === currentMode)?.description || "";

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-3">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors ${
              currentMode === mode.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {mode.icon} {mode.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600">{currentModeDescription}</p>
    </div>
  );
}
