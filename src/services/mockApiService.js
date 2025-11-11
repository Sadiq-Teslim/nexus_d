// src/services/mockApiService.js

// This file is our FAKE backend. It simulates all backend operations.

// --- 1. Generate the Mock Data ---
const generateMockData = () => {
  const transactions = [];
  const FRAUD_DEVICE_ID = "DEVICE_FRAUD_XYZ_123";
  const MULE_ACCOUNTS = Array.from({ length: 10 }, (_, i) => `ACC_MULE_${String(i + 1).padStart(3, '0')}`);

  // Create the Fraud Chain (30 transactions)
  let lastMule = MULE_ACCOUNTS[0];
  for (let i = 0; i < 29; i++) {
    const nextMule = MULE_ACCOUNTS[(i + 1) % MULE_ACCOUNTS.length];
    transactions.push({
      id: `TXN_FRAUD_${String(i + 1).padStart(3, '0')}`,
      amount: Math.floor(Math.random() * (500000 - 100000) + 100000),
      source: lastMule,
      destination: nextMule,
      timestamp: new Date(Date.now() - (30 - i) * 60000).toISOString(),
      gnnScore: 0.95 + Math.random() * 0.04,
      status: "HIGH RISK",
      is_fraud_network: true,
      deviceFingerprint: FRAUD_DEVICE_ID,
    });
    lastMule = nextMule;
  }
  transactions.push({
    id: `TXN_FRAUD_030`,
    amount: 1500000,
    source: lastMule,
    destination: "ACC_EXIT_POINT",
    timestamp: new Date().toISOString(),
    gnnScore: 0.99,
    status: "HIGH RISK",
    is_fraud_network: true,
    deviceFingerprint: FRAUD_DEVICE_ID,
  });

  // Create Legitimate Transactions (170 transactions)
  for (let i = 0; i < 290; i++) {
    transactions.push({
      id: `TXN_LEGIT_${String(i + 1).padStart(3, '0')}`,
      amount: Math.floor(Math.random() * (200000 - 5000) + 5000),
      source: `ACC_USER_${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
      destination: `ACC_MERCHANT_${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
      timestamp: new Date(Date.now() - (200 - i) * 120000).toISOString(),
      gnnScore: Math.random() * 0.4,
      status: "OK",
      is_fraud_network: false,
      deviceFingerprint: `DEVICE_LEGIT_${String(i).padStart(3, '0')}`,
    });
  }

  // Sort by timestamp to simulate a real feed
  return transactions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

let allTransactions = generateMockData();

// --- 2. Create the Mock API Functions ---

// Simulates fetching all transactions
export const fetchTransactions = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...allTransactions]);
    }, 500); // Simulate network delay
  });
};

// Simulates the Agentic AI freezing a transaction
export const triggerMicroFreeze = (transactionId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const transactionIndex = allTransactions.findIndex(t => t.id === transactionId);
      if (transactionIndex !== -1) {
        allTransactions[transactionIndex].status = "FROZEN";
        console.log(`MOCK API: Transaction ${transactionId} has been FROZEN.`);
        resolve(allTransactions[transactionIndex]);
      } else {
        reject(new Error("Transaction not found"));
      }
    }, 300); // Simulate a fast AI action
  });
};

// Simulates the Manager's final authorization
export const authorizeHold = (transactionId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const transactionIndex = allTransactions.findIndex(t => t.id === transactionId);
      if (transactionIndex !== -1) {
        allTransactions[transactionIndex].status = "AUTHORIZED HOLD";
        console.log(`MOCK API: Transaction ${transactionId} is now AUTHORIZED HOLD.`);
        resolve(allTransactions[transactionIndex]);
      }
    }, 500);
  });
};

// Simulates releasing funds if it's a false positive
export const releaseFunds = (transactionId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const transactionIndex = allTransactions.findIndex(t => t.id === transactionId);
      if (transactionIndex !== -1) {
        allTransactions[transactionIndex].status = "OK"; // Revert status
        console.log(`MOCK API: Transaction ${transactionId} funds have been RELEASED.`);
        resolve(allTransactions[transactionIndex]);
      }
    }, 500);
  });
}