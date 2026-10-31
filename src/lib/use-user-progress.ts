"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export interface ProgressSummary {
  completed: number;
  total: number;
}

export interface UserProgressData {
  completedLessonIds: Set<string>;
  startedLessonIds: Set<string>;
  summary: ProgressSummary | null;
  isLoading: boolean;
}

export function useUserProgress(): UserProgressData {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const userId = session?.user?.id ?? null;

  const [progressState, setProgressState] = useState<{
    loadedUser: string | null;
    completed: Set<string>;
    started: Set<string>;
    summary: ProgressSummary | null;
  }>({
    loadedUser: null,
    completed: new Set(),
    started: new Set(),
    summary: null,
  });

  const isLoadedForUser =
    isAuthenticated && progressState.loadedUser === userId;
  const isLoading = isAuthenticated && !isLoadedForUser;

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      return;
    }

    let isMounted = true;

    fetch("/api/progress")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load progress");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const completed = new Set<string>();
        const started = new Set<string>();
        if (Array.isArray(data.progress)) {
          for (const item of data.progress) {
            if (item.status === "COMPLETED") {
              completed.add(item.lessonId);
            } else if (item.status === "STARTED") {
              started.add(item.lessonId);
            }
          }
        }
        setProgressState({
          loadedUser: userId,
          completed,
          started,
          summary: data.summary ?? null,
        });
      })
      .catch(() => {
        if (isMounted) {
          setProgressState((prev) => ({ ...prev, loadedUser: userId }));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, userId]);

  return {
    completedLessonIds: isLoadedForUser
      ? progressState.completed
      : new Set<string>(),
    startedLessonIds: isLoadedForUser
      ? progressState.started
      : new Set<string>(),
    summary: isLoadedForUser ? progressState.summary : null,
    isLoading,
  };
}
