# Publish micpanel for IIS deployment.
# Usage:
#   .\publish.ps1              -> outputs to .\publish
#   .\publish.ps1 -Deploy      -> also copies to IIS (requires Administrator)

param(
    [switch]$Deploy,
    [string]$IisPath = "C:\inetpub\wwwroot\micpanel"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$LocalOutput = Join-Path $ProjectRoot "publish"
$ProjectFile = Join-Path $ProjectRoot "micpanel.csproj"

Write-Host "Publishing to $LocalOutput ..." -ForegroundColor Cyan
dotnet publish $ProjectFile -c Release -o $LocalOutput
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Publish succeeded: $LocalOutput" -ForegroundColor Green

if (-not $Deploy) {
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Copy React webApp build -> $LocalOutput\wwwroot\"
    Write-Host "  2. Copy React cp build     -> $LocalOutput\wwwroot\cp\"
    Write-Host "  3. Run as Administrator:   .\publish.ps1 -Deploy"
    exit 0
}

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator
)
if (-not $isAdmin) {
    Write-Error "Deploy requires Administrator. Right-click PowerShell -> Run as administrator, then run: .\publish.ps1 -Deploy"
    exit 1
}

if (-not (Test-Path $IisPath)) {
    New-Item -ItemType Directory -Path $IisPath -Force | Out-Null
}

Write-Host "Copying to IIS: $IisPath ..." -ForegroundColor Cyan
robocopy $LocalOutput $IisPath /MIR /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) {
    Write-Error "robocopy failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "Deployed to $IisPath" -ForegroundColor Green
Write-Host "Remember to copy React builds into wwwroot if not already done." -ForegroundColor Yellow
