# MT1-LABEXAM – Vehicle Management Web Application

Full Stack Development – Node.js Lab Examination.

- **Part A** – `httpServer.js`: plain Node.js `http` + `fs` modules (port 3000, no Express)
- **Part B** – `expressApp.js`: Express.js REST API (port 4000)
- No database: vehicle records live in a JavaScript array.

## Setup

```bash
npm install
```

## Run

```bash
node httpServer.js     # HTTP Server running at http://localhost:3000
node expressApp.js     # Express Server running at http://localhost:4000
```

## Project Structure

```
MT1-LABEXAM/
|-- package.json
|-- httpServer.js
|-- expressApp.js
|-- public/
|   `-- info.html
`-- screenshots/
```

## Part A Routes (http://localhost:3000)

| Method | Route | Response |
|--------|-------|----------|
| GET | `/` | Welcome page (HTML) |
| GET | `/vehicles` | All vehicles (JSON) |
| GET | `/about` | Application information (JSON) |
| GET | `/info` | `public/info.html` served with `fs.readFile()` (500 if unreadable) |
| POST | `/add-vehicle` | Adds a vehicle (201), 400 for invalid JSON / missing fields |
| any | other | 404 |

## Part B API (http://localhost:4000)

| Method | Endpoint | Functionality | Status codes |
|--------|----------|---------------|--------------|
| GET | `/vehicles` | Retrieve all vehicles | 200 |
| GET | `/vehicles/:id` | Retrieve vehicle by ID | 200, 404 |
| POST | `/vehicles` | Add a new vehicle | 201, 400 |
| PUT | `/vehicles/:id` | Update vehicle details | 200, 400, 404 |
| DELETE | `/vehicles/:id` | Delete a vehicle | 200, 404 |

Validation: all fields are required and `price` must be a positive number (400 otherwise).

### Sample POST body (Postman: Body -> raw -> JSON)

```json
{
  "id": 4,
  "vehicleName": "Maruti Swift",
  "vehicleNumber": "DL8CAF5030",
  "type": "Hatchback",
  "price": 750000
}
```

### Sample PUT body (`PUT /vehicles/1`)

```json
{
  "vehicleName": "Hyundai Creta SX",
  "vehicleNumber": "HR26AB1234",
  "type": "SUV",
  "price": 1650000
}
```

## Screenshots

Place the submission screenshots in `screenshots/`: HTTP server running, `/info`, and Postman GET / POST / PUT / DELETE.
