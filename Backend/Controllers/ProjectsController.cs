using Microsoft.AspNetCore.Mvc;
using MigraTrackAPI.Models;
using MigraTrackAPI.Services;

namespace MigraTrackAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Project>>> GetAllProjects()
    {
        var projects = await _projectService.GetAllProjectsAsync();
        return Ok(projects);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Project>> GetProject(long id)
    {
        var project = await _projectService.GetProjectByIdAsync(id);
        if (project == null)
            return NotFound();

        return Ok(project);
    }

    [HttpPost]
    public async Task<ActionResult<Project>> CreateProject(Project project)
    {
        var created = await _projectService.CreateProjectAsync(project);
        return CreatedAtAction(nameof(GetProject), new { id = created.ProjectId }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(long id, Project project)
    {
        if (id != project.ProjectId)
            return BadRequest();

        var updated = await _projectService.UpdateProjectAsync(project);
        if (updated == null)
            return NotFound();

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(long id)
    {
        var result = await _projectService.DeleteProjectAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpGet("{id}/dashboard")]
    public async Task<IActionResult> GetProjectDashboard(long id)
    {
        var stats = await _projectService.GetProjectDashboardAsync(id);
        return Ok(stats);
    }

    [HttpPost("{sourceId}/clone/{targetId}")]
    public async Task<IActionResult> CloneProject(long sourceId, long targetId)
    {
        try 
        {
            var success = await _projectService.CloneProjectDataAsync(sourceId, targetId);
            if (!success)
                return BadRequest("Clone failed. Ensure both projects exist.");

            return Ok(new { message = "Project data cloned successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
