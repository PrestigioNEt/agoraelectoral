import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine

# Import the app and other components from main
from app.main import app, get_current_user_id, Profile

# Mock user ID for authenticated requests
FAKE_USER_ID = "user-123-test"

# Override the dependency for getting the current user
def override_get_current_user_id():
    return FAKE_USER_ID

app.dependency_overrides[get_current_user_id] = override_get_current_user_id

@pytest.fixture(name="session")
def session_fixture(monkeypatch):
    """
    Pytest fixture to create a temporary in-memory SQLite database for each test.
    It uses monkeypatch to replace the original engine.
    """
    # Create an in-memory SQLite database
    sqlite_url = "sqlite:///./test.db"
    test_engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
    
    # Monkeypatch the engine used by the application
    monkeypatch.setattr("app.main.engine", test_engine)

    # Create tables
    SQLModel.metadata.create_all(test_engine)
    
    # Yield a session
    with Session(test_engine) as session:
        yield session
    
    # Drop tables after test
    SQLModel.metadata.drop_all(test_engine)

@pytest.fixture(name="client")
def client_fixture():
    """
    Pytest fixture to create a TestClient for the FastAPI app.
    """
    return TestClient(app)

def test_read_root(client: TestClient):
    """
    Test the root endpoint.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Auth Service is running"}

def test_read_me_profile_not_found(client: TestClient):
    """
    Test that a 404 is returned if the user profile does not exist.
    """
    response = client.get("/api/v1/users/me")
    assert response.status_code == 404
    assert response.json() == {"detail": "User profile not found"}

def test_read_me_profile_found(client: TestClient, session: Session):
    """
    Test successfully retrieving the current user's profile.
    """
    # Create a profile in the test database
    test_profile = Profile(
        id=FAKE_USER_ID,
        username="testuser",
        full_name="Test User",
        role="admin"
    )
    session.add(test_profile)
    session.commit()

    response = client.get("/api/v1/users/me")
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == FAKE_USER_ID
    assert data["username"] == "testuser"
    assert data["full_name"] == "Test User"
    assert data["role"] == "admin"