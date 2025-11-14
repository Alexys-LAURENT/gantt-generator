"use client";

import { Task } from "@/app/page";
import { validateTaskDependencies } from "@/lib/taskUtils";
import { toPng } from "html-to-image";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import GanttChart from "./GanttChart";

export default function GanttToolSection() {
  const t = useTranslations("tool");
  const defaultExample = useTranslations("defaultExample");
  
  // Convertir les traductions en JSON
  const defaultJSON = JSON.stringify(
    Array.from({ length: 14 }, (_, i) => defaultExample.raw((i + 1).toString())),
    null,
    2
  );

  const [jsonInput, setJsonInput] = useState(defaultJSON);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const ganttRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        setError("Le JSON doit être un tableau de tâches");
        return;
      }

      // Validation des dépendances
      const validationError = validateTaskDependencies(parsed);
      if (validationError) {
        setError(validationError);
        return;
      }

      setTasks(parsed);
      setError("");
    } catch (e) {
      setError("JSON invalide : " + (e as Error).message);
    }
  };

  const handleExportImage = async () => {
    if (!ganttRef.current) return;

    try {
      const dataUrl = await toPng(ganttRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `gantt-${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erreur lors de l'export:", err);
      alert("Erreur lors de l'export de l'image");
    }
  };

  const handleReset = () => {
    setJsonInput(defaultJSON);
    setTasks([]);
    setError("");
  };

  return (
    <section className="py-20 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Commencez dès maintenant
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Entrez votre configuration JSON et générez votre diagramme de Gantt en un clic
          </p>
        </div>

        {/* Tool Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* JSON Editor */}
          <div className="flex flex-col">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  Configuration JSON
                </h3>
              </div>
              <div className="p-6">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="text-black w-full min-h-[500px] p-4 bg-gray-50 border border-gray-300 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Entrez votre JSON ici..."
                />
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                )}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleGenerate}
                    className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Générer le Gantt
                    </span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div className="flex flex-col">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Format de données
                </h3>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <pre className="text-sm text-gray-800 overflow-x-auto">
                    {`[
  {
    "key": 1,
    "name": "Nom de la tâche",
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD",
    "group": "Nom du groupe",
    "depends": [1, 2]
  }
]`}
                  </pre>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Clé unique (key)
                      </h4>
                      <p className="text-sm text-gray-600">
                        Identifiant numérique unique pour chaque tâche
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Dates (start_date, end_date)
                      </h4>
                      <p className="text-sm text-gray-600">
                        Format ISO 8601 : YYYY-MM-DD
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Groupe (optionnel)
                      </h4>
                      <p className="text-sm text-gray-600">
                        Regroupe visuellement les tâches liées
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <span className="text-pink-600 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Dépendances (optionnel)
                      </h4>
                      <p className="text-sm text-gray-600">
                        Tableau des clés des tâches dont dépend cette tâche
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gantt Display */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-linear-to-r from-purple-600 to-pink-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Votre Diagramme de Gantt
              </h3>
              <button
                onClick={handleExportImage}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Exporter PNG
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <div ref={ganttRef} className="inline-block min-w-full">
                  <GanttChart tasks={tasks} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
