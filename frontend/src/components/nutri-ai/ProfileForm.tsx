'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { buildNutritionProfileFromUser, getSessionNutritionProfile, saveNutritionProfile } from '@/lib/nutri-profile';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

export default function ProfileForm() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('moderate');
  const [diet, setDiet] = useState('omnivore');
  const [goal, setGoal] = useState('maintain');

  const selectClass =
    'w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

  useEffect(() => {
    const storedProfile = buildNutritionProfileFromUser(user) ?? getSessionNutritionProfile();
    if (!storedProfile) return;
    setAge(storedProfile.age.toString());
    setGender(storedProfile.gender);
    setHeight(storedProfile.height_cm.toString());
    setWeight(storedProfile.weight_kg.toString());
    setActivity(storedProfile.activity_level);
    setDiet(storedProfile.diet_type);
    setGoal(storedProfile.goal);
  }, [user]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    const profile = {
      age: parseInt(age, 10) || 25,
      gender,
      height_cm: parseFloat(height) || 170,
      weight_kg: parseFloat(weight) || 70,
      activity_level: activity,
      diet_type: diet,
      goal,
      allergies: [],
      medical_history: { diseases: [] },
    };

    setSaving(true);
    try {
      if (user) {
        await apiFetch('/user/settings', {
          method: 'PUT',
          body: JSON.stringify({
            age: profile.age,
            gender: profile.gender,
            height_cm: profile.height_cm,
            weight_kg: profile.weight_kg,
            activity_level: profile.activity_level,
            diet_type: profile.diet_type,
            goal: profile.goal,
            allergies: profile.allergies,
            medical_conditions: profile.medical_history.diseases,
          }),
        });
        await refreshUser();
      }

      saveNutritionProfile(profile);
      router.push('/nutri-ai/upload');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to save your nutrition profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Age</label>
          <input
            type="number"
            required
            min={1}
            max={120}
            value={age}
            onChange={(event) => setAge(event.target.value)}
            className="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Gender</label>
          <select value={gender} onChange={(event) => setGender(event.target.value)} className={selectClass}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Height (cm)</label>
          <input
            type="number"
            required
            step="0.1"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            className="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Weight (kg)</label>
          <input
            type="number"
            required
            step="0.1"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            className="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Activity Level</label>
          <select value={activity} onChange={(event) => setActivity(event.target.value)} className={selectClass}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="extreme">Extreme</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Diet Pattern</label>
          <select value={diet} onChange={(event) => setDiet(event.target.value)} className={selectClass}>
            <option value="omnivore">Omnivore</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Training Goal</label>
          <select value={goal} onChange={(event) => setGoal(event.target.value)} className={selectClass}>
            <option value="lose_weight">Lose Weight</option>
            <option value="maintain">Maintain</option>
            <option value="gain_muscle">Gain Muscle</option>
          </select>
        </div>
      </div>

      <Button type="submit" size="lg" loading={saving} className="w-full">Save Profile and Continue</Button>
    </form>
  );
}
