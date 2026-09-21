from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    anthropic_api_key: str = ""
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    admin_password: str = ""
    jwt_secret: str = "dev-secret-change-in-production"
    environment: str = "development"

    class Config:
        env_file = ".env"

    @property
    def supabase_configured(self) -> bool:
        return bool(self.supabase_url and self.supabase_service_role_key)


settings = Settings()
