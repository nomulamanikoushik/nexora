@echo off
echo Starting NEXORA React Frontend on port 3000...
cd /d "%~dp0frontend"
set PATH=C:\Users\nomul\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64;%PATH%
call npm run dev
pause
