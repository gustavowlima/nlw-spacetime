import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request) => {
    if (request.method === "GET" && request.routerPath === "/memories/:id") {
      return;
    }
    await request.jwtVerify();
  });

  app.get("/memories", async (request) => {
    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat("..."),
        createdAt: memory.createdAt,
      };
    });
  });

  app.get("/memories/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });
    if (!paramsSchema.safeParse(request.params).success) {
      return reply.status(400).send("Id not found");
    }
    const { id } = paramsSchema.parse(request.params);

    try {
      await request.jwtVerify();
      const memory = await prisma.memory.findUniqueOrThrow({
        where: {
          id,
        },
      });
      if (!memory) {
        return reply.status(404).send("Memory not found");
      }

      if (memory.userId !== request.user.sub) {
        return reply.status(401).send("Memória não encontrada");
      }
      return memory;
    } catch {
      const memory = await prisma.memory.findUnique({
        where: {
          id,
        },
      });
      if (!memory) {
        return reply.status(404).send("Memory not found");
      }

      if (!memory.isPublic) {
        return reply.status(401).send("Você não tem acesso a essa memória!");
      }
      return memory;
    }
  });

  app.post("/memories", async (request, reply) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    });

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: request.user.sub,
      },
    });

    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    return memory;
  });

  app.put("/memories/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    });

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    });
    return memory;
  });

  app.delete("/memories/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    await prisma.memory.delete({
      where: {
        id,
      },
    });
  });
}
