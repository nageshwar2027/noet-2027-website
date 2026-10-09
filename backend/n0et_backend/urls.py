from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static


def health(request):
    data = {"status": "ok"}
    if request.GET.get("db") == "1":
        try:
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1;")
                cursor.fetchone()
            data["database"] = "ok"
        except Exception:
            data["status"] = "degraded"
            data["database"] = "unavailable"
            return JsonResponse(data, status=503)
    return JsonResponse(data)


urlpatterns = [
    path("health/", health, name="health"),
    path("admin/", admin.site.urls),
    path("api/", include("conference.urls")),
]

# Local development fallback for user-uploaded files. In production, R2 is
# used instead and Django should not serve uploads from the app filesystem.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
