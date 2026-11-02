import type { Metadata } from "next";
import { getAllLessons } from "@/lib/lessons";
import { RoadmapClient } from "./RoadmapClient";

export const metadata: Metadata = {
  title: "Roadmap | CodeCraft Web Development Track",
  description:
    "Master HTML5 & CSS3 step-by-step with interactive coding challenges, live rendered workspaces, and automated verification.",
};

export default function LessonsPage() {
  const lessons = getAllLessons();

  return (
    <main className="w-full bg-surface min-h-[calc(100vh-64px)]">
      <RoadmapClient lessons={lessons} />
    </main>
  );
}
