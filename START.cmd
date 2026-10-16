@echo off
cd /d "%~dp0"
set "K95_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "K95_NODE=C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
echo K95 Vanilla JavaScript
echo Open http://localhost:3001/ in your browser.
echo Keep this window open while viewing the website.
"%K95_NODE%" serve.mjs
pause
