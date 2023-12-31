"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { MONTHS } from "~/db.utils";

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [creating, setCreating] = useState(false);
  const [task, setTask] = useState("");

  const { data: tasks, refetch } = api.tasks.getAll.useQuery();
  const { data: tasksUndone, refetch: refetchUndone } =
    api.tasks.getYesterdayUndone.useQuery();
  const { data: stats, refetch: refetchStats } =
    api.tasks.weeklyStats.useQuery();
  const { mutateAsync: create } = api.tasks.create.useMutation({
    onSuccess: () => {
      void refetch();
      void refetchStats();
      setCreating(false);
      setTask("");
    },
  });
  const { mutateAsync: markDone } = api.tasks.markAsDone.useMutation({
    onSuccess: () => {
      void refetch();
      void refetchUndone();
      void refetchStats();
    },
  });

  useEffect(() => {
    if (creating) document.getElementById("CreateTaskInput")?.focus();
  }, [creating]);

  return (
    <main className="flex min-h-screen flex-col bg-[#020202] px-48 py-10 text-white">
      <div className="text-5xl text-red-600">Today</div>
      <div className="text-2xl uppercase">
        {MONTHS[new Date().getMonth()]} '
        {new Date().toLocaleDateString(undefined, { year: "2-digit" })}
      </div>
      <div className="flex flex-col pt-24">
        {creating ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void create({ task });
            }}
          >
            <input
              id="CreateTaskInput"
              className="w-full bg-transparent text-3xl outline-none"
              placeholder="Do a task"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onBlur={() => setCreating(false)}
            />
          </form>
        ) : null}
        {tasks
          ?.sort((a, b) => (a.done && b.done ? 0 : a.done ? 1 : -1))
          .map((task) => (
            <button
              key={task.key}
              className={`w-fit text-left text-3xl ${
                task.done
                  ? "line-through decoration-red-600 decoration-[5px]"
                  : ""
              }`}
              onClick={() => markDone({ id: task.key, status: task.done })}
            >
              {task.task}
            </button>
          ))}
      </div>
      {tasksUndone?.length ? (
        <div className="pt-24 text-4xl text-red-600">Yesterday</div>
      ) : null}
      <div className="flex flex-col pt-8">
        {tasksUndone?.map((task) => (
          <button
            key={task.key}
            className={`w-fit text-left text-2xl ${
              task.done
                ? "line-through decoration-red-600 decoration-[5px]"
                : ""
            }`}
            onClick={() => markDone({ id: task.key, status: task.done })}
          >
            {task.task}
          </button>
        ))}
      </div>
      <div
        className={`fixed bottom-0 right-0 top-0 flex w-96 flex-col gap-4 bg-red-600 p-10 transition duration-300 ease-in-out ${
          menu ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-4xl text-white">Productivity</div>
        <div className="text-6xl text-black">{stats?.done}</div>
        <div className="text-xl text-black">
          Average tasks completed
          <br />
          over the last week
        </div>
        <div className="text-6xl text-black">{stats?.streak}</div>
        <div className="text-xl text-black">Day streak</div>
        <div className="text-6xl text-black">{stats?.undone}</div>
        <div className="text-xl text-black">
          Average tasks missed
          <br />
          over the last week
        </div>
      </div>
      <div className="absolute bottom-6 right-6 flex gap-4">
        <button
          className={`rounded-full bg-red-600 p-3 text-black outline-none`}
          onClick={() => setCreating(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
        <button
          className={`rounded-full bg-red-600 px-3.5 py-[1.125rem] outline-none`}
          onClick={() => setMenu(!menu)}
        >
          <div
            className={`h-px w-5 bg-black transition duration-300 ease-in-out ${
              menu ? "translate-y-[3.5px] -rotate-45" : ""
            }`}
          ></div>
          <div className="h-1.5"></div>
          <div
            className={`h-px w-5 bg-black transition duration-300 ease-in-out ${
              menu ? "-translate-y-[3.5px] rotate-45" : ""
            }`}
          ></div>
        </button>
      </div>
    </main>
  );
}
