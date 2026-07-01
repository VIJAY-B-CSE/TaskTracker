package com.vijay.tasktracker.controller;

import com.vijay.tasktracker.entity.Project;
import com.vijay.tasktracker.entity.Task;
import com.vijay.tasktracker.repository.ProjectRepository;
import com.vijay.tasktracker.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import tools.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional // Automatically rolls back database changes after each test method
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Project savedProject;

    @BeforeEach
    public void setup() {
        // Clear old database data to ensure tests are isolated
        taskRepository.deleteAll();
        projectRepository.deleteAll();

        // Create and save a dummy project because tasks require a valid project link
        Project project = new Project();
        project.setName("Test Project");
        project.setDescription("Project for integration tests");
        savedProject = projectRepository.save(project);
    }

    // 1. Create Task (POST) - Verify task is created successfully
    @Test
    public void testCreateTask_Success() throws Exception {
        Task task = new Task();
        task.setTitle("Test Task Title");
        task.setDescription("Test Task Description");
        task.setStatus("TODO");
        task.setPriority("MEDIUM");
        task.setDueDate(LocalDate.now().plusDays(5));
        task.setProject(savedProject);

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.title").value("Test Task Title"))
                .andExpect(jsonPath("$.project.id").value(savedProject.getId()));
    }

    // 2. Get All Tasks (GET) - Verify the API returns a list of tasks
    @Test
    public void testGetAllTasks_Success() throws Exception {
        // Save a test task directly in database
        Task task = new Task();
        task.setTitle("Existing Task");
        task.setDescription("Already in DB");
        task.setStatus("TODO");
        task.setPriority("LOW");
        task.setDueDate(LocalDate.now());
        task.setProject(savedProject);
        taskRepository.save(task);

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                // Since our API returns paginated Page<Task>, the tasks are inside the "content" array
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title").value("Existing Task"));
    }

    // 3. Update Task (PUT) - Verify task details are updated
    @Test
    public void testUpdateTask_Success() throws Exception {
        // Save an initial task
        Task task = new Task();
        task.setTitle("Original Title");
        task.setDescription("Original Desc");
        task.setStatus("TODO");
        task.setPriority("LOW");
        task.setDueDate(LocalDate.now());
        task.setProject(savedProject);
        Task savedTask = taskRepository.save(task);

        // Modify fields
        savedTask.setTitle("Updated Title");
        savedTask.setStatus("DOING");

        mockMvc.perform(put("/api/tasks/" + savedTask.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(savedTask)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.status").value("DOING"));
    }

    // 4. Delete Task (DELETE) - Verify the task is deleted
    @Test
    public void testDeleteTask_Success() throws Exception {
        // Save a task
        Task task = new Task();
        task.setTitle("To Be Deleted");
        task.setDescription("Goodbye");
        task.setStatus("TODO");
        task.setPriority("HIGH");
        task.setDueDate(LocalDate.now());
        task.setProject(savedProject);
        Task savedTask = taskRepository.save(task);

        // Perform delete
        mockMvc.perform(delete("/api/tasks/" + savedTask.getId()))
                .andExpect(status().isNoContent());

        // Perform GET on the deleted task and verify it returns 404 Not Found
        mockMvc.perform(get("/api/tasks/" + savedTask.getId()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Task not found with id: " + savedTask.getId()));
    }

    // 5. Validation Test - Send invalid request and verify HTTP 400 Bad Request
    @Test
    public void testCreateTask_ValidationError_EmptyTitle() throws Exception {
        Task invalidTask = new Task();
        invalidTask.setTitle(""); // Empty title (fails @NotBlank validation)
        invalidTask.setDescription("Missing a title");
        invalidTask.setStatus("TODO");
        invalidTask.setPriority("HIGH");
        invalidTask.setDueDate(LocalDate.now());
        invalidTask.setProject(savedProject);

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidTask)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message", containsString("Title cannot be blank")));
    }
}
