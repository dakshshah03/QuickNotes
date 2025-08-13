module.exports = {
  apps : [{
    name   : "backend-api",
    script : "uv",
    args   : "run uvicorn main:app",
    cwd    : "/root/websites/QuickNotes/backend/src"
  },{
    name   : "frontend",
    script : "npm",
    args   : "run start",
    cwd    : "/root/websites/QuickNotes/frontend"
  },{
    name   : "db",
    script : "docker compose -f /root/websites/QuickNotes/docker-compose.yaml up"
  }]
}

