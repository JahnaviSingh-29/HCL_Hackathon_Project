# setup.ps1 — Run once to set up the database, then start both servers
# Usage: cd C:\Users\Gauri_Dixit\Desktop\HCL_Hackathon\backend && powershell -ExecutionPolicy Bypass -File ..\setup.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WanderStay — Full Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "$PSScriptRoot\backend"

Write-Host "[1/3] Resetting database & applying migrations..." -ForegroundColor Yellow
# Force-reset so we get a clean state (drops and recreates dev.db)
npx prisma migrate reset --force --schema=prisma/schema.prisma
if ($LASTEXITCODE -ne 0) {
    Write-Host "Migration reset failed. Trying migrate dev instead..." -ForegroundColor Red
    npx prisma migrate dev --name add_rooms --schema=prisma/schema.prisma
}

Write-Host ""
Write-Host "[2/3] Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate --schema=prisma/schema.prisma

Write-Host ""
Write-Host "[3/3] Seeding database with hotels + rooms..." -ForegroundColor Yellow
npx tsx prisma/seed.ts

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host "  Now run these in TWO separate terminals:" -ForegroundColor Green
Write-Host ""
Write-Host "  Terminal 1 (Backend):" -ForegroundColor White
Write-Host "    cd backend && npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Terminal 2 (Frontend):" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Then open: http://localhost:5173" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
