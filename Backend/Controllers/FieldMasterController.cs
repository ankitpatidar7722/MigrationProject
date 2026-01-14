using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MigraTrackAPI.Data;
using MigraTrackAPI.Models;

namespace MigraTrackAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FieldMasterController : ControllerBase
{
    private readonly MigraTrackDbContext _context;

    public FieldMasterController(MigraTrackDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FieldMaster>>> GetAll()
    {
        return Ok(await _context.FieldMaster.Where(f => f.IsActive).ToListAsync());
    }

    [HttpGet("group/{moduleGroupId}")]
    public async Task<ActionResult<IEnumerable<FieldMaster>>> GetByModuleGroup(int moduleGroupId)
    {
        var fields = await _context.FieldMaster
            .Where(f => f.ModuleGroupId == moduleGroupId && f.IsActive)
            .OrderBy(f => f.DisplayOrder)
            .ToListAsync();
        
        return Ok(fields);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FieldMaster>> GetById(int id)
    {
        var field = await _context.FieldMaster.FindAsync(id);
        if (field == null)
            return NotFound();

        return Ok(field);
    }

    [HttpPost]
    public async Task<ActionResult<FieldMaster>> Create(FieldMaster field)
    {
        field.CreatedAt = DateTime.Now;
        field.UpdatedAt = DateTime.Now;
        
        _context.FieldMaster.Add(field);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = field.FieldId }, field);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, FieldMaster field)
    {
        if (id != field.FieldId)
            return BadRequest();

        var existing = await _context.FieldMaster.FindAsync(id);
        if (existing == null)
            return NotFound();

        existing.FieldName = field.FieldName;
        existing.FieldLabel = field.FieldLabel;
        existing.FieldDescription = field.FieldDescription;
        existing.DataType = field.DataType;
        existing.IsRequired = field.IsRequired;
        existing.DefaultValue = field.DefaultValue;
        existing.SelectQueryDb = field.SelectQueryDb;
        existing.DisplayOrder = field.DisplayOrder;
        existing.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var field = await _context.FieldMaster.FindAsync(id);
        if (field == null)
            return NotFound();

        field.IsActive = false;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
