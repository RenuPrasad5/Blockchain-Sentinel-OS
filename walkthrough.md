# 🛠️ Development Walkthrough: Blockchain Intelligence (BCI)

Welcome to the BCI developer guide. This document outlines the core architecture and operational flow of the system.

---

## 🏗️ 1. Core Architecture Overview

### **A. Real-Time Data Pipeline**
The system uses the `AlchemyManager` (located in `src/utils/AlchemyManager.js`) to establish high-frequency WebSocket connections.
- **Interception:** Captures mempool transactions in real-time.
- **Pulse:** Provides a live "Network Pulse" on the dashboard.

### **B. Forensic Intelligence Engine**
The decoding logic resides in `src/services/blockchain.js` and `src/utils/AlchemyManager.js`.
- **Decoding:** Translates hex data into human-readable operations.
- **Analysis:** Flags interactions with mixers or high-value "Whale Alerts".

---

## 🚦 2. Key Modules

### **[ Dashboard Hub ] → `src/pages/BlockchainHub.jsx`**
Central mission control for live pulse and risk alerts.

### **[ Forensic Visualizer ] → `src/pages/tools/Visualizer.jsx`**
Graph-based interface to map movement of funds.

### **[ AI Sentinel Assistant ] → `src/components/AISentinelAssistant.jsx`**
AI-powered assistant for transaction explanations.

---

## ⚙️ 3. Operational Flow

1. **Mempool** → Captures raw data.
2. **Decoding** → Converts to readable format.
3. **Forensic Engine** → Risk scoring and pattern detection.
4. **Sentinel Monitoring** → High-risk flagging.
5. **Audit Trail** → Immutable logging in Firestore.

---
**[ WALKTHROUGH COMPLETE ]**
