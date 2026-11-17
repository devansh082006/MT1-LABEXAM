// Part A: Vehicle Management - HTTP module server (no Express)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INFO_FILE_PATH = path.join(__dirname, 'public', 'info.html');

// In-memory storage (no database)
const vehicles = [
  { id: 1, vehicleName: 'Hyundai Creta', vehicleNumber: 'HR26AB1234', type: 'SUV', price: 1500000 },
  { id: 2, vehicleName: 'Honda City', vehicleNumber: 'DL3CAB5678', type: 'Sedan', price: 1200000 },
  { id: 3, vehicleName: 'Tata Nexon', vehicleNumber: 'UP14CD9012', type: 'SUV', price: 1100000 }
];

const REQUIRED_FIELDS = ['id', 'vehicleName', 'vehicleNumber', 'type', 'price'];

// Helper: send a JSON response
const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
};

// Helper: send an HTML response
const sendHtml = (res, statusCode, html) => {
  res.writeHead(statusCode, { 'Content-Type': 'text/html' });
  res.end(html);
};

// A1/A3: handle POST /add-vehicle
const handleAddVehicle = (req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let newVehicle;

    // A5: invalid JSON -> 400
    try {
      newVehicle = JSON.parse(body);
    } catch (error) {
      return sendJson(res, 400, { error: 'Invalid JSON in request body' });
    }

    // A5: missing required fields -> 400
    const missingFields = REQUIRED_FIELDS.filter(
      (field) => newVehicle === null || typeof newVehicle !== 'object' ||
                 newVehicle[field] === undefined || newVehicle[field] === ''
    );
    if (missingFields.length > 0) {
      return sendJson(res, 400, {
        error: 'Missing required fields',
        missingFields
      });
    }

    const { id, vehicleName, vehicleNumber, type, price } = newVehicle;
    const record = { id, vehicleName, vehicleNumber, type, price };
    vehicles.push(record);

    sendJson(res, 201, { message: 'Vehicle added successfully', vehicle: record });
  });

  req.on('error', () => {
    sendJson(res, 400, { error: 'Error reading request body' });
  });
};

// A4: serve public/info.html using fs.readFile()
const serveInfoPage = (res) => {
  fs.readFile(INFO_FILE_PATH, (err, content) => {
    if (err) {
      return sendHtml(res, 500, '<h1>500 - Internal Server Error</h1><p>Unable to read info.html</p>');
    }
    sendHtml(res, 200, content);
  });
};

// A1: create the HTTP server
const server = http.createServer((req, res) => {
  const { method } = req;
  const pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;

  // A2/A3: routing
  if (method === 'GET' && pathname === '/') {
    sendHtml(
      res,
      200,
      '<h1>Welcome to Vehicle Management Application</h1>' +
      '<p>Built with the Node.js HTTP module.</p>' +
      '<ul>' +
      '<li><a href="/vehicles">/vehicles</a></li>' +
      '<li><a href="/about">/about</a></li>' +
      '<li><a href="/info">/info</a></li>' +
      '</ul>'
    );
  } else if (method === 'GET' && pathname === '/vehicles') {
    sendJson(res, 200, vehicles);
  } else if (method === 'GET' && pathname === '/about') {
    sendJson(res, 200, {
      application: 'Vehicle Management Web Application',
      description: 'Maintains vehicle records using the Node.js HTTP module and Express.js',
      technologies: ['Node.js', 'HTTP Module', 'FS Module', 'Express.js'],
      database: 'None (JavaScript array)'
    });
  } else if (method === 'GET' && pathname === '/info') {
    serveInfoPage(res);
  } else if (method === 'POST' && pathname === '/add-vehicle') {
    handleAddVehicle(req, res);
  } else {
    // A5: invalid route -> 404
    sendJson(res, 404, { error: 'Route not found' });
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
