// Part B: Vehicle Management REST API using Express.js
import express from 'express';

const PORT = 4000;

// B1: create the Express app and JSON body parsing middleware
const app = express();
app.use(express.json());

// B1: in-memory array with sample vehicle records (no database)
let vehicles = [
  { id: 1, vehicleName: 'Hyundai Creta', vehicleNumber: 'HR26AB1234', type: 'SUV', price: 1500000 },
  { id: 2, vehicleName: 'Honda City', vehicleNumber: 'DL3CAB5678', type: 'Sedan', price: 1200000 },
  { id: 3, vehicleName: 'Tata Nexon', vehicleNumber: 'UP14CD9012', type: 'SUV', price: 1100000 }
];

const REQUIRED_FIELDS = ['id', 'vehicleName', 'vehicleNumber', 'type', 'price'];

// Returns an error message string if the vehicle data is invalid, otherwise null
const validateVehicle = (data, requireId = true) => {
  const fields = requireId ? REQUIRED_FIELDS : REQUIRED_FIELDS.filter((field) => field !== 'id');
  const body = data && typeof data === 'object' ? data : {};

  const missingFields = fields.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ''
  );
  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`;
  }

  // B4: price must be a positive number
  if (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price <= 0) {
    return 'Price must be a positive number';
  }
  return null;
};

// GET /vehicles - retrieve all vehicles
app.get('/vehicles', (req, res) => {
  res.status(200).json(vehicles);
});

// GET /vehicles/:id - retrieve vehicle by ID
app.get('/vehicles/:id', (req, res) => {
  const vehicle = vehicles.find((item) => item.id === Number(req.params.id));
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.status(200).json(vehicle);
});

// POST /vehicles - add a new vehicle
app.post('/vehicles', (req, res) => {
  const errorMessage = validateVehicle(req.body);
  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }

  const { id, vehicleName, vehicleNumber, type, price } = req.body;
  if (vehicles.some((item) => item.id === id)) {
    return res.status(400).json({ error: `Vehicle with id ${id} already exists` });
  }

  const newVehicle = { id, vehicleName, vehicleNumber, type, price };
  vehicles.push(newVehicle);
  res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
});

// PUT /vehicles/:id - update vehicle details
app.put('/vehicles/:id', (req, res) => {
  const vehicle = vehicles.find((item) => item.id === Number(req.params.id));
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  const errorMessage = validateVehicle(req.body, false);
  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }

  // The id comes from the route and is never changed
  const { vehicleName, vehicleNumber, type, price } = req.body;
  Object.assign(vehicle, { vehicleName, vehicleNumber, type, price });
  res.status(200).json({ message: 'Vehicle updated successfully', vehicle });
});

// DELETE /vehicles/:id - delete a vehicle
app.delete('/vehicles/:id', (req, res) => {
  const index = vehicles.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  const [deletedVehicle] = vehicles.splice(index, 1);
  res.status(200).json({ message: 'Vehicle deleted successfully', vehicle: deletedVehicle });
});

// Invalid routes -> 404 JSON
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler: malformed JSON bodies -> 400, anything else -> 500
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
