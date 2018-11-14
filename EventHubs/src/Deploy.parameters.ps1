param ([Parameter(Mandatory = $true)][string]$Lifecycle, [string] $LifecyclePrefix)

[System.Reflection.Assembly]::LoadFrom("$PSScriptRoot\Gcm.ConfigurationLoader.dll") | Out-Null

$obj = [Gcm.ConfigurationLoader.ConfigurationLoader]::LoadHashtable("$PSScriptRoot/Config/deploy.app.json", "$PSScriptRoot/Config/deploy.variables.json", [string[]]@("default", $Lifecycle))

$obj