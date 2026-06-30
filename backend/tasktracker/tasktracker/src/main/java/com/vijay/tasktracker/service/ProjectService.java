package com.vijay.tasktracker.service;

import com.vijay.tasktracker.entity.Project;
import com.vijay.tasktracker.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepo;

    public List<Project> getAllProjects() {
        return projectRepo.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepo.findById(id);
    }

    public Project saveProject(Project project) {
        return projectRepo.save(project);
    }

    public Project updateProject(Long id, Project projectDetails) {
        Project existingProject = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        existingProject.setName(projectDetails.getName());
        existingProject.setDescription(projectDetails.getDescription());
        return projectRepo.save(existingProject);
    }

    public void deleteProject(Long id) {
        projectRepo.deleteById(id);
    }
}
