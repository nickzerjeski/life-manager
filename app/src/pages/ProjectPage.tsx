import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { ProjectHandler } from "@shared/models/ProjectHandler";
import { containerStyle, statusLabelStyle } from "@/styles/statusStyles";
import AddProjectModal from "@/modals/AddProjectModal";
import { Project } from "@shared/models/Project";
import ProjectDetailView from "../views/ProjectDetailView";


/* ---------- main component ---------- */
export default function ProjectPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    ProjectHandler.getInstance()
      .getProjects()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) =>
    `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="bg-white p-4 sm:p-6 rounded-lg shadow border space-y-4">
      {selectedProject ? (
        <ProjectDetailView
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
        />
      ) : (
        <>
          {/* header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Project Overview</h1>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
            >
              <Plus size={18} className="mr-2" />
              Add Project
            </button>
          </div>

          {/* search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search projects (name or description)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length > 0 ? (
              filtered.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`${containerStyle[project.status]} p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200`}
                >
                  <h2 className="text-lg font-semibold">{project.name}</h2>
                  <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
                  <span className={`${statusLabelStyle[project.status]} flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full `}>
                    {project.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-10">No projects found.</p>
            )}
          </div>
          <AddProjectModal
            isOpen={showAdd}
            onClose={() => setShowAdd(false)}
            onCreated={async () => {
              const updated = await ProjectHandler.getInstance().getProjects();
              setProjects(updated);
            }}
          />
        </>
      )}
    </section>
  );
}
