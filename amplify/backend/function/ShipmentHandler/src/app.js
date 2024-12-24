import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import bodyParser from 'body-parser';
import express from 'express';

// Create DynamoDB client
const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// Define the table name, can be appended with the environment
let tableName = "Shipment";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Convert URL type to proper data type
const convertUrlType = (param, type) => {
  switch (type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
};

/****************************************
 * HTTP POST method to create Shipment *
 ****************************************/

app.post('/shipments', async function (req, res) {
  const { pickup, delivery, status } = req.body;

  const shipment = {
    id: new Date().toISOString(),
    pickup,
    delivery,
    status
  };

  const params = {
    TableName: tableName,
    Item: shipment
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    res.json({
      success: true,
      message: 'Shipment created successfully',
      shipment: shipment
    });
  } catch (err) {
    res.status(500).json({ error: 'Error creating shipment: ' + err.message });
  }
});

/***************************************
 * HTTP GET method to list all Shipments *
 ***************************************/

app.get('/shipments', async function (req, res) {
  const params = {
    TableName: tableName
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching shipments: ' + err.message });
  }
});

/****************************************
 * HTTP PUT method to update Shipment *
 ****************************************/

app.put('/shipments/:id', async function (req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const params = {
    TableName: tableName,
    Key: { id },
    UpdateExpression: 'SET #status = :status',
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':status': status
    }
  };

  try {
    await ddbDocClient.send(new UpdateCommand(params));
    res.json({
      success: true,
      message: 'Shipment status updated successfully',
      id,
      status
    });
  } catch (err) {
    res.status(500).json({ error: 'Error updating shipment status: ' + err.message });
  }
});

/***************************************
 * HTTP GET method for fetching a single Shipment *
 ***************************************/

app.get('/shipments/:id', async function (req, res) {
  const { id } = req.params;
  
  const params = {
    TableName: tableName,
    Key: { id }
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    if (data.Item) {
      res.json(data.Item);
    } else {
      res.status(404).json({ error: 'Shipment not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving shipment: ' + err.message });
  }
});

/*********************
 * Lambda Handler *
 *********************/

exports.handler = async (event) => {
  const { httpMethod, pathParameters, body } = event;
  switch (httpMethod) {
    case 'POST': {
      const shipmentData = JSON.parse(body);
      const { pickup, delivery, status } = shipmentData;
      const shipment = {
        id: new Date().toISOString(),
        pickup,
        delivery,
        status
      };
      const params = {
        TableName: tableName,
        Item: shipment
      };
      try {
        await ddbDocClient.send(new PutCommand(params));
        return {
          statusCode: 201,
          body: JSON.stringify({
            message: 'Shipment created successfully',
            shipment
          })
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: 'Error creating shipment',
            error
          })
        };
      }
    }

    case 'GET': {
      const params = {
        TableName: tableName
      };

      try {
        const result = await ddbDocClient.send(new ScanCommand(params));
        return {
          statusCode: 200,
          body: JSON.stringify(result.Items)
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: 'Error fetching shipments',
            error
          })
        };
      }
    }

    case 'PUT': {
      const { id } = pathParameters;
      const { status } = JSON.parse(body);

      const params = {
        TableName: tableName,
        Key: { id },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': status }
      };

      try {
        await ddbDocClient.send(new UpdateCommand(params));
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Shipment status updated successfully'
          })
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: 'Error updating shipment status',
            error
          })
        };
      }
    }

    default:
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' })
      };
  }
};
