"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AddProjectModal from "../components/AddProjectModal";
import ProjectCard from "../components/ProjectCard";
import { Project } from "../types/index";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const fetchProjects = async () => {
    const res = await axios.get<Project[]>(
      "http://localhost:5000/api/projects"
    );
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          {/* <h1 className="text-2xl font-bold">
            Projects & Expenses Tracker
          </h1> */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            + Add Project
          </button>
        </div>

        <div className="space-y-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              refresh={fetchProjects}
            />
          ))}
        </div>
      </div>

      {showModal && (
        <AddProjectModal
          onClose={() => setShowModal(false)}
          refresh={fetchProjects}
        />
      )}
    </div>
  );
}
