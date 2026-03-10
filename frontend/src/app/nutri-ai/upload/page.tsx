import UploadDropzone from '@/components/nutri-ai/UploadDropzone';

export default function NutriUploadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-2 font-display text-2xl font-bold">Upload a label photo</h1>
      <p className="mb-8 text-text-secondary">
        Use a clear shot of the nutrition facts panel. Fuel Scan extracts the numbers, then prepares them for scoring.
      </p>
      <UploadDropzone />
    </div>
  );
}
