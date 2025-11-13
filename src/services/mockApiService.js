// src/services/mockApiService.js

export const MOCK_CCN_REPORT = `
**COGNITIVE COMPLIANCE NARRATIVE (CCN™) - CONFIDENTIAL**

**INCIDENT ID:** TXN_FRAUD_030
**DATE:** ${new Date().toLocaleDateString()}
**STATUS:** URGENT - MICRO-FREEZE RECOMMENDED

**1. EXECUTIVE SUMMARY:**
The Agentic AI has detected a high-confidence money laundering network pattern culminating in an exit transaction of NGN 1,500,000 to account ACC_EXIT_POINT. The structural velocity and coordinated timing of the 30 preceding transactions indicate a sophisticated, organized attempt to obscure fund origins, consistent with established money mule typologies (CBN AML/CFT Section 4.2).

**2. COGNITIVE DIGITAL TWIN (CDT) ANALYSIS:**
*   **Regulatory Penalty Value (RPV):** NGN 850,000,000 (Estimated fine if network is not disrupted)
*   **Reputational Damage Score (RDS):** 9.2/10 (High risk of public trust erosion)

**3. JUSTIFICATION FOR ACTION:**
Immediate action is mandated under regulatory guidelines to prevent capital flight and mitigate institutional risk. The GNN has identified ACC_EXIT_POINT as the terminal node with 99% certainty. A Micro-Freeze is the minimum required action to preserve assets pending formal investigation.
`;

// --- 1. Generate sample data ---
const generateMockData = () => {
  const transactions = [];
  const FRAUD_DEVICE_ID = "DEVICE_FRAUD_XYZ_123";
  const MULE_ACCOUNTS = Array.from({ length: 10 }, (_, i) => `ACC_MULE_${String(i + 1).padStart(3, '0')}`);

  // --- MODIFIED: Create the Fraud Chain with CDT Data ---
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
      cdt: { // <-- NEW CDT DATA
          regulatoryPenaltyValue: 850000000,
          reputationalDamageScore: 9.2,
      }
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
    cdt: { // <-- NEW CDT DATA
        regulatoryPenaltyValue: 850000000,
        reputationalDamageScore: 9.2,
    }
  });

  // --- Legitimate Transactions (no changes here) ---
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
  return transactions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

let allTransactions = generateMockData();

// --- 2. Create the demo API functions ---

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
  console.log(`API: Transaction ${transactionId} has been FROZEN.`);
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
  console.log(`API: Transaction ${transactionId} is now AUTHORIZED HOLD.`);
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
  console.log(`API: Transaction ${transactionId} funds have been RELEASED.`);
        resolve(allTransactions[transactionIndex]);
      }
    }, 500);
  });
}

/**
 * Simulates an FI Admin signing up their institution.
 * In a real app, this would create a new institution and an admin user in the database.
 * @param {object} signupData - Contains bankName, adminEmail, password.
 * @returns {Promise<object>} A promise that resolves with the new admin user object.
 */
export const signUpInstitution = (signupData) => {
    return new Promise(resolve => {
        // Simulate a 5-second verification/creation delay
        setTimeout(() => {
            console.log("API: Institution signup successful for:", signupData.bankName);
            const adminUser = {
                email: signupData.adminEmail,
                role: 'admin',
                institution: signupData.bankName
            };
            // In a real app, we'd also return a JWT token here.
            resolve(adminUser);
        }, 5000); // 5-second delay to match the spinner
    });
};

/**
 * Simulates a Fraud Manager logging in.
 * In a real app, this would check credentials against the database.
 * @param {object} loginData - Contains email, password.
 * @returns {Promise<object>} A promise that resolves with the manager user object.
 */
export const loginManager = (loginData) => {
    return new Promise((resolve, reject) => {
        // Simulate a short network delay for login
        setTimeout(() => {
            // For the hackathon, we'll accept any login as valid
            if (loginData.email && loginData.password) {
                console.log("API: Manager login successful for:", loginData.email);
                const managerUser = {
                    email: loginData.email,
                    role: 'manager'
                };
                resolve(managerUser);
            } else {
                reject(new Error("Invalid credentials"));
            }
        }, 1000);
    });
};