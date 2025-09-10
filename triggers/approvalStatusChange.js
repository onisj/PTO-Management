// triggers/approvalStatusChange.js
const perform = async (z, bundle) => {
  const { baseId } = bundle.authData;

  // Fetch recently updated approvals
  const response = await z.request({
    url: `https://api.airtable.com/v0/${baseId}/Approvals`,
    method: 'GET',
    params: {
      filterByFormula: 'AND({Approval Status} != "Pending", {Decision Date} != BLANK())',
      sort: [{ field: 'Decision Date', direction: 'desc' }],
      maxRecords: 50
    }
  });

  return response.data.records.map(record => ({
    id: record.id,
    approvalId: record.fields['Approval ID'],
    ptoRequestId: record.fields['PTO Request']?.[0], // Linked record ID
    approverId: record.fields['Approver']?.[0], // Linked record ID
    approverName: record.fields['Approver Name'],
    approverEmail: record.fields['Approver Email'],
    approvalStatus: record.fields['Approval Status'],
    managerComments: record.fields['Manager Comments'],
    decisionDate: record.fields['Decision Date'],
    responseTimeHours: record.fields['Response Time (Hours)'],
    employeeName: record.fields['Employee Name'],
    requestStartDate: record.fields['Request Start Date'],
    requestEndDate: record.fields['Request End Date'],
    requestType: record.fields['Request Type'],
    daysRequested: record.fields['Days Requested'],
    _raw: record
  }));
};

export default {
  key: 'approvalStatusChange',
  noun: 'PTO Approval',

  display: {
    label: 'PTO Approval Decision Made',
    description: 'Triggers when a manager approves or rejects a PTO request.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'statusFilter',
        label: 'Status Filter',
        type: 'string',
        choices: ['Approved', 'Rejected', 'Delegated'],
        helpText: 'Only trigger for specific approval statuses (optional)',
        required: false
      }
    ],

    sample: {
      id: 'recAPP456',
      approvalId: 2,
      ptoRequestId: 'recREQ123',
      approverId: 'recMGR001',
      approverName: 'Sarah Manager',
      approverEmail: 'sarah.manager@company.com',
      approvalStatus: 'Approved',
      managerComments: 'Approved. Enjoy your time off!',
      decisionDate: '2025-09-04T14:30:00.000Z',
      responseTimeHours: 4.5,
      employeeName: 'John Doe',
      requestStartDate: '2025-09-15',
      requestEndDate: '2025-09-19',
      requestType: 'Vacation',
      daysRequested: 5
    },

    outputFields: [
      { key: 'id', label: 'Record ID', type: 'string' },
      { key: 'approvalId', label: 'Approval ID', type: 'integer' },
      { key: 'ptoRequestId', label: 'PTO Request ID', type: 'string' },
      { key: 'approverId', label: 'Approver ID', type: 'string' },
      { key: 'approverName', label: 'Approver Name', type: 'string' },
      { key: 'approvalStatus', label: 'Approval Status', type: 'string' },
      { key: 'managerComments', label: 'Manager Comments', type: 'string' },
      { key: 'decisionDate', label: 'Decision Date', type: 'datetime' },
      { key: 'employeeName', label: 'Employee Name', type: 'string' },
      { key: 'daysRequested', label: 'Days Requested', type: 'number' }
    ]
  }
};