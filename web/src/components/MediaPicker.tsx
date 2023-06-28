"use client";

import { ChangeEvent, useState } from "react";

interface MediaPickerProps {
  value?: string;
  imageEdited?: (value: boolean) => void;
}

export function MediaPicker({ value, imageEdited }: MediaPickerProps) {
  const [preview, setPreview] = useState<string | null>(
    value !== undefined ? value : null
  );

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    if (!files) {
      return;
    }

    const previewURL = URL.createObjectURL(files[0]);

    setPreview(previewURL);
    imageEdited === undefined ? null : imageEdited(true);
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        name="coverUrl"
        type="file"
        id="media"
        accept="image/*"
        className="invisible h-0 w-0"
      />

      {preview && (
        <img
          src={preview}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  );
}
