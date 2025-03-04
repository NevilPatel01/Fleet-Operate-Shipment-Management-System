# 🚚 Shipment Management System

The **Shipment Management System** is a comprehensive platform designed to streamline and optimize trucking business operations. It provides a robust solution for managing shipments, enabling dispatchers to efficiently create, track, and update shipments. Built with modern technologies and best practices, this system ensures scalability, reliability, and maintainability.

---

## 🌟 Key Features

- **Shipment Creation**: Dispatchers can create shipments with detailed pickup and delivery information.
- **Shipment Tracking**: View all shipments in a table sorted by pickup date.
- **Status Updates**: Easily update the status of shipments (e.g., Created, Dispatched, OnTheWay, Delivered).
- **Angular Reactive Forms**: Shipment creation is implemented using Angular Reactive Forms for a seamless user experience.
- **Angular Material UI**: A clean and intuitive user interface built with Angular Material.
- **Unit Testing**: All logic functions are thoroughly tested with unit tests.
- **End-to-End Testing**: Automated end-to-end tests using **Cypress** to validate user workflows.
- **Backend Integration**: RESTful APIs hosted on AWS with API Gateway, Lambda, and DynamoDB for data storage.

---

## 🛠️ Technologies Used

### Frontend
- **Angular**: A powerful framework for building dynamic web applications.
- **Angular Material**: UI component library for Angular.
- **Angular Reactive Forms**: For handling complex forms and validations.
- **Cypress**: For end-to-end testing.

### Backend
- **AWS API Gateway**: To host RESTful endpoints.
- **AWS Lambda**: Serverless functions to handle API requests.
- **DynamoDB**: NoSQL database for storing and retrieving shipment data.
- **Node.js**: Runtime environment for backend logic.

---

## 📂 Project Structure

### Frontend
- **Shipment Creation**: Implemented using Angular Reactive Forms.
- **Shipment Table**: Displays all shipments sorted by pickup date.
- **Status Update**: Allows dispatchers to update the status of shipments.

### Backend
- **API Gateway**: Hosts RESTful endpoints for shipment operations.
- **Lambda Functions**: Handles CRUD operations for shipments.
- **DynamoDB**: Stores shipment data with high scalability and performance.

---

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed.
- Angular CLI installed globally.
- AWS account for backend deployment.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/NevilPatel01/shipment-management-system.git
   ```

2. **Access Folder**
   ```bash
   cd shipment-management-system
   ```

3. Install Dependencies:
    ```bash
    npm install
    ```

4. Run the Application:
    ```bash
    ng serve
    ```
Open your browser and navigate to `http://localhost:4200`.

5. Run Unit Tests:
    ```bash
    ng test
    ```

6. Run End-to-End Tests:
    ```bash
    npx cypress open
    ```

## 🧪 Testing

### Unit Tests
- All logic functions are covered with unit tests using Jasmine and Karma.

### End-to-End Tests
- Automated tests using Cypress to simulate user interactions and validate workflows.

## 🚧 Future Enhancements

- Authentication: Add user authentication and authorization.
- Notifications: Implement real-time notifications for shipment status updates.
- Analytics Dashboard: Provide insights into shipment performance and trends.

