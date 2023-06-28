"use client";

import { Camera } from "lucide-react";
import { MediaPicker } from "./MediaPicker";
import { FormEvent, useState } from "react";
import Cookie from "js-cookie";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Memory = {
  id: string;
  coverUrl: string;
  createdAt: string;
  content: string;
  isPublic: boolean;
};

export function EditMemoryForm({ memoryData }: { memoryData: Memory }) {
  const [memoryCurrent, setMemoryCurrent] = useState<Memory>(memoryData);
  const [imageEdited, setImageEdited] = useState<boolean>(false);

  const router = useRouter();

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const fileToUpload = formData.get("coverUrl");

    let coverUrl = "";

    if (fileToUpload && imageEdited) {
      const uploadFormData = new FormData();
      uploadFormData.set("file", fileToUpload);

      const uploadResponse = await api.post("/upload", uploadFormData);

      coverUrl = uploadResponse.data.fileUrl;
    }

    const token = Cookie.get("token");

    await api.put(
      `/memories/${memoryCurrent.id}`,
      {
        coverUrl: imageEdited ? coverUrl : memoryCurrent.coverUrl,
        content: formData.get("content"),
        isPublic: formData.get("isPublic"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Memória editada");

    router.prefetch(`/memories/${memoryCurrent.id}`);
    router.push(`/memories/${memoryCurrent.id}`);
  }

  return (
    <form onSubmit={handleCreateMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Anexar mídia
        </label>

        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={memoryCurrent.isPublic}
            value="true"
            onChange={() =>
              setMemoryCurrent((prevValue) => ({
                ...prevValue,
                isPublic: !prevValue.isPublic,
              }))
            }
            className="h-4 w-4 rounded border-gray-400 bg-gray-400 text-purple-500"
          />
          Tornar memória pública
        </label>
      </div>

      <MediaPicker
        value={memoryCurrent.coverUrl}
        imageEdited={setImageEdited}
      />

      <textarea
        name="content"
        value={memoryCurrent.content}
        onChange={(e) =>
          setMemoryCurrent((prevValue) => ({
            ...prevValue,
            content: e.target.value,
          }))
        }
        spellCheck={false}
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
      />

      <button
        type="submit"
        className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        Salvar
      </button>
    </form>
  );
}
