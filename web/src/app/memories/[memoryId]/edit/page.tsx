import { EditMemoryForm } from "@/components/EditMemoryForm";
import { api } from "@/lib/api";
import { ChevronLeft } from "lucide-react";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import Link from "next/link";

interface Memory {
  id: string;
  coverUrl: string;
  content: string;
  createdAt: string;
  isPublic: boolean;
}

interface MemoryProps {
  memoryId: string;
}

export default async function EditMemory({ params }: { params: MemoryProps }) {
  revalidatePath(`/memories/${params.memoryId}/edit`);
  const token = cookies().get("token")?.value;

  const response = await api.get(`/memories/${params.memoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const memory: Memory = response.data;

  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar à timeline
      </Link>
      <EditMemoryForm memoryData={memory} />
    </div>
  );
}
