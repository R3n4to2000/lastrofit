import options from "../../../data/exercise-options.json";

export const muscleGroups = options.muscle_groups;
export const equipmentOptions = options.equipment;
export const difficultyOptions = options.difficulty;
export const categoryOptions = options.category;

export function optionLabel(optionsList: { value: string; label: string }[], value: string | null) {
  return optionsList.find((option) => option.value === value)?.label ?? value ?? "Não informado";
}

export function validOption(optionsList: { value: string; label: string }[], value: unknown): string | null {
  return typeof value === "string" && optionsList.some((option) => option.value === value) ? value : null;
}
