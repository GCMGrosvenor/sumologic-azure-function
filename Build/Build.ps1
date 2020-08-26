param (
    $Tasks = @('Compile','Package'),
    $BootstrapVersion = '1.0',
    $PackageVersion = "3.*.*",
    [switch]$AllowPrereleasePackageVersions = $false,
    $Bootstrap = "https://raw.githubusercontent.com/GCMGrosvenor/NuGet.Bootstrap/$BootstrapVersion/Bootstrap.ps1"
)

iwr -useb -Headers @{'Authorization'="token $env:GitHubAccessToken"} $Bootstrap | iex |% { & $_ Gcm.Build -Version $PackageVersion -AllowPrereleaseVersions $AllowPrereleasePackageVersions -Args @{ Task = $Tasks; } }