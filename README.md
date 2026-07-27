# 🍔 BroBite - Full-Stack Food Delivery Platform

BroBite is a modern, responsive, and robust full-stack e-commerce application designed to streamline food ordering and delivery. It features secure JWT authentication, dynamic cart management, and real-time order tracking using geospatial mapping. 

## 🚀 Live Features

### For Users
* **Secure Authentication:** Registration and login system secured with JSON Web Tokens (JWT) and HMAC-SHA256 cryptography.
* **Smart Menu & Cart:** Browse dynamic categories, view nutritional information, and add items to a persistent cart without page reloads.
* **Live Order Tracking:** Interactive 2D map visualization (via React-Leaflet) that projects the delivery route from the kitchen to the user's location.

### For Administrators
* **Role-Based Dashboard:** Protected routes ensuring only authenticated admins can access inventory and order management.
* **Dynamic Menu Management:** Perform CRUD operations to instantly update food items, categories, and prices across the platform.
* **Order Processing:** Real-time interface to accept, update, and manage incoming customer orders (Pending ➔ Approved ➔ Delivered).

## 💻 Tech Stack & Architecture

This project utilizes a decoupled client-server architecture to ensure high performance and scalability.

**Frontend (Client-Side)**
* **React.js (Vite):** Chosen for lightning-fast Hot Module Replacement (HMR) and a reusable component-based UI.
* **Tailwind CSS:** Utility-first styling for a fully responsive, mobile-first design.
* **React-Leaflet:** Open-source geospatial coordinate mapping for real-time delivery visualization.

**Backend (Server-Side)**
* **Node.js & Express.js:** Asynchronous, non-blocking RESTful API handling concurrent user requests and routing.
* **Sequelize (ORM):** Object-Relational Mapper used to define strict data models, handle complex table associations, and prevent SQL injection attacks.
* **MySQL:** Centralized relational database ensuring strict data integrity and ACID compliance for financial/order transactions.

## ⚙️ Local Installation & Setup

To run this project locally, you will need Node.js and MySQL installed on your machine.

**1. Clone the repository**
```bash
git clone [https://github.com/RohitMittakola/food-delivery-app.git](https://github.com/RohitMittakola/food-delivery-app.git)
cd food-delivery-app

2. Setup the Backend

Bash
cd backend
npm install
Create a .env file in the backend directory and add your MySQL database credentials and a secure JWT_SECRET.

Start the backend server:

Bash
npm run dev
3. Setup the Frontend

Bash
cd frontend
npm install
npm run dev
The application will now be running concurrently. The React frontend will be accessible at http://localhost:5173 and the Express API will be listening on http://localhost:5000.

👨‍💻 Author
Rohit Srinivas Master of Computer Applications (MCA)
