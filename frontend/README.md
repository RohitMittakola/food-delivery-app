# BroBite – Setup Instructions

##Prerequisites

- Install Node.js (v18+)
- Install MySQL (v8+)

---

## Database Setup

1. Open MySQL and run:

```sql
CREATE DATABASE food_delivery;
USE food_delivery;
```

---

##Backend Setup

1. Navigate to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

- Open `backend/.env`
- Add your MySQL credentials (username, password, database name)

4. Start backend server:

```bash
npm start
```

After starting, tables will be automatically created in the database (Sequelize sync)

---

## Frontend Setup

1. Navigate to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the frontend:

```bash
npm run dev
```

---

##Access the App

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

##Notes

- Make sure MySQL is running before starting backend
- After backend starts, refresh your DB schema to see tables
- Backend auto-creates tables using Sequelize
