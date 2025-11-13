using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using LibreriaOnline.Config;
using LibreriaOnline.Models.Product;
using LibreriaOnline.Repositories;
using LibreriaOnline.Services;
using LibreriaOnline.Utils;
using System.Security.Claims;
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
        Title = "Libreria Online API",
        Description = "Aplicación WEB para Librería."
    });

    // Configuración para usar JWT desde Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Inserte: Bearer {token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});




///autoMapper

builder.Services.AddAutoMapper(options => { }, typeof(Mapping));

///Services
builder.Services.AddScoped<AuthServices>();

builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<RolServices>();
builder.Services.AddScoped<CategoryServices>();
builder.Services.AddScoped<ProductServices>();
builder.Services.AddScoped<CategoryServices>();

builder.Services.AddScoped<IEncoderServices,EncoderServices>();
builder.Services.AddSingleton<S3Services>();

builder.Services.AddScoped<CustomerServices>();

builder.Services.AddScoped<OrderItemServices>();
builder.Services.AddScoped<OrderServices>();

builder.Services.AddScoped<WhatsAppServices>();

/// repositories 
builder.Services.AddScoped<IUserRepository,UserRepository>();
builder.Services.AddScoped<IRolRepository,RolRepository>();
builder.Services.AddScoped<ICategoryRepository,CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IOrderItemRepository, OrderItemRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();


builder.Services.AddAutoMapper(opst => { } ,typeof(Mapping));

///Db
builder.Services.AddDbContext<ApplicationDbContext>(option =>
{
    option.UseSqlServer(builder.Configuration.GetConnectionString("devConnection"));
});

///JWT
var secret = builder.Configuration.GetSection("Secrets")?.GetSection("JWT")?.Value?.ToString() ?? null!;

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
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

        // ✅ Usa el claim de rol estándar que genera ClaimTypes.Role
        RoleClaimType = ClaimTypes.Role,
        NameClaimType = "Id"
    };

    // 🔍 Logs de depuración
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("❌ JWT Authentication failed: " + context.Exception.Message);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            var claims = context.Principal?.Claims.Select(c => $"{c.Type}={c.Value}");
            Console.WriteLine("✅ JWT validado correctamente. Claims: " + string.Join(", ", claims ?? new string[] { }));
            return Task.CompletedTask;
        }
    };
}).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, opts =>
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
