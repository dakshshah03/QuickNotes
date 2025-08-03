POSTGRES="docker compose up"
FRONTEND="cd frontend && npm run dev"
BACKEND="cd backend/src && uv run uvicorn main:app --reload"

tmux new-session -d -s quicknotes

tmux new-window -t quicknotes:1 -n frontend
tmux send-keys -t quicknotes:1.0 "$POSTGRES" C-m

tmux new-window -t quicknotes:2 -n frontend
tmux send-keys -t quicknotes:2.0 "$FRONTEND" C-m

tmux new-window -t quicknotes:3 -n backend
tmux send-keys -t quicknotes:3.0 "$BACKEND" C-m

tmux select-window -t quicknotes:0
tmux select-pane -t quicknotes:0.0