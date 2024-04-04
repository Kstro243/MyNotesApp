#!/bin/bash
frontend_path=$(find / -type d -name "frontend" 2>/dev/null)
gnome-terminal --working-directory=$frontend_path -- bash -c 'npm i && npm run start:local; read' &

backend_path=$(find / -type d -name "backend" 2>/dev/null)
gnome-terminal --working-directory=$backend_path -- bash -c 'dotnet run; read'

