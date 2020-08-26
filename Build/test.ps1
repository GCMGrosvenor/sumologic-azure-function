[CmdletBinding(PositionalBinding=$false)]
param([Alias('c')]$Configuration = 'Release', [Alias('o')]$Output = "$PSScriptRoot/../artifacts", [Alias('v')]$Verbosity = 'n', [Parameter(ValueFromRemainingArguments)][array]$CommandArgs)
$ErrorActionPreference = 'Stop'
function exec { & $args[0] ($args | Select -Skip 1 |% { $_ }); if ($LASTEXITCODE -ne 0) { throw "Error executing $($args |% { $_ })`nExited with code $LASTEXITCODE" } } # Wrapper for execute command that flattens args and checks return code
Push-Location $PSScriptRoot/..
try {
  ([IO.Path]::GetFileNameWithoutExtension($PSCommandPath)) |% { if (Test-Path $PSScriptRoot/$_.before.ps1) { if ((. "$PSScriptRoot/$_.before.ps1") -eq $false) { Write-Host "$_before.ps1 returned false - exiting"; exit $LASTEXITCODE } } } # allow decorating before
  exec dotnet test -c $Configuration --no-build -r $Output -v $Verbosity $CommandArgs
  ([IO.Path]::GetFileNameWithoutExtension($PSCommandPath)) |% { if (Test-Path $PSScriptRoot/$_.after.ps1) { . "$PSScriptRoot/$_.after.ps1" } } # allow decorating after
} finally { Pop-Location }