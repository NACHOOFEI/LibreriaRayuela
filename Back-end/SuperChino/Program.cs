using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SuperChino.Config;
using SuperChino.Models.Product;
using SuperChino.Repositories;
using SuperChino.Services;
using SuperChino.Utils;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo 
    { 
     Version = "v1",
     Title = "super mercado",
     Description = " gestion de comercio",
     TermsOfService = new Uri("http://superchino")
    });
    options.AddSecurityDefinition("Token", new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Description = "Json Web Token, Authorization header using the Bearer scheme.",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Name = "Authorization",
        Scheme = "bearer"
    });
    options.OperationFilter<AuthOperationFilter>();

}

);




///autoMapper

builder.Services.AddAutoMapper(options => { }, typeof(Mapping));

///Services

builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<RolServices>();
builder.Services.AddScoped<CategoryServices>();
builder.Services.AddScoped<ProductServices>();
builder.Services.AddScoped<CategoryServices>();
builder.Services.AddScoped<CustomerServices>();
builder.Services.AddScoped<IEncoderServices,EncoderServices>();
builder.Services.AddSingleton<S3Services>();




/// repositories 
builder.Services.AddScoped<IUserRepository,UserRepository>();
builder.Services.AddScoped<IRolRepository,RolRepository>();
builder.Services.AddScoped<ICategoryRepository,CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();

builder.Services.AddAutoMapper(opst => { } ,typeof(Mapping));

///Db
builder.Services.AddDbContext<ApplicationDbContext>(option =>
{
    option.UseSqlServer(builder.Configuration.GetConnectionString("devConnection"));
});

///JWT
var secret = builder.Configuration.GetSection("Secrets")?.GetSection("JWT")?.Value?.ToString() ?? null!;
builder.Services.AddAuthentication(opts =>
{
    opts.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    opts.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        var key = Encoding.UTF8.GetBytes(secret);
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
        };
    })
    .AddCookie(opts =>
    {
        opts.Cookie.HttpOnly = true;
        opts.Cookie.SameSite = SameSiteMode.None;
        opts.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        opts.ExpireTimeSpan = TimeSpan.FromDays(1);
    });

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(x => x.Value?.Errors.Count > 0)
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>()
            );
        return new BadRequestObjectResult(new ValidationErrorResponse(errors));
    };

});


var app = builder.Build();

app.UseCors(opst =>
{
    opst.AllowAnyMethod();
    opst.AllowAnyHeader();
    opst.WithOrigins("http://localhost:5173");
    opst.AllowCredentials();
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
