
@echo off
cd /d "%~dp0"

set "K95_NODE=node"
where node >nul 2>nul

if errorlevel 1 (
    set "K95_NODE=C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
)

echo ====================================
echo K95 Website Starting...
echo ====================================

echo Starting K95 server...

start "" /b cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3001/"

"%K95_NODE%" serve.mjs

pause
