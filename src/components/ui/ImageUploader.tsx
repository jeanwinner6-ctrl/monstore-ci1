import React, { useState } from 'react';

export function ImageUploader({ onFileSelected }: { onFileSelected: (file: File | null) => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileSelected(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>
      <input type="file" accept="image/*" onChange={handleChange} />
      {preview && (
        <div className="mt-2">
          <img src={preview} alt="preview" className="h-32 object-contain border rounded" />
        </div>
      )}
    </div>
  );
}