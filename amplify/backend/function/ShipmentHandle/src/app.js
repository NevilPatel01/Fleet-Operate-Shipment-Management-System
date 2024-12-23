/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Parse incoming JSON requests

// Sample in-memory shipment data (replace with database later)
let shipments = [
  { id: 1, description: 'Shipment 1', status: 'In Transit' },
  { id: 2, description: 'Shipment 2', status: 'Delivered' },
];

// GET all shipments
app.get('/shipment', (req, res) => {
  res.status(200).json({ shipments });
});

// GET a specific shipment by ID
app.get('/shipment/:id', (req, res) => {
  const shipmentId = parseInt(req.params.id);
  const shipment = shipments.find(s => s.id === shipmentId);

  if (!shipment) {
    return res.status(404).json({ message: 'Shipment not found' });
  }
  res.status(200).json({ shipment });
});

// POST to create a new shipment
app.post('/shipment', (req, res) => {
  const newShipment = { id: shipments.length + 1, ...req.body };
  shipments.push(newShipment);
  res.status(201).json({ message: 'Shipment created', shipment: newShipment });
});

// PUT to update an existing shipment
app.put('/shipment/:id', (req, res) => {
  const shipmentId = parseInt(req.params.id);
  const shipmentIndex = shipments.findIndex(s => s.id === shipmentId);

  if (shipmentIndex === -1) {
    return res.status(404).json({ message: 'Shipment not found' });
  }
  
  shipments[shipmentIndex] = { ...shipments[shipmentIndex], ...req.body };
  res.status(200).json({ message: 'Shipment updated', shipment: shipments[shipmentIndex] });
});

// DELETE a shipment
app.delete('/shipment/:id', (req, res) => {
  const shipmentId = parseInt(req.params.id);
  shipments = shipments.filter(s => s.id !== shipmentId);
  
  res.status(200).json({ message: 'Shipment deleted' });
});

module.exports = app;
