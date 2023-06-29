import { MemoryContent } from "@/components/MemoryContent";
import { MemoryNotFound } from "@/components/MemoryNotFound";
import { Edit, ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import jwtDecode from "jwt-decode";
import { api } from "@/lib/api";
import { ErrorComponent } from "@/components/ErrorComponent";
import { AxiosError } from "axios";

interface Memory {
  id: string;
  coverUrl: string;
  content: string;
  createdAt: string;
  isPublic: boolean;
  userId: string;
}

interface MemoryProps {
  memoryId: string;
}

async function getMemory(id: string) {
  const token = cookies().get("token")?.value;
  const response = await api.get(`http://192.168.0.10:3333/memories/${id}`, {
    headers: {
      Authorization: `Bearer ${token} `,
    },
  });

  return response.data;
}

export default async function Memory({ params }: { params: MemoryProps }) {
  try {
    const memory: Memory = await getMemory(params.memoryId);

    return (
      <div className="flex flex-1 flex-col gap-6 p-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar à timeline
          </Link>

          <Link
            href={`/memories/${params.memoryId}/edit`}
            prefetch
            className="flex items-center rounded-full bg-green-500 p-2 text-sm text-white hover:bg-green-600"
          >
            <Edit className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-10">
          <MemoryContent memoryData={memory} />
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      return <ErrorComponent errorMessage={error.response?.data} />;
    }
    <ErrorComponent />;
  }
}
