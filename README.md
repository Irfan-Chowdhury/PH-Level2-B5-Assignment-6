<div align="center">

# Digital Wallet API

</div>


## 📘 Project Overview

**Digital Wallet API** is a secure, role-based backend system built with **Node.js**, **Express.js**, **Mongoose**, and **TypeScript**, inspired by services like **bKash** or **Nagad**.

This system enables:

* Users to manage their wallet, top up, withdraw, and send money
* Agents to perform cash-in/out on behalf of users
* Admins to manage users, agents, wallets, transactions, and system states

The architecture emphasizes:

* 🧱 Modular Structure (Controller, Service, Model, Validation, Route)
* 🔐 JWT-based Authentication & Role Authorization
* 🏦 Wallet & Transaction Logic
* 🔁 Atomic Transaction Recording
* 🛡️ Validation via Zod Schemas

---

## 🚀 Roles and Capabilities

| Role      | Capabilities                                                                           |
| --------- | -------------------------------------------------------------------------------------- |
| **User**  | Register, login, manage wallet, add/withdraw/send money, view transaction history      |
| **Agent** | Add money to users (cash-in), withdraw from users (cash-out), create/add to own wallet |
| **Admin** | Manage users, block/unblock wallets, approve/suspend agents, view all transactions     |

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Dev Tools**: Nodemon, ts-node-dev, dotenv

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:Irfan-Chowdhury/PH-Level2-B5-Assignment-5.git
cd PH-Level2-B5-Assignment-5
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file at the root with the following:

```env
PORT=5000
DB_URL=
NODE_ENV=production
EXPRESS_SESSION_SECRET=express-session
FRONTEND_URL=http://localhost:5173

```

### 4. Run the Server

```bash
npm run dev
```

---

<br>

---

## 📁 Folder Structure

```
root/
    ├── dist/
    ├── node_modules/
    ├── src/
        ├── app/
            ├── modules/
            |    ├── auth/
            |    ├── user/
            |    ├── wallet/
            |    └── transaction/
            ├── middlewares/
            ├── config/
            ├── utils/
            ├── app.ts
            ├── server.ts
    ├── .vercel/
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── README.md
    ├── tsconfig.json
    ├── vercel.json
    
```

---

<br>

## ⚙️ Key Features Implemented

* ✅ JWT-based authentication
* ✅ Role-based route protection (user, agent, admin)
* ✅ Wallet auto-creation during registration (initial balance ৳50)
* ✅ Real-time transaction logging (with `from`, `to`, `type`, `status`)
* ✅ Admin controls: block wallets, approve/suspend agents
* ✅ Modular architecture using service-controller pattern
* ✅ Zod-based request validation
* ✅ MongoDB with Mongoose

---

<br>

## 📽️ Demo & Submission

* 🔗 **GitHub Repository**: [Link Here](https://github.com/Irfan-Chowdhury/PH-Level2-B5-Assignment-6)
* 🌐 **Live API Deployment**: [https://digital-wallet-api-blush.vercel.app](https://digital-wallet-api-blush.vercel.app/)
* 🌐 **Frontend**: [https://digital-wallet-iota.vercel.app/](https://digital-wallet-iota.vercel.app//)
* 🔗 **POSTMAN Collection**: [https://drive.google.com/file/d/10SgLgpq7p6xbph76rJvYNSrSBylHKrA9/view?usp=sharing](https://drive.google.com/file/d/10SgLgpq7p6xbph76rJvYNSrSBylHKrA9/view?usp=sharing)
* 🔗 **Video Link**: [https://drive.google.com/file/d/13neXmU2YOuglLU3Zr-jcvJ3QXHYuXNBj/view?usp=sharing](https://drive.google.com/file/d/13neXmU2YOuglLU3Zr-jcvJ3QXHYuXNBj/view?usp=sharing)

---

<br>

## Credentials

### Admin
    
    Email : admin123@gmail.com
    Password: admin123
    
### User
    
    Email : user123@gmail.com
    Password: user123
    
    
### Agent
    
    Email : agent123@gmail.com
    Password: agent123
    
<br>

## 📡 API Endpoints Summary

### 🔐 Auth

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/api/v1/user/register` | Register user or agent      |
| POST   | `/api/v1/auth/login`    | Login and receive JWT token |
| POST   | `/api/v1/auth/logout`    | logout from device |

---

### 👤 User 

| Method | Endpoint                               | Description              |
| ------ | -------------------------------------- | ------------------------ |
| GET    | `/api/v1/user/all-users`           | Get all user details |
| GET    | `/api/v1/user/all-agents`                 | Admin: get all agents    |
| GET  | `/api/v1/user/approve-agent/:agentId` | Admin: Approve agent     |
| GET  | `/api/v1/user/suspend-agent/:agentId` | Admin: Suspend agent     |
| GET  | `/api/v1/user/profile/:userId` | Get User Own Profile     |

---

### 👤 Admin 

| Method | Endpoint                               | Description              |
| ------ | -------------------------------------- | ------------------------ |
| GET    | `/api/v1/admin/dashboard`           | Get all dashboard details |
| GET    | `/api/v1/admin/transactions`           | Get all transaction details |
| GET    | `/api/v1/admin/listings`           | Get all listing details |
---

### 💳 Wallet (User/Agent)

| Method | Endpoint                          | Description                          |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | `/api/v1/wallet/my-wallet`        | Get current user’s wallet            |
| POST   | `/api/v1/wallet/add-money`        | User/Agent: Add money to own wallet  |
| POST   | `/api/v1/wallet/withdraw-money`   | User/Agent: Withdraw from own wallet |
| POST   | `/api/v1/wallet/send-money`       | User: Send money to another user     |
| POST   | `/api/v1/wallet/cash-in`          | Agent: Cash-in (add to user wallet)  |
| POST   | `/api/v1/wallet/cash-out`         | Agent: Cash-out (withdraw from user) |
| GET  | `/api/v1/wallet/block/:id`   | Admin: Block user wallet             |
| GET  | `/api/v1/wallet/unblock/:id` | Admin: Unblock user wallet           |

### 💳 Wallet (Admin)

| Method | Endpoint                          | Description                          |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | `/api/v1/wallet/all`        | Get all users/agents wallet            |
---


### 💰 Transactions (User/Agent)

| Method | Endpoint                   | Description                                  |
| ------ | -------------------------- | -------------------------------------------- |
| GET    | `/api/v1/transaction/my-transactions`  | Get current user/agent’s transaction history |
| GET    | `/api/v1/transaction/all` | Admin: View all transactions                 |
| GET    | `/api/v1/transaction/:id` | Get specific transaction by ID               |

### 💰 Transactions (Admin)

| Method | Endpoint                   | Description                                  |
| ------ | -------------------------- | -------------------------------------------- |
| GET    | `/api/v1/transaction/all` | Admin: View all transactions                 |

---




## 📌 Json Format

### 🔹 1. Register

**POST** `/api/v1/user/register`

#### Request Json
```json
{
    "name":"Shakil Chowdhury",
    "email": "shakil@gmail.com",
    "password" : "shakil123",
    "role":"AGENT",
    "phone" : "0199369876",
    "address" : "Chittagong"
}
```
#### Response Json
```json
{
    "statusCode": 201,
    "success": true,
    "message": "User Created Successfully",
    "data": {
        "name": "Promi Chowdhury",
        "email": "promi@gmail.com",
        "password": "$2b$10$6EG2hdjXYLCkuBWalGcF6uKL1KxxCiuJzkwOs6zrJj1/k7XGZrYbi",
        "role": "AGENT",
        "phone": "01993678742",
        "address": "Chittagong",
        "isDeleted": false,
        "isActive": "ACTIVE",
        "isVerified": false,
        "auths": [
            {
                "provider": "credentials",
                "providerId": "promi@gmail.com"
            }
        ],
        "_id": "688dccc86734417a90edb149",
        "createdAt": "2025-08-02T08:31:04.853Z",
        "updatedAt": "2025-08-02T08:31:04.853Z"
    }
}
```

---

### 🔹 2. Login

**POST** `http://localhost:5000/api/v1/auth/login`

#### Request Body
```json
{
    "email":"admin123@gmail.com",
    "password":"admin123"
}
```
#### Response Json
```json
{
    "statusCode": 200,
    "success": true,
    "message": "User Logged In Successfully",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhkY2EzNjFmMDk4YWFkZTU1MjQyMmUiLCJlbWFpbCI6ImFkbWluMTIzQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1NDEzNTAxOCwiZXhwIjoxNzU0MjIxNDE4fQ.f8K1ZYjWFTax_Yocudkobs-HGHxyx08K97RXVcLfJ1I",
        "user": {
            "_id": "688dca361f098aade552422e",
            "name": "Admin",
            "email": "admin123@gmail.com",
            "role": "ADMIN",
            "phone": "01819057994",
            "address": "Chittagong",
            "isDeleted": false,
            "isActive": "ACTIVE",
            "isVerified": false,
            "createdAt": "2025-08-02T08:20:06.183Z",
            "updatedAt": "2025-08-02T08:20:06.183Z"
        }
    }
}
```
---

### 🔹 3. Add Money

**POST** `/api/v1/wallet/add-money`

#### Request Body

```json
{
      "amount": 70
}
```
#### Response

```json
{
    "statusCode": 200,
    "success": true,
    "message": "Money added successfully",
    "data": {
        "wallet": {
            "_id": "688a7f9c50c14c78fcc4395c",
            "user": "688a05e6b48f9a811277269e",
            "balance": 3050,
            "isBlocked": false,
            "createdAt": "2025-07-30T20:25:00.229Z",
            "updatedAt": "2025-08-02T06:16:13.039Z",
            "__v": 0
        },
        "transaction": {
            "user": "688a05e6b48f9a811277269e",
            "from": "external-source",
            "to": "688a05e6b48f9a811277269e",
            "amount": 70,
            "type": "add-money",
            "status": "success",
            "_id": "688dad2d09aae22fef7a776d",
            "timestamp": "2025-08-02T06:16:13.137Z",
            "createdAt": "2025-08-02T06:16:13.137Z",
            "updatedAt": "2025-08-02T06:16:13.137Z",
            "__v": 0
        }
    }
}
```
### 🔹 4. Send Money

**POST** `/api/v1/wallet/send-money`

#### Request Body

```json
{
      "amount": 70
}
```
#### Response

```json
{
    "statusCode": 200,
    "success": true,
    "message": "Money added successfully",
    "data": {
        "wallet": {
            "_id": "688a7f9c50c14c78fcc4395c",
            "user": "688a05e6b48f9a811277269e",
            "balance": 3050,
            "isBlocked": false,
            "createdAt": "2025-07-30T20:25:00.229Z",
            "updatedAt": "2025-08-02T06:16:13.039Z",
            "__v": 0
        },
        "transaction": {
            "user": "688a05e6b48f9a811277269e",
            "from": "external-source",
            "to": "688a05e6b48f9a811277269e",
            "amount": 70,
            "type": "add-money",
            "status": "success",
            "_id": "688dad2d09aae22fef7a776d",
            "timestamp": "2025-08-02T06:16:13.137Z",
            "createdAt": "2025-08-02T06:16:13.137Z",
            "updatedAt": "2025-08-02T06:16:13.137Z",
            "__v": 0
        }
    }
}
```

### 🔹 5. Withdraw Money

**POST** `/api/v1/wallet/withdraw-money`

#### Request Body

```json
{
      "amount": 70
}
```
#### Response

```json
{
    "statusCode": 200,
    "success": true,
    "message": "Money withdrawn successfully",
    "data": {
        "withdrawInfo": {
            "user": "688a05e6b48f9a811277269e",
            "wallet": "688a7f9c50c14c78fcc4395c",
            "transaction": "688db73eac321c79c8b0c267",
            "type": "withdraw-money",
            "withdrawAmount": 50,
            "RemainingBalance": 2900,
            "from": "688a05e6b48f9a811277269e",
            "to": "external-source",
            "timestamp": "2025-08-02T06:59:10.339Z"
        }
    }
}
```

---

### 🔹 6. Cash IN

**POST** `/api/v1/wallet/cash-in`

#### Request Body

```json
{
   "amount": 50,
   "receiverPhone": "01819057993"
}
```

### 🔹 7. Cash Out

**POST** `/api/v1/wallet/cash-out`

#### Request Body

```json
{
  "amount": 50,
  "userPhone": "01829498634"
}
```
---

## ✅ Author

**Name :** Md Irfan Chowdhury <br>
**Email** irfanchowdhury80@gmail.com.com <br>
**LinkedIn** : https://linkedin.com/in/your-profile <br>

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

