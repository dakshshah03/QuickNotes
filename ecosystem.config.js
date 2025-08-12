module.exports = {
  apps : [{
    name   : "backend-api",
    script : "uv run uvicorn",
    args   : "main:app",
    cwd    : "/root/websites/QuickNotes/backend",
  },{
    name   : "frontend",
    script : "npm run",
    args   : "start",
    cwd    : "/root/websites/QuickNotes/frontend",
  },{
    name   : "db",
    script : "docker compose up",
    args   : "-f",
    cwd    : "/root/websites/QuickNotes/docker-compose.yaml",
  }]
}