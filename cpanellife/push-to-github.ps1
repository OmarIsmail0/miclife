# Script to push code to GitHub repository
# Run this after creating the repository on GitHub

Write-Host "Pushing code to GitHub..." -ForegroundColor Green

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Adding remote origin..." -ForegroundColor Yellow
    git remote add origin https://github.com/OmarIsmail0/mic-cpanel-frontend.git
}

# Push to GitHub
Write-Host "Pushing to main branch..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccess! Code has been pushed to GitHub." -ForegroundColor Green
    Write-Host "Repository URL: https://github.com/OmarIsmail0/mic-cpanel-frontend" -ForegroundColor Cyan
} else {
    Write-Host "`nError: Failed to push. Make sure:" -ForegroundColor Red
    Write-Host "1. The repository 'mic-cpanel-frontend' exists on GitHub" -ForegroundColor Yellow
    Write-Host "2. You have push access to the repository" -ForegroundColor Yellow
    Write-Host "3. You are authenticated with GitHub" -ForegroundColor Yellow
}

