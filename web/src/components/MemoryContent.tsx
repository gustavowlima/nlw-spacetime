"use client";

import Image from "next/image";
import { MemoryNotFound } from "./MemoryNotFound";
import { useState } from "react";

type Memory = {
  id: string;
  coverUrl: string;
  createdAt: string;
  content: string;
};

export function MemoryContent({ memoryData }: { memoryData: Memory }) {
  const [imageLoading, setImageLoading] = useState(false);
  return (
    <div className="relative flex flex-1 flex-col gap-2">
      <div
        className={`${
          !imageLoading && "hidden"
        } absolute z-50 aspect-video w-full animate-pulse rounded-lg bg-gray-600`}
      />
      <Image
        src={memoryData?.coverUrl}
        width={592}
        height={280}
        alt=""
        className="relative aspect-video w-full rounded-lg object-cover"
        onLoad={() => setImageLoading(true)}
        onLoadingComplete={() => setImageLoading(false)}
      />

      <p className="w-full flex-1 rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400">
        {memoryData.content}
      </p>
    </div>
  );
}
