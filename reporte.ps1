# Crear nueva estructura de API routes
New-Item -ItemType Directory -Path "src/app/api/admin/login" -Force
New-Item -ItemType Directory -Path "src/app/api/eventos/[id]" -Force
New-Item -ItemType Directory -Path "src/app/api/invitaciones/[id]" -Force
New-Item -ItemType Directory -Path "src/app/api/invitaciones/token" -Force
New-Item -ItemType Directory -Path "src/app/api/asistencias" -Force
New-Item -ItemType Directory -Path "src/app/api/notificaciones" -Force

# Copiar archivos de API (mover de [lang]/api a api)
Copy-Item "src/app/[lang]/api/admin/login/route.ts" "src/app/api/admin/login/route.ts" -Force
Copy-Item "src/app/[lang]/api/eventos/route.ts" "src/app/api/eventos/route.ts" -Force
Copy-Item "src/app/[lang]/api/eventos/[id]/route.ts" "src/app/api/eventos/[id]/route.ts" -Force
Copy-Item "src/app/[lang]/api/invitaciones/route.ts" "src/app/api/invitaciones/route.ts" -Force
Copy-Item "src/app/[lang]/api/invitaciones/[id]/route.ts" "src/app/api/invitaciones/[id]/route.ts" -Force
Copy-Item "src/app/[lang]/api/invitaciones/token/route.ts" "src/app/api/invitaciones/token/route.ts" -Force
Copy-Item "src/app/[lang]/api/asistencias/route.ts" "src/app/api/asistencias/route.ts" -Force
Copy-Item "src/app/[lang]/api/notificaciones/route.ts" "src/app/api/notificaciones/route.ts" -Force

# Eliminar carpeta API antigua
Remove-Item "src/app/[lang]/api" -Recurse -Force

Write-Host "✅ API routes movidas exitosamente" -ForegroundColor Green