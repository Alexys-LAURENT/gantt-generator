import { Task } from "@/app/page";

/**
 * Valide que toutes les dépendances d'une tâche existent et sont logiques
 * Une tâche ne peut pas dépendre d'une tâche qui se termine après son début
 * @returns null si valide, un message d'erreur sinon
 */
export function validateTaskDependencies(tasks: Task[]): string | null {
  const taskMap = new Map<number, Task>();
  tasks.forEach((task) => {
    taskMap.set(task.key, task);
  });

  for (const task of tasks) {
    if (task.depends && task.depends.length > 0) {
      for (const dependencyKey of task.depends) {
        const dependencyTask = taskMap.get(dependencyKey);

        // Vérifier que la tâche dépendante existe
        if (!dependencyTask) {
          return `Erreur dans la tâche "${task.name}" (clé ${task.key}): dépend de la tâche avec la clé ${dependencyKey} qui n'existe pas.`;
        }

        // Vérifier que la logique temporelle est respectée
        const taskStartDate = new Date(task.start_date);
        const dependencyEndDate = new Date(dependencyTask.end_date);

        if (taskStartDate < dependencyEndDate) {
          return `Erreur dans la tâche "${task.name}" (clé ${task.key}): elle commence le ${task.start_date} mais dépend de "${dependencyTask.name}" (clé ${dependencyKey}) qui se termine le ${dependencyTask.end_date}. Une tâche ne peut pas dépendre d'une tâche qui se termine après son début.`;
        }
      }
    }
  }

  return null;
}

/**
 * Groupe les tâches par groupe
 */
export function groupTasksByGroup(tasks: Task[]): Record<string, Task[]> {
  const grouped: Record<string, Task[]> = {};

  tasks.forEach((task) => {
    const groupName = task.group || "Sans groupe";
    if (!grouped[groupName]) {
      grouped[groupName] = [];
    }
    grouped[groupName].push(task);
  });

  return grouped;
}

/**
 * Calcule la plage de dates pour tous les mois nécessaires
 */
export function calculateDateRange(tasks: Task[]): {
  minDate: Date;
  maxDate: Date;
  months: Date[];
} {
  const dates = tasks.flatMap((t) => [
    new Date(t.start_date),
    new Date(t.end_date),
  ]);
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  // Normaliser au début et à la fin du mois
  minDate.setDate(1);
  maxDate.setMonth(maxDate.getMonth() + 1);
  maxDate.setDate(0);

  // Générer tous les mois dans la plage
  const months: Date[] = [];
  const current = new Date(minDate);
  while (current <= maxDate) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  return { minDate, maxDate, months };
}

/**
 * Calcule la position d'une tâche sur le diagramme de Gantt
 */
export function calculateTaskPosition(
  task: Task,
  minDate: Date,
  maxDate: Date
): { left: string; width: string } {
  const taskStart = new Date(task.start_date);
  const taskEnd = new Date(task.end_date);

  const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
  const startDays = (taskStart.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
  const durationDays = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24);

  const left = (startDays / totalDays) * 100;
  const width = (durationDays / totalDays) * 100;

  return { left: `${left}%`, width: `${width}%` };
}
