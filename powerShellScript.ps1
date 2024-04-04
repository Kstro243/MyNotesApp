Start-Process cmd.exe -ArgumentList '/c "cd .\frontend\ && npm i && npm run start:local"'
Start-Process cmd.exe -ArgumentList '/c "cd .\backend\ && dotnet run"'