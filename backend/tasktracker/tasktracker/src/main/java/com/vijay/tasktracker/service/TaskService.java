package com.vijay.tasktracker.service;

import com.vijay.tasktracker.entity.Task;
import com.vijay.tasktracker.exception.ResourceNotFoundException;
import com.vijay.tasktracker.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepo;

    public List<Task> getAllTasks() {
        return taskRepo.findAll();
    }

    public Page<Task> getTasks(String status, String priority, Pageable pageable) {
        return taskRepo.findByStatusAndPriority(status, priority, pageable);
    }

    public Task getTaskById(Long id) {
        return taskRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    public Task saveTask(Task task) {
        return taskRepo.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task existingTask = taskRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        existingTask.setTitle(taskDetails.getTitle());
        existingTask.setDescription(taskDetails.getDescription());
        existingTask.setStatus(taskDetails.getStatus());
        existingTask.setPriority(taskDetails.getPriority());
        existingTask.setDueDate(taskDetails.getDueDate());
        existingTask.setProject(taskDetails.getProject());
        return taskRepo.save(existingTask);
    }

    public void deleteTask(Long id) {
        Task existingTask = taskRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        taskRepo.delete(existingTask);
    }
}
