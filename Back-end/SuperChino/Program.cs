using Microsoft.EntityFrameworkCore;
using SuperChino.Config;
using SuperChino.Repositories;
using SuperChino.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

///autoMapper

builder.Services.AddAutoMapper(options => { }, typeof(Mapping));

///Services

builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<RolServices>();

builder.Services.AddScoped<CategoryServices>();



/// repositories 
builder.Services.AddScoped<IUserRepository,UserRepository>();
builder.Services.AddScoped<IRolRepository,RolRepository>();
builder.Services.AddScoped<ICategoryRepository,CategoryRepository>();


///Db
builder.Services.AddDbContext<ApplicationDbContext>(option =>
{
    option.UseSqlServer(builder.Configuration.GetConnectionString("devConnection"));
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
