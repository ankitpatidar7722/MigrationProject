using Microsoft.EntityFrameworkCore;
using MigraTrackAPI.Data;
using MigraTrackAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
// Register Services
builder.Services.AddScoped<ICustomizationService, CustomizationService>();
// builder.Services.AddScoped<IProjectService, ProjectService>(); // Example if needed

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure SQL Server Database
builder.Services.AddDbContext<MigraTrackDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register application services
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IDataTransferService, DataTransferService>();
builder.Services.AddScoped<IVerificationService, VerificationService>();
builder.Services.AddScoped<IIssueService, IssueService>();
builder.Services.AddScoped<ICustomizationService, CustomizationService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Configure CORS to allow frontend access
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin => true) // Allow any origin for development
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Commented out for development - frontend uses HTTP
app.UseCors("AllowFrontend");
app.UseStaticFiles(); // Enable static files for uploads
app.UseAuthorization();
app.MapControllers();

app.Run();
