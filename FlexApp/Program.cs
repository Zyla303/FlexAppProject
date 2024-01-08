using FlexApp;
using FlexApp.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Register the DbContext
builder.Services.AddDbContext<DatabaseContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "clientapp/dist";
});

// Register IHttpContextAccessor
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<DatabaseContext>()
    .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    // Ustawienie wygaœniêcia pliku cookie na 15 minut
    options.ExpireTimeSpan = TimeSpan.FromMinutes(15);
    options.LoginPath = "/Login"; // Œcie¿ka do Twojego widoku logowania
    options.LogoutPath = "/Logout"; // Œcie¿ka do Twojego widoku wylogowania
    options.SlidingExpiration = true; // Odnowienie wygaœniêcia pliku cookie przy aktywnoœci u¿ytkownika
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

var spaPath = "/app";
if (app.Environment.IsDevelopment())
{
    app.MapWhen(y => y.Request.Path.StartsWithSegments(spaPath), client =>
    {
        client.UseSpa(spa =>
        {
            spa.UseProxyToSpaDevelopmentServer("http://localhost:5312");
        });
    });
}
else
{
    app.Map(new PathString(spaPath), client =>
    {
        client.UseSpaStaticFiles();
        client.UseSpa(spa =>
        {
            spa.Options.SourcePath = "clientapp";
            spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ResponseHeaders headers = ctx.Context.Response.GetTypedHeaders();
                    headers.CacheControl = new CacheControlHeaderValue
                    {
                        NoCache = true,
                        NoStore = true,
                        MustRevalidate = true
                    };
                }
            };
        });
    });
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dbContext = services.GetRequiredService<DatabaseContext>();
    var userManager = services.GetRequiredService<UserManager<IdentityUser>>();
    var signInManager = services.GetRequiredService<SignInManager<IdentityUser>>();
    dbContext.Database.EnsureCreated();
    //dbContext.Database.Migrate();
}

app.Run();
