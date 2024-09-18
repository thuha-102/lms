import { Prisma } from "@prisma/client";
import { fromEvent } from "rxjs";

export class LessonDTO{
    id: number;
    title: string;
    fileId: number;

    static fromEntity(e: Prisma.LessonGetPayload<unknown>): LessonDTO{
        return {
            id: e.id,
            title: e.title,
            fileId: e.learningMaterialId
        }
    }
}