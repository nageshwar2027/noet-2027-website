"""Django settings for NOET 2027.

The project is intentionally configured so local development works with SQLite
and a local media directory, while production can use Supabase PostgreSQL and
Cloudflare R2 through environment variables.
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def env_bool(name: str, default: bool = False) -> bool:
    return os.environ.get(name, str(default)).strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str, default: str = "") -> list[str]:
    return [item.strip() for item in os.environ.get(name, default).split(",") if item.strip()]


# ---------------------------------------------------------------------------
# Core / security
# ---------------------------------------------------------------------------
DJANGO_SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "")
DEBUG = env_bool("DJANGO_DEBUG", False)

if not DEBUG and not DJANGO_SECRET_KEY:
    raise RuntimeError("DJANGO_SECRET_KEY must be set when DJANGO_DEBUG is False.")

SECRET_KEY = DJANGO_SECRET_KEY or "dev-only-noet-2027-secret-key-change-in-production"

ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")
render_hostname = os.environ.get("RENDER_EXTERNAL_HOSTNAME")
if render_hostname and render_hostname not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(render_hostname)

railway_domain = os.environ.get("RAILWAY_PUBLIC_DOMAIN")
if railway_domain and railway_domain not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(railway_domain)



# ---------------------------------------------------------------------------
# Application definition
# ---------------------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "conference",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "n0et_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "n0et_backend.wsgi.application"

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
# Local development: SQLite. Production: set DATABASE_URL to the Supabase
# PostgreSQL connection string (use the Supabase session pooler for an
# IPv4-only persistent backend when appropriate).
DATABASE_URL = os.environ.get("DATABASE_URL", "")
if DATABASE_URL:
    import dj_database_url

    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
            ssl_require=True,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# ---------------------------------------------------------------------------
# REST API
# ---------------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_THROTTLE_CLASSES": ["rest_framework.throttling.AnonRateThrottle"],
    "DEFAULT_THROTTLE_RATES": {"anon": "60/hour"},
}

# ---------------------------------------------------------------------------
# Password validation
# ---------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# ---------------------------------------------------------------------------
# Internationalization
# ---------------------------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------------------------
# Static files / media
# ---------------------------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# WhiteNoise serves Django admin/static assets. User-uploaded abstracts use
# the default storage below and therefore remain durable in production.
STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# ---------------------------------------------------------------------------
# Cloudflare R2 / S3-compatible Object Storage
# ---------------------------------------------------------------------------
# Supports both R2_* and legacy SUPABASE_STORAGE_* environment variables.
# When configured, Django's FileField stores uploaded abstracts in cloud object
# storage and FileField.url returns a time-limited signed URL.
STORAGE_ACCESS_KEY_ID = os.environ.get("R2_ACCESS_KEY_ID") or os.environ.get("SUPABASE_STORAGE_ACCESS_KEY_ID", "")
STORAGE_SECRET_ACCESS_KEY = os.environ.get("R2_SECRET_ACCESS_KEY") or os.environ.get("SUPABASE_STORAGE_SECRET_ACCESS_KEY", "")
STORAGE_BUCKET = os.environ.get("R2_BUCKET") or os.environ.get("SUPABASE_STORAGE_BUCKET", "")
STORAGE_ENDPOINT_URL = os.environ.get("R2_ENDPOINT_URL") or os.environ.get("SUPABASE_STORAGE_ENDPOINT_URL", "")
STORAGE_REGION = os.environ.get("R2_REGION") or os.environ.get("SUPABASE_STORAGE_REGION", "auto")

USE_REMOTE_STORAGE = all(
    [STORAGE_ACCESS_KEY_ID, STORAGE_SECRET_ACCESS_KEY, STORAGE_BUCKET, STORAGE_ENDPOINT_URL]
)

if USE_REMOTE_STORAGE:
    STORAGES["default"] = {
        "BACKEND": "storages.backends.s3.S3Storage",
    }
    AWS_ACCESS_KEY_ID = STORAGE_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY = STORAGE_SECRET_ACCESS_KEY
    AWS_STORAGE_BUCKET_NAME = STORAGE_BUCKET
    AWS_S3_ENDPOINT_URL = STORAGE_ENDPOINT_URL
    AWS_S3_REGION_NAME = STORAGE_REGION
    AWS_S3_SIGNATURE_VERSION = "s3v4"
    AWS_DEFAULT_ACL = None
    AWS_S3_FILE_OVERWRITE = False
    AWS_QUERYSTRING_AUTH = True
    AWS_QUERYSTRING_EXPIRE = 3600
    AWS_S3_ADDRESSING_STYLE = "path"
else:
    if not DEBUG:
        raise RuntimeError(
            "Production file storage is not configured! Cloudflare R2 / S3 credentials "
            "(R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_ENDPOINT_URL) "
            "must be provided when DJANGO_DEBUG=false to avoid silent data loss on ephemeral storage."
        )
    STORAGES["default"] = {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    }


# ---------------------------------------------------------------------------
# Cross-origin access
# ---------------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,https://noet-2027-website.vercel.app",
)

CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS", "")
if railway_domain:
    csrf_railway = f"https://{railway_domain}"
    if csrf_railway not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(csrf_railway)


# ---------------------------------------------------------------------------
# Email
# ---------------------------------------------------------------------------
EMAIL_BACKEND = os.environ.get(
    "EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend"
)
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", "NOET 2027 <no-reply@example.com>")

# ---------------------------------------------------------------------------
# Production hardening
# ---------------------------------------------------------------------------
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG

SECURE_SSL_REDIRECT = env_bool("DJANGO_SECURE_SSL_REDIRECT", False)

# Optional HSTS. Enable explicitly after the custom domain is on HTTPS.
SECURE_HSTS_SECONDS = int(os.environ.get("DJANGO_HSTS_SECONDS", "0"))
SECURE_HSTS_INCLUDE_SUBDOMAINS = SECURE_HSTS_SECONDS > 0
SECURE_HSTS_PRELOAD = SECURE_HSTS_SECONDS > 0

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
