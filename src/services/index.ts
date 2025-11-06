/**
 * Central export for all service modules
 * WSO2 Payment Platform Microservices Integration
 */

// Authentication Services
export { authService } from './authService';
export { wso2AuthService } from './wso2AuthService';

// Microservices (WSO2 Payment Platform)
export { forexService } from './forexService';          // Port 8001
export { ledgerService } from './ledgerService';        // Port 8002
export { paymentService } from './paymentService';      // Port 8003
export { profileService } from './profileService';      // Port 8004
export { walletService } from './walletService';        // Port 8006

// Legacy/Compatibility Services
export { transferService } from './transferService';
export { accountService } from './accountService';
