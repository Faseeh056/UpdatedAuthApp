# Load environment variables from .env file
$envContent = Get-Content -Path ".env" -ErrorAction SilentlyContinue
foreach ($line in $envContent) {
    if ($line -match '^([^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim(' "')
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
        Write-Host "Set environment variable: $name"
    }
}

# Run the migration command
npm run db:migrate