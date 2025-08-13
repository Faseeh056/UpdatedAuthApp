# Docker Database Setup

This Docker Compose configuration sets up a PostgreSQL database for the Authentication App.

## Services

### PostgreSQL Database
- **Image**: `postgres:15-alpine`
- **Port**: `5432`
- **Database**: `auth_app_db`
- **Username**: `Login`
- **Password**: `faseeh565`

### pgAdmin (Optional)
- **Port**: `5050`
- **Email**: `admin@authapp.com`
- **Password**: `admin123`

## Quick Start

1. **Start the database:**
   ```bash
   docker-compose up -d
   ```

2. **Stop the database:**
   ```bash
   docker-compose down
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f postgres
   ```

4. **Reset database (removes all data):**
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=Login
DB_PASSWORD=faseeh565
DB_NAME=auth_app_db

# Email Configuration (for password reset, verification, etc.)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Auth Configuration
AUTH_SECRET=your-auth-secret-key-here
AUTH_URL=http://localhost:5173

# Optional: Database URL (alternative to individual config)
DATABASE_URL=postgresql://Login:faseeh565@localhost:5432/auth_app_db
```

## Database Management

### Access pgAdmin
1. Open your browser and go to `http://localhost:5050`
2. Login with:
   - Email: `admin@authapp.com`
   - Password: `admin123`
3. Add a new server connection:
   - Host: `postgres` (container name)
   - Port: `5432`
   - Database: `auth_app_db`
   - Username: `Login`
   - Password: `faseeh565`

### Run Migrations
After starting the database, run the migrations:

```bash
npm run db:migrate
```

### Generate New Migrations
```bash
npm run db:generate
```

## Data Persistence

The database data is stored in a Docker volume named `postgres_data`. This ensures your data persists between container restarts.

## Health Checks

The PostgreSQL service includes health checks to ensure the database is ready before accepting connections.

## Troubleshooting

### Port Already in Use
If port 5432 is already in use, modify the ports section in `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Use 5433 instead of 5432
```

### Permission Issues
If you encounter permission issues on Windows, ensure Docker Desktop has access to the project directory.

### Database Connection Issues
1. Check if the containers are running: `docker-compose ps`
2. Check logs: `docker-compose logs postgres`
3. Ensure the database is ready: `docker-compose exec postgres pg_isready -U Login -d auth_app_db`

