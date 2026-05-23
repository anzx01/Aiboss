# API Documentation

Base URL defaults to `http://localhost:3001`.

All API routes are under `/api`. The backend creates a lightweight session from
request metadata so task history can be associated with the same client.

## Health Check

```http
GET /health
```

Returns service status, timestamp, and environment.

## Agents

### List Agents

```http
GET /api/agents
```

Returns public agent metadata, input schemas, price labels, and estimated
delivery times. Internal system prompts are not returned.

### Get Agent

```http
GET /api/agents/:id
```

Returns one agent by ID.

Common agent IDs:

- `business-analyst`
- `copywriter`
- `project-assistant`

## Tasks

### Create Task

```http
POST /api/tasks
Content-Type: application/json
```

Request body:

```json
{
  "agent_id": "business-analyst",
  "input_data": {
    "idea": "一个 AI 驱动的健身教练应用",
    "industry": "健康科技"
  }
}
```

Successful response:

```json
{
  "task_id": "task_id",
  "status": "COMPLETED",
  "output_data": {},
  "execution_time": 1234,
  "created_at": "2026-05-23T00:00:00.000Z",
  "completed_at": "2026-05-23T00:00:01.234Z"
}
```

### Get Task

```http
GET /api/tasks/:id
```

Returns one task, including input, output, status, error message, and timestamps.

### List Current Session Tasks

```http
GET /api/tasks?limit=20
```

Returns recent tasks associated with the current session.

### Get Current Session Stats

```http
GET /api/tasks/stats
```

Returns task statistics for the current session.

## Rate Limiting

API routes are rate-limited. Defaults:

- `RATE_LIMIT_WINDOW_MS=3600000`
- `RATE_LIMIT_MAX_REQUESTS=20`

## Error Format

Errors return JSON:

```json
{
  "error": "message"
}
```

## Privacy Note

Task inputs and outputs may be stored in the configured database. Do not submit
credentials, regulated personal data, or confidential business information to a
deployment unless you have reviewed its privacy policy and LLM provider terms.
