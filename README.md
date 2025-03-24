# Cryptocurrency Exchange Backend

This is a Node.js-based backend for a cryptocurrency exchange system. The backend handles user management, wallet operations, and transaction processing, with support for fiat currencies (THB, USD) and cryptocurrency transfers.

## Features

- User registration and authentication
- Wallet creation and management
- Fiat (THB, USD) and cryptocurrency transfers (internal and external)
- Transaction history tracking
- API integration for external cryptocurrency exchanges

## Tech Stack

- **Node.js**: Backend runtime
- **Express.js**: Web framework
- **OracleDB**: Database for storing user, wallet, and transaction information
- **dotenv**: Environment variable management

## Database Structure

The system uses the following main tables:

1. **Users**: Stores user account details.  
2. **Wallets**: Tracks user wallets and balances.  
3. **Transactions**: Records all fiat/cryptocurrency transfers.

### Create the Schema and Tables
Run the following SQL commands to create the database schema and required tables:

```sql
-- Create Users table
CREATE TABLE Users (
    userId VARCHAR2(50) PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    password VARCHAR2(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Wallets table
CREATE TABLE Wallets (
    walletId VARCHAR2(50) PRIMARY KEY,
    userId VARCHAR2(50) NOT NULL,
    currency VARCHAR2(10) NOT NULL,
    balance NUMBER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId)
);

-- Create Transactions table
CREATE TABLE Transactions (
    transactionId VARCHAR2(50) PRIMARY KEY,
    fromWalletId VARCHAR2(50),
    toWalletId VARCHAR2(50),
    amount NUMBER NOT NULL,
    currency VARCHAR2(10) NOT NULL,
    transactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fromWalletId) REFERENCES Wallets(walletId),
    FOREIGN KEY (toWalletId) REFERENCES Wallets(walletId)
);

```

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14+)
- [OracleDB Client](https://www.oracle.com/database/technologies/) or Oracle Instant Client
- npm or yarn package manager

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/cryptocurrency-exchange-backend.git
   cd cryptocurrency-exchange-backend
    ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize Oracle SQL pool
   ```js
   const dbConfig = {
    user: 'your_oracle_db_username',
    password: 'your_oracle_db_password',
    connectString: 'your_oracle_db_connection_string', 
   };
   ```
4. Run the server:
   ```bash
    npm start
   ```
The server will run at http://localhost:3000


## Testing the API

Once the server is running at `http://localhost:3000`, you can use tools like [Postman](https://www.postman.com/) or `curl` to test the API endpoints.

### API Examples
#### 1. **Register a New User**
- curl Command:
   ```bash
   curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d "{\"username\": \"testuser1\", \"email\": \"test1@example.com\", \"password\": \"hashed_password_1\", \"fiat_balance\": 1000.0}"
   ```

 <p align="center"><img src = "https://github.com/user-attachments/assets/6d840d3e-f12b-4c02-b5cb-6ef46ebbdf70"> </p>  

- Postman Example:
  - Method: POST
  - URL: http://localhost:3000/api/register
  - In the Body tab, select raw and set it to JSON, then enter the following:
  ```json
  {
  "username": "example",
  "password": "password123",
  "email": "test1@example.com",
  "fiat_balance": 1000.0
  }

  ```

##  Future Enhancements
- Add OAuth for user authentication

- Implement real-time transaction tracking using WebSockets

- Add support for additional cryptocurrencies

- Integrate external APIs for market data
