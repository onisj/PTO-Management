// index.js
import zapier from 'zapier-platform-core';
import packageJson from './package.json' with { type: 'json' };

// Import triggers
import approvalStatusChange from './triggers/approvalStatusChange.js';
import newPtoRequest from './triggers/newPtoRequest.js';

// Import actions
import createApproval from './actions/createApproval.js';
import createNotification from './actions/createNotification.js';
import updatePtoBalance from './actions/updatePtoBalance.js';

// Import authentication
import authentication, { addAuthToHeader } from './authentication.js';

export default {
  version: packageJson.version,
  platformVersion: zapier.version,

  // Authentication for Airtable API
  authentication,

  // Add auth to every request
  beforeRequest: [addAuthToHeader],

  // Triggers - watch for new data
  triggers: {
    [newPtoRequest.key]: newPtoRequest,
    [approvalStatusChange.key]: approvalStatusChange,
  },

  // Actions - perform operations
  creates: {
    [createApproval.key]: createApproval,
    [updatePtoBalance.key]: updatePtoBalance,
    [createNotification.key]: createNotification,
  },

  searches: {},

  resources: {},
};