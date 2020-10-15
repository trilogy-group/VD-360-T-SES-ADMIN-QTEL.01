param(
  [string]$workspace = $(pwd)
)

#########################################################

if (!$workspace -Or -Not (Test-Path "$workspace")) {
    Write-Output "workspace variable not set, exiting."
    exit 1
}

function DoInFolder([Object] $Directory, [scriptblock] $ScriptBlock)
{
    push-location "$Directory"
    Write-Output "Entered directory $Directory .."
    try {
        & $ScriptBlock
        if ($lastexitcode -ne 0) {
            throw ("DoInFolder: Failed with code $lastexitcode")
        }
    }
    finally {
        pop-location
        Write-Output "Exited directory $Directory .."
    }
}

function GetEnvOrDefault([string] $key, [string] $defaultVal = "") {
    $ret = [Environment]::GetEnvironmentVariable($key)
    if ($ret -eq $Null) {
        $ret = $defaultVal
    }
    Write-Output $ret
}

#########################################################

$env:_360CICDFramework = GetEnvOrDefault "_360CICDFramework" "$PSScriptRoot/../commonCICD"
$env:_360CICDTools = GetEnvOrDefault "_360CICDTools" "$PSScriptRoot/tools"
$env:_360CICDTools_BI = GetEnvOrDefault "_360CICDTools_BI" "$env:_360CICDTools/buildinfo/genreleaseinfo.bat"
$env:_360CICDTools_Conan = GetEnvOrDefault "_360CICDTools_Conan" "python ""$env:_360CICDTools/conan/conan.py"""

Import-Module -DisableNameChecking "$env:_360CICDFramework/deployment/lib/tools.psm1" -Scope Global

$out="dist"
$env:VSVER = GetEnvOrDefault "VSVER" "100"
$env:COMPILER_VERSION = GetEnvOrDefault "COMPILER_VERSION" "msvc10.0"

DoInFolder ("$workspace") {
    EnsureEmptyFolder "$workspace\$out"

    Write-Output "Building ..."
    cmd.exe /c "$workspace\buildTailoring.bat"
    if ($lastexitcode -ne 0)
    {
        Write-Error "Build Failed with code $lastexitcode"
        exit 1
    }

    CopyAll "$workspace\sesadmin\setup\bin\Release\*.msi" "$workspace\$out\"
}
