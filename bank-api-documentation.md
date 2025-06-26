# Bank Backend API Documentation

## Overview

The Bank Backend API is a RESTful service that provides comprehensive banking functionality. This API simulates a real banking system with demo data and supports various banking operations including account management, transactions, transfers, and account statements.

**Base URL**: `https://cursorworkshopserver.onrender.com`  
**Version**: 1.0.0

## Authentication

Currently, this API does not require authentication for demo purposes. All endpoints are publicly accessible.

## API Endpoints

### 1. Get API Information

**Endpoint**: `GET /`  
**Description**: Returns general API information and available endpoints

**Response**:
```json
{
  "message": "Bank Backend API",
  "version": "1.0.0",
  "endpoints": {
    "accounts": "/api/accounts",
    "transactions": "/api/transactions",
    "balance": "/api/accounts/:id/balance",
    "transfer": "/api/transfer",
    "freeze": "/api/accounts/:id/freeze",
    "unfreeze": "/api/accounts/:id/unfreeze",
    "interest": "/api/accounts/:id/interest",
    "statement": "/api/accounts/:id/statement"
  }
}
```

### 2. Accounts

#### Get All Accounts

**Endpoint**: `GET /api/accounts`  
**Description**: Retrieves all bank accounts

**Response**:
```json
[
  {
    "id": 1,
    "teamId": "demo-team",
    "accountNumber": "1234567890",
    "accountHolder": "John Doe",
    "balance": 1500,
    "accountType": "checking",
    "status": "active",
    "createdAt": "2025-05-24T05:01:21.435Z"
  },
  {
    "id": 2,
    "teamId": "demo-team",
    "accountNumber": "0987654321",
    "accountHolder": "Jane Smith",
    "balance": 2716.5,
    "accountType": "savings",
    "status": "active",
    "createdAt": "2025-04-24T05:01:21.435Z"
  }
]
```

**Response Fields**:
- `id`: Unique account identifier
- `teamId`: Team identifier (for demo purposes)
- `accountNumber`: 10-digit account number
- `accountHolder`: Name of the account holder
- `balance`: Current account balance (decimal)
- `accountType`: Type of account ("checking" or "savings")
- `status`: Account status ("active", "frozen", etc.)
- `createdAt`: Account creation timestamp (ISO 8601 format)

### 3. Transactions

#### Get All Transactions

**Endpoint**: `GET /api/transactions`  
**Description**: Retrieves all transaction history

**Response**:
```json
[
  {
    "id": 1,
    "accountId": 1,
    "type": "deposit",
    "amount": 500,
    "description": "Salary deposit",
    "timestamp": "2025-06-16T05:01:21.435Z",
    "balanceAfter": 1500
  },
  {
    "id": 2,
    "accountId": 1,
    "type": "withdrawal",
    "amount": 100,
    "description": "ATM withdrawal",
    "timestamp": "2025-06-22T05:01:21.435Z",
    "balanceAfter": 1400
  }
]
```

**Response Fields**:
- `id`: Unique transaction identifier
- `accountId`: ID of the account involved in the transaction
- `type`: Transaction type ("deposit", "withdrawal", "transfer_in", "transfer_out")
- `amount`: Transaction amount (decimal)
- `description`: Human-readable description of the transaction
- `timestamp`: Transaction timestamp (ISO 8601 format)
- `balanceAfter`: Account balance after the transaction

**Transaction Types**:
- `deposit`: Money added to account
- `withdrawal`: Money removed from account
- `transfer_in`: Money received from another account
- `transfer_out`: Money sent to another account

### 4. Account Balance

#### Get Account Balance

**Endpoint**: `GET /api/accounts/:id/balance`  
**Description**: Retrieves the current balance of a specific account

**Parameters**:
- `id` (path parameter): Account ID

**Response**:
```json
{
  "accountId": 1,
  "accountNumber": "1234567890",
  "balance": 1500
}
```

**Response Fields**:
- `accountId`: Account identifier
- `accountNumber`: 10-digit account number
- `balance`: Current account balance

### 5. Money Transfer

**Endpoint**: `POST /api/transfer`  
**Description**: Transfers money between accounts

**Request Body**:
```json
{
  "fromAccountId": 1,
  "toAccountId": 2,
  "amount": 100,
  "description": "Payment for services"
}
```

**Request Fields**:
- `fromAccountId`: Source account ID
- `toAccountId`: Destination account ID
- `amount`: Transfer amount (must be positive)
- `description`: Transfer description

**Response**: (Expected format - may vary)
```json
{
  "success": true,
  "transactionId": 123,
  "message": "Transfer completed successfully"
}
```

### 6. Account Management

#### Freeze Account

**Endpoint**: `POST /api/accounts/:id/freeze`  
**Description**: Freezes an account, preventing transactions

**Parameters**:
- `id` (path parameter): Account ID to freeze

#### Unfreeze Account

**Endpoint**: `POST /api/accounts/:id/unfreeze`  
**Description**: Unfreezes a previously frozen account

**Parameters**:
- `id` (path parameter): Account ID to unfreeze

### 7. Interest Calculation

**Endpoint**: `GET /api/accounts/:id/interest`  
**Description**: Calculates interest for an account

**Parameters**:
- `id` (path parameter): Account ID

### 8. Account Statement

**Endpoint**: `GET /api/accounts/:id/statement`  
**Description**: Generates an account statement with transaction history

**Parameters**:
- `id` (path parameter): Account ID

## Demo Data

The API includes sample data for testing and demonstration:

### Sample Accounts
1. **John Doe** (ID: 1)
   - Account: 1234567890
   - Type: Checking
   - Balance: $1,500.00

2. **Jane Smith** (ID: 2)
   - Account: 0987654321
   - Type: Savings
   - Balance: $2,716.50

3. **El Ildaro** (ID: 3)
   - Account: 7362141486
   - Type: Checking
   - Balance: $34.00

4. **juancho** (ID: 4)
   - Account: 8370711022
   - Type: Checking
   - Balance: $3,000,000.00

### Sample Transactions
- Deposits and withdrawals
- Inter-account transfers
- Various transaction amounts and descriptions

## Error Handling

The API follows standard HTTP status codes:
- `200 OK`: Successful request
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Currently, no rate limiting is implemented for demo purposes.

## Usage Examples

### Using curl

```bash
# Get all accounts
curl https://cursorworkshopserver.onrender.com/api/accounts

# Get specific account balance
curl https://cursorworkshopserver.onrender.com/api/accounts/1/balance

# Get all transactions
curl https://cursorworkshopserver.onrender.com/api/transactions
```

### Using JavaScript (fetch)

```javascript
// Get all accounts
const response = await fetch('https://cursorworkshopserver.onrender.com/api/accounts');
const accounts = await response.json();

// Get account balance
const balanceResponse = await fetch('https://cursorworkshopserver.onrender.com/api/accounts/1/balance');
const balance = await balanceResponse.json();
```

## Notes

- This is a demo API for educational and testing purposes
- All data is sample data and may be reset periodically
- No real financial transactions are processed
- The API is suitable for frontend development and API testing

## Support

For questions or issues with this demo API, please refer to the workshop materials or contact the workshop organizers. 