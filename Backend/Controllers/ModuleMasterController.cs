using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MigraTrackAPI.Data;
using MigraTrackAPI.Models;

namespace MigraTrackAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ModuleMasterController : ControllerBase
{
    private readonly MigraTrackDbContext _context;

    public ModuleMasterController(MigraTrackDbContext context)
    {
        _context = context;
    }

    // GET: api/ModuleMaster
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ModuleMaster>>> GetModuleMasters()
    {
        return await _context.ModuleMasters.ToListAsync();
    }
}
