function Use-ProjectNodeVersion {
    $version = pnv
    if ($LASTEXITCODE -eq 0) {
        nvm use $version
    }
}

Set-Alias -Name upnv -Value Use-ProjectNodeVersion

# 将这个函数添加到 PowerShell 配置文件中
$profileContent = Get-Content $PROFILE -ErrorAction SilentlyContinue
if (-not ($profileContent -match "Use-ProjectNodeVersion")) {
    Add-Content $PROFILE "`n. `"$PSScriptRoot\use-project-node-version.ps1`""
} 