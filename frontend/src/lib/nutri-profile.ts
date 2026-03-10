import type { User } from './types';

export interface NutritionProfile {
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  diet_type: string;
  goal: string;
  allergies: string[];
  medical_history: {
    diseases: string[];
  };
}

const STORAGE_KEY = 'fitlife_nutri_profile';
const LEGACY_SESSION_KEY = 'nutri_profile';

const defaultProfile: NutritionProfile = {
  age: 25,
  gender: 'male',
  height_cm: 170,
  weight_kg: 70,
  activity_level: 'moderate',
  diet_type: 'omnivore',
  goal: 'maintain',
  allergies: [],
  medical_history: { diseases: [] },
};

function parseStoredProfile(raw: string | null): NutritionProfile | null {
  if (!raw) return null;
  try {
    return { ...defaultProfile, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

function isCompleteProfile(profile: Partial<NutritionProfile> | null | undefined) {
  return Boolean(
    profile &&
      profile.age !== null &&
      profile.age !== undefined &&
      profile.gender &&
      profile.height_cm !== null &&
      profile.height_cm !== undefined &&
      profile.weight_kg !== null &&
      profile.weight_kg !== undefined &&
      profile.activity_level &&
      profile.diet_type &&
      profile.goal,
  );
}

export function saveNutritionProfile(profile: NutritionProfile) {
  if (typeof window === 'undefined') return null;
  const serialized = JSON.stringify(profile);
  localStorage.setItem(STORAGE_KEY, serialized);
  sessionStorage.setItem(STORAGE_KEY, serialized);
  sessionStorage.setItem(LEGACY_SESSION_KEY, serialized);
}

export function getStoredNutritionProfile(): NutritionProfile | null {
  if (typeof window === 'undefined') return null;

  const persistent = parseStoredProfile(localStorage.getItem(STORAGE_KEY));
  if (persistent) return persistent;

  const tabProfile =
    parseStoredProfile(sessionStorage.getItem(STORAGE_KEY)) ??
    parseStoredProfile(sessionStorage.getItem(LEGACY_SESSION_KEY));

  if (tabProfile) {
    saveNutritionProfile(tabProfile);
    return tabProfile;
  }

  return null;
}

function hasCompleteUserProfile(user: User | null | undefined) {
  return Boolean(
    user &&
      user.age !== null &&
      user.gender &&
      user.height_cm !== null &&
      user.weight_kg !== null &&
      user.activity_level &&
      user.diet_type &&
      user.goal,
  );
}

export function hasSavedNutritionProfile(
  user: User | null | undefined,
  storedProfile: NutritionProfile | null = getStoredNutritionProfile(),
) {
  return hasCompleteUserProfile(user) || isCompleteProfile(storedProfile);
}

export function buildNutritionProfileFromUser(user: User | null | undefined): NutritionProfile | null {
  if (!hasCompleteUserProfile(user) || !user) return null;
  return {
    age: user.age ?? defaultProfile.age,
    gender: user.gender ?? defaultProfile.gender,
    height_cm: user.height_cm ?? defaultProfile.height_cm,
    weight_kg: user.weight_kg ?? defaultProfile.weight_kg,
    activity_level: user.activity_level ?? defaultProfile.activity_level,
    diet_type: user.diet_type ?? defaultProfile.diet_type,
    goal: user.goal ?? defaultProfile.goal,
    allergies: user.allergies ?? [],
    medical_history: { diseases: user.medical_conditions ?? [] },
  };
}

export function getPreferredNutritionProfile(user: User | null | undefined): NutritionProfile {
  return buildNutritionProfileFromUser(user) ?? getStoredNutritionProfile() ?? defaultProfile;
}
