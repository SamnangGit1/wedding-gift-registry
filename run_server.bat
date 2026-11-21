@echo off
echo Starting local web server on http://localhost:8000 ...
start "" "http://localhost:8000/Village%20Records.html"
python -m http.server 8000
pause
