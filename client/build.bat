@echo off
echo Building GMX.exe...
pyinstaller --onefile --windowed --name GMX --icon=icon.ico GMX.py
echo Done! Check dist/GMX.exe
pause
