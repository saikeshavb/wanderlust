# Wanderlust Performance Baseline

## Purpose

This directory contains performance experiments for the Wanderlust application.

The workflow is:

1. Measure the current application.
2. Identify the bottleneck using evidence.
3. Apply one focused change.
4. Measure again.
5. Compare the results.

No caching, Redis, load balancing, or infrastructure scaling has been added yet.

## Test Environment

- Application: Wanderlust
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Load-testing tool: k6
- Target endpoint: `GET /listings`
- Application URL: `http://localhost:8080`
- Endpoint type: Read-only listing page
- Payment routes: Not included in this baseline

## Baseline Test Profile

The official baseline used a k6 `ramping-vus` scenario:

| Stage        | Duration   | Target VUs |
|---           |---:        |---:        |
| Ramp up      | 10 seconds | 10         |
| Steady state | 20 seconds | 10         |
| Ramp up      | 10 seconds | 25         |
| Steady state | 30 seconds | 25         |
| Ramp up      | 10 seconds | 50         |
| Steady state | 30 seconds | 50         |

The application was run with:

```bash
node app.js
