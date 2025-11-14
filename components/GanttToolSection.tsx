"use client";

import { Task } from "@/app/page";
import { useLocale, useTranslations } from "@/lib/i18n";
import { validateTaskDependencies } from "@/lib/taskUtils";
import { toPng } from "html-to-image";
import { useEffect, useMemo, useRef, useState } from "react";
import GanttChart from "./GanttChart";

export default function GanttToolSection() {
  const t = useTranslations("tool");
  const { messages } = useLocale();
  
  // Fonction pour obtenir le JSON par défaut
  const getDefaultJSON = useMemo(() => {
    const defaultExampleData = (messages as Record<string, unknown>)?.defaultExample;
    if (Array.isArray(defaultExampleData)) {
      return JSON.stringify(defaultExampleData, null, 2);
    }
    return "[]";
  }, [messages]);

  const [jsonInput, setJsonInput] = useState(getDefaultJSON);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const ganttRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu d'export quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportOptions(false);
      }
    };

    if (showExportOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportOptions]);

  const handleGenerate = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        setError(t("errors.invalidArray"));
        return;
      }

      const validationError = validateTaskDependencies(parsed);
      if (validationError) {
        setError(validationError);
        return;
      }

      setTasks(parsed);
      setError("");
    } catch (e) {
      setError(t("errors.invalidJson") + (e as Error).message);
    }
  };

  const handleExportImage = async (scale: 'screen' | 'wide' = 'screen') => {
    if (!ganttRef.current) return;

    try {
      // Masquer temporairement les contrôles qui ne doivent pas être exportés
      const controlsToHide = ganttRef.current.querySelectorAll('.gantt-controls-no-export');
      controlsToHide.forEach((control) => {
        (control as HTMLElement).style.display = 'none';
      });

      if (scale === 'wide') {
        // Pour le format large, on force une largeur plus grande temporairement
        const actualHeight = ganttRef.current.scrollHeight;
        
        // Calculer la largeur cible pour un ratio 2:1
        const targetWidth = actualHeight * 2;
        
        // Sauvegarder les styles originaux
        const originalMinWidth = ganttRef.current.style.minWidth;
        const originalWidth = ganttRef.current.style.width;
        
        // Forcer une largeur minimale plus grande pour que le contenu s'étale
        ganttRef.current.style.minWidth = `${targetWidth}px`;
        ganttRef.current.style.width = `${targetWidth}px`;
        
        // Attendre que le DOM se redessine ET que les positions se recalculent
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const dataUrl = await toPng(ganttRef.current, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
          width: targetWidth,
          height: actualHeight,
        });

        // Restaurer les styles originaux
        ganttRef.current.style.minWidth = originalMinWidth;
        ganttRef.current.style.width = originalWidth;

        // Attendre que le DOM revienne à la normale
        await new Promise(resolve => setTimeout(resolve, 100));

        // Réafficher les contrôles
        controlsToHide.forEach((control) => {
          (control as HTMLElement).style.display = '';
        });

        const link = document.createElement("a");
        link.download = `gantt-wide-${new Date().toISOString().split("T")[0]}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        // Export à la taille de l'écran (taille réelle)
        const dataUrl = await toPng(ganttRef.current, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
        });

        // Réafficher les contrôles
        controlsToHide.forEach((control) => {
          (control as HTMLElement).style.display = '';
        });

        const link = document.createElement("a");
        link.download = `gantt-${new Date().toISOString().split("T")[0]}.png`;
        link.href = dataUrl;
        link.click();
      }

      setShowExportOptions(false);
    } catch (err) {
      // Réafficher les contrôles en cas d'erreur aussi
      const controlsToHide = ganttRef.current?.querySelectorAll('.gantt-controls-no-export');
      controlsToHide?.forEach((control) => {
        (control as HTMLElement).style.display = '';
      });
      
      console.error("Erreur lors de l'export:", err);
      alert(t("errors.exportError"));
    }
  };

  const handleReset = () => {
    setJsonInput(getDefaultJSON);
    setTasks([]);
    setError("");
  };

  return (
    <section className="py-20 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  {t("jsonEditor.title")}
                </h3>
              </div>
              <div className="p-6">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="text-black w-full min-h-[500px] p-4 bg-gray-50 border border-gray-300 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={t("jsonEditor.placeholder")}
                />
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                )}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleGenerate}
                    className="cursor-pointer flex-1 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {t("jsonEditor.generateButton")}
                    </span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="cursor-pointer px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t("documentation.title")}
                </h3>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <pre className="text-sm text-gray-800 overflow-x-auto">
                    {`[
  {
    "key": 1,
    "name": "Task name",
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD",
    "group": "Group name",
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
                        {t("documentation.steps.key.title")}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t("documentation.steps.key.description")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {t("documentation.steps.dates.title")}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t("documentation.steps.dates.description")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {t("documentation.steps.group.title")}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t("documentation.steps.group.description")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <span className="text-pink-600 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {t("documentation.steps.depends.title")}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t("documentation.steps.depends.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-linear-to-r from-purple-600 to-pink-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {t("ganttDisplay.title")}
              </h3>
              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setShowExportOptions(!showExportOptions)}
                  className="cursor-pointer bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t("ganttDisplay.exportButton")}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showExportOptions && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-10">
                    <div className="p-2">
                      <button
                        onClick={() => handleExportImage('screen')}
                        className="cursor-pointer w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex items-start gap-3"
                      >
                        <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <div className="font-semibold text-gray-900">Taille écran</div>
                          <div className="text-sm text-gray-600">Export à la taille actuelle</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleExportImage('wide')}
                        className="cursor-pointer w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex items-start gap-3"
                      >
                        <svg className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        <div>
                          <div className="font-semibold text-gray-900">Format large (2:1)</div>
                          <div className="text-sm text-gray-600">Export optimisé en largeur</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
