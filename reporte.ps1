# Verificar estructura mínima necesaria
$requiredFiles = @(
    "package.json",
    "next.config.mjs",
    "tailwind.config.ts",
    "postcss.config.mjs",
    "tsconfig.json",
    "middleware.ts",
    ".env.local",
    ".gitignore",
    "src/app/layout.tsx",
    "src/app/globals.css",
    "src/app/loading.tsx",
    "src/app/error.tsx",
    "src/app/not-found.tsx",
    "src/app/[lang]/layout.tsx",
    "src/app/[lang]/page.tsx",
    "src/app/[lang]/admin/layout.tsx",
    "src/app/[lang]/admin/page.tsx",
    "src/i18n/config.ts",
    "src/i18n/request.ts",
    "messages/es.json",
    "messages/en.json",
    "src/lib/db.ts",
    "src/lib/auth.ts",
    "src/lib/tokens.ts",
    "src/lib/utils.ts",
    "src/lib/validators.ts",
    "src/lib/eventos.ts",
    "src/lib/invitaciones.ts",
    "src/lib/asistencias.ts",
    "src/lib/notificaciones.ts",
    "src/types/index.ts",
    "src/types/eventos.ts",
    "src/types/invitaciones.ts",
    "src/types/api.ts",
    "src/hooks/useCountdown.ts",
    "src/hooks/useParallax.ts",
    "src/hooks/useMusic.ts",
    "src/hooks/useNotifications.ts",
    "src/hooks/useAuth.ts",
    "src/hooks/useScrollReveal.ts",
    "src/components/ui/Button.tsx",
    "src/components/ui/Input.tsx",
    "src/components/ui/Modal.tsx",
    "src/components/ui/Toast.tsx",
    "src/components/ui/Badge.tsx",
    "src/components/ui/Spinner.tsx",
    "src/components/ui/Skeleton.tsx",
    "src/components/ui/Confetti.tsx",
    "src/components/ui/Divider.tsx",
    "src/components/parallax/ParallaxHero.tsx",
    "src/components/parallax/ParallaxEventLayer.tsx",
    "src/components/parallax/ParticlesCanvas.tsx",
    "src/components/events/EventCard.tsx",
    "src/components/events/EventSection.tsx",
    "src/components/events/EventDetails.tsx",
    "src/components/events/EventRSVP.tsx",
    "src/components/events/LottieIcon.tsx",
    "src/components/countdown/CountdownTimer.tsx",
    "src/components/countdown/FlipUnit.tsx",
    "src/components/gallery/GalleryGrid.tsx",
    "src/components/gallery/GalleryImage.tsx",
    "src/components/gallery/Lightbox.tsx",
    "src/components/invitation/TokenBanner.tsx",
    "src/components/invitation/TokenInput.tsx",
    "src/components/music/BackgroundMusic.tsx",
    "src/components/notifications/NotificationBanner.tsx",
    "src/components/notifications/NotificationToast.tsx",
    "src/components/support/SupportSection.tsx",
    "src/components/admin/AdminLogin.tsx",
    "src/components/admin/AdminDashboard.tsx",
    "src/components/admin/AdminSidebar.tsx",
    "src/components/admin/InvitacionesList.tsx",
    "src/components/admin/InvitacionForm.tsx",
    "src/components/admin/EventosList.tsx",
    "src/components/admin/EventoForm.tsx",
    "src/components/admin/NotificacionesList.tsx",
    "src/components/admin/NotificacionForm.tsx",
    "src/app/[lang]/api/admin/login/route.ts",
    "src/app/[lang]/api/eventos/route.ts",
    "src/app/[lang]/api/eventos/[id]/route.ts",
    "src/app/[lang]/api/invitaciones/route.ts",
    "src/app/[lang]/api/invitaciones/[id]/route.ts",
    "src/app/[lang]/api/invitaciones/token/route.ts",
    "src/app/[lang]/api/asistencias/route.ts",
    "src/app/[lang]/api/notificaciones/route.ts",
    "database/schema.sql",
    "database/seed.sql"
)

Write-Host "`n🔍 Verificando archivos requeridos..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$missing = @()
$found = 0

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        $found++
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        $missing += $file
        Write-Host "  ❌ $file - NO EXISTE" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "📊 RESULTADO: $found de $($requiredFiles.Count) archivos encontrados" -ForegroundColor White

if ($missing.Count -gt 0) {
    Write-Host "`n❌ ARCHIVOS FALTANTES ($($missing.Count)):" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    foreach ($m in $missing) {
        Write-Host "  - $m" -ForegroundColor Yellow
    }
    Write-Host "`n⚠️  Debes crear estos archivos antes de continuar." -ForegroundColor Yellow
    Write-Host "   Revisa los mensajes anteriores donde te proporcioné el código." -ForegroundColor Yellow
} else {
    Write-Host "`n✅ ¡Todos los archivos existen! Puedes continuar con las pruebas." -ForegroundColor Green
}