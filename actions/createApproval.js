// actions/createApproval.js
const perform = async (z, bundle) => {
    const { baseId } = bundle.authData;
    const {
        ptoRequestId,
        approverId,
        approvalStatus = 'Pending'
    } = bundle.inputData;

    const response = await z.request({
        url: `https://api.airtable.com/v0/${baseId}/Approvals`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            fields: {
                'PTO Request': [ptoRequestId],
                'Approver': [approverId],
                'Approval Status': approvalStatus
            }
        }
    });

    const approval = response.data;

    return {
        id: approval.id,
        approvalId: approval.fields['Approval ID'],
        ptoRequestId: ptoRequestId,
        approverId: approverId,
        approvalStatus: approvalStatus,
        success: true,
        createdTime: approval.createdTime
    };
};

export default {
    key: 'createApproval',
    noun: 'PTO Approval',

    display: {
        label: 'Create PTO Approval Record',
        description: 'Creates an approval record when a PTO request needs manager review',
    },

    operation: {
        perform,

        inputFields: [
            {
                key: 'ptoRequestId',
                label: 'PTO Request Record ID',
                type: 'string',
                required: true,
                helpText: 'The Airtable record ID of the PTO request'
            },
            {
                key: 'approverId',
                label: 'Approver Employee Record ID',
                type: 'string',
                required: true,
                helpText: 'The Airtable record ID of the approving manager'
            },
            {
                key: 'approvalStatus',
                label: 'Initial Approval Status',
                type: 'string',
                choices: ['Pending', 'Approved', 'Rejected', 'Delegated'],
                default: 'Pending',
                required: false
            }
        ],

        sample: {
            id: 'recAPP789',
            approvalId: 15,
            ptoRequestId: 'recREQ123',
            approverId: 'recMGR001',
            approvalStatus: 'Pending',
            success: true,
            createdTime: '2025-09-04T15:30:00.000Z'
        },

        outputFields: [
            { key: 'id', label: 'Record ID', type: 'string' },
            { key: 'approvalId', label: 'Approval ID', type: 'integer' },
            { key: 'ptoRequestId', label: 'PTO Request ID', type: 'string' },
            { key: 'approverId', label: 'Approver ID', type: 'string' },
            { key: 'approvalStatus', label: 'Approval Status', type: 'string' },
            { key: 'success', label: 'Success', type: 'boolean' }
        ]
    }
};