import { z } from "zod";
import {
  calculateStreak,
  createWeekQuery,
  getDate,
  getYesterday,
} from "~/db.utils";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return (await ctx.db.fetch({ date: getDate() })).items;
  }),

  getYesterdayUndone: publicProcedure.query(async ({ ctx }) => {
    return (await ctx.db.fetch({ date: getYesterday(), done: false })).items;
  }),

  create: publicProcedure
    .input(z.object({ task: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.put({
        task: input.task,
        recurring: false,
        done: false,
        date: getDate(),
      });
    }),

  markAsDone: publicProcedure
    .input(z.object({ id: z.string(), status: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.update({ done: !input.status }, input.id);
    }),

  weeklyStats: publicProcedure.query(async ({ ctx }) => {
    const tasks = await ctx.db.fetch(createWeekQuery());
    const allTasks = (await ctx.db.fetch()).items;
    const doneTasks = tasks.items.filter((task) => task.done).length;

    const avgDone = (doneTasks / tasks.count) * 10;
    const avgDoneRounded = Math.round((avgDone + Number.EPSILON) * 100) / 100;

    const avgUndone = ((tasks.count - doneTasks) / tasks.count) * 10;
    const avgUndoneRounded =
      Math.round((avgUndone + Number.EPSILON) * 100) / 100;

    const acc: Record<string, boolean[]> = {};

    allTasks.forEach((task) => {
      if (!acc[task.date!]) acc[task.date!] = [];

      acc[task.date!]?.push(task.done);
    });

    const lastIndex = Object.keys(acc).findIndex(
      (value) => acc[value]?.indexOf(true) === -1,
    );

    const streak =
      lastIndex === -1
        ? Object.keys(acc).length
        : calculateStreak(Object.keys(acc)[lastIndex]!);

    return { done: avgDoneRounded, undone: avgUndoneRounded, streak: streak };
  }),
});
