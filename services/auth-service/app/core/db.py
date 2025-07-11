from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import sessionmaker # Corrected import for sessionmaker with AsyncSession
from app.core.config import async_engine # Import the async_engine

# Create a sessionmaker for AsyncSession
# expire_on_commit=False is generally recommended for FastAPI use with async sessions
AsyncSessionLocal = sessionmaker(
    bind=async_engine, class_=AsyncSession, expire_on_commit=False
)

async def get_async_session() -> AsyncSession:
    """
    Dependency to get an asynchronous database session.
    """
    async with AsyncSessionLocal() as session:
        yield session
