using API_WebBDDHT.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API Web Bán Dụng Cụ Học Tập", Version = "v1" });

    // 1. Định nghĩa chuẩn bảo mật Bearer Token cho Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Hệ thống tự động đồng bộ Token sau khi đăng nhập thành công.",
        Name = "Authorization",
        In = ParameterLocation.Header, // Vị trí của token trong header
        Type = SecuritySchemeType.Http, // Đổi từ ApiKey sang Http để kích hoạt tự động bắt scheme
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    // 2. Áp dụng cấu hình bảo mật toàn cục cho các API có thẻ [Authorize]
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
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

// Cấu hình DbContext với chuỗi kết nối từ appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// Cấu hình JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var keyStr = jwtSettings["Key"];
if (string.IsNullOrEmpty(keyStr))
{
    throw new InvalidOperationException("JWT Key không được tìm thấy trong cấu hình hệ thống!");
}
var key = Encoding.UTF8.GetBytes(keyStr);
// Thiết lập các tùy chọn xác thực JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "http://localhost:7224",// Đảm bảo khớp với URL backend API của bạn
        ValidAudience = jwtSettings["Audience"] ?? "http://localhost:5173",// Đảm bảo khớp với URL frontend React của bạn
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero // Loại bỏ thời gian trễ mặc định để token hết hạn chính xác
    };
});

// Cấu hình CORS để cho phép frontend React truy cập API
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", policy => {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Đăng ký AutoMapper quét qua toàn bộ project để tìm cấu hình MappingProfile
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<API_WebBDDHT.Mappings.MappingProfile>();
});
builder.Services.AddSingleton<API_WebBDDHT.Helpers.ICloudinaryHelper, API_WebBDDHT.Helpers.CloudinaryHelper>();

// GHN Service
builder.Services.AddHttpClient();
builder.Services.AddScoped<API_WebBDDHT.Services.IGiaoHangNhanhService, API_WebBDDHT.Services.GiaoHangNhanhService>();
builder.Services.AddScoped<API_WebBDDHT.Services.IVnPayService, API_WebBDDHT.Services.VnPayService>();
builder.Services.AddScoped<API_WebBDDHT.Services.IMoMoService, API_WebBDDHT.Services.MoMoService>();
builder.Services.AddScoped<API_WebBDDHT.Services.IEmailService, API_WebBDDHT.Services.EmailService>();
builder.Services.AddHostedService<API_WebBDDHT.Services.DonDepDonHangService>();
var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// Kích hoạt xác thực JWT
app.UseCors("AllowReact");

app.UseAuthentication();// Kích hoạt middleware xác thực JWT trước khi vào các controller

app.UseAuthorization();// Kích hoạt middleware phân quyền sau khi đã xác thực

app.MapControllers();

app.Run();
