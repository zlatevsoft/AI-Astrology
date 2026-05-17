<#
.SYNOPSIS
  From repo root: git add -A, commit, push (PowerShell 5.1+).

.PARAMETER Message
  Commit message. If blank, uses deploy: yyyy-MM-dd HH:mm

.PARAMETER DryRun
  Only git status; no add/commit/push.

.EXAMPLE
  cd "C:\Users\ZLATEV SOFT\Desktop\AI Astrology"
  .\scripts\push-github.ps1 -Message "feat: BG hero typography"

.EXAMPLE
  .\scripts\push-github.ps1
#>
param(
  [string]$Message = "",
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

if (-not $PSScriptRoot) {
  Write-Error 'PSScriptRoot missing. Run as: .\scripts\push-github.ps1'
  exit 1
}

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $RepoRoot

Write-Host "Repo: $RepoRoot" -ForegroundColor Cyan

try {
  $branch = (git rev-parse --abbrev-ref HEAD).Trim()
}
catch {
  Write-Error 'Not a git repository.'
  exit 1
}

Write-Host "Branch: $branch" -ForegroundColor Cyan
Write-Host ''
git status --short

if ($DryRun) {
  Write-Host ''
  Write-Host 'DryRun: stopping.' -ForegroundColor Yellow
  exit 0
}

$dirty = git status --porcelain
if (-not $dirty) {
  Write-Host ''
  Write-Host 'Nothing to commit; pushing current branch only...' -ForegroundColor Yellow
  git push origin $branch
  exit $LASTEXITCODE
}

git add -A
Write-Host ''
Write-Host 'After git add:' -ForegroundColor DarkGray
git status --short

if (-not $Message.Trim() -or $Message.Trim().Length -lt 3) {
  $Message = "deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

Write-Host ''
Write-Host "Commit: $Message" -ForegroundColor Green
git commit -m $Message
if ($LASTEXITCODE -ne 0) {
  Write-Host ''
  Write-Error 'Commit failed (hooks or nothing staged). Check output above.'
  exit $LASTEXITCODE
}

Write-Host ''
git push origin $branch
$pushExit = $LASTEXITCODE
if ($pushExit -ne 0) {
  Write-Host ''
  Write-Host 'Push failed. For GitHub HTTPS use a Personal Access Token as the password (not your GitHub login password).' -ForegroundColor Yellow
}
exit $pushExit
