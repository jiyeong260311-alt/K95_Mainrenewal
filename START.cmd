@echo off
cd /d "%~dp0"
set "K95_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "K95_NODE=C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
echo K95 preview: http://localhost:3000/en/
echo Keep this window open while viewing the website.
"%K95_NODE%" scripts\serve.mjs
pause
