import ProfileForm from '@/components/nutri-ai/ProfileForm';

export default function NutriProfilePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-2 font-display text-2xl font-bold">Set your nutrition baseline</h1>
      <p className="mb-8 text-text-secondary">
        A few profile details make the label score more relevant to your body, routine, and training goal.
      </p>
      <ProfileForm />
    </div>
  );
}
