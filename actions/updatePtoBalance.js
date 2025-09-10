// actions/updatePtoBalance.js
const perform = async (z, bundle) => {
    const { baseId } = bundle.authData;
    const { employeeId, daysToDeduct, requestId } = bundle.inputData;

    // First, get the current employee's balance record
    const balanceResponse = await z.request({
        url: `https://api.airtable.com/v0/${baseId}/PTO%20Balances`,
        method: 'GET',
        params: {
            filterByFormula: `AND({Employee} = "${employeeId}", {Is Current Balance} = TRUE())`
        }
    });

    if (balanceResponse.data.records.length === 0) {
        throw new Error(`No current balance record found for employee ${employeeId}`);
    }

    const balanceRecord = balanceResponse.data.records[0];
    const currentBalance = balanceRecord.fields['Current Balance'] || 0;
    const balanceBefore = currentBalance;
    const newBalance = Math.max(0, currentBalance - daysToDeduct);

    // Update the balance
    const updateResponse = await z.request({
        url: `https://api.airtable.com/v0/${baseId}/PTO%20Balances/${balanceRecord.id}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            fields: {
                'Current Balance': newBalance
            }
        }
    });

    // Create a transaction record for audit trail
    const transactionResponse = await z.request({
        url: `https://api.airtable.com/v0/${baseId}/Balance%20Transactions`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            fields: {
                'Employee': [employeeId],
                'Transaction Type': 'Deduction',
                'Days Changed': -daysToDeduct,
                'Balance Before': balanceBefore,
                'Balance After': newBalance,
                'Transaction Date': new Date().toISOString().split('T')[0],
                'Related Request': requestId ? [requestId] : undefined,
                'Reason': `PTO request deduction - ${daysToDeduct} days`,
                'Created By': 'Zapier Automation'
            }
        }
    });

    return {
        employeeId: employeeId,
        balanceRecordId: balanceRecord.id,
        transactionId: transactionResponse.data.id,
        previousBalance: balanceBefore,
        daysDeducted: daysToDeduct,
        newBalance: newBalance,
        requestId: requestId,
        updateDate: new Date().toISOString(),
        success: true
    };
};

export default {
    key: 'updatePtoBalance',
    noun: 'PTO Balance',

    display: {
        label: 'Update PTO Balance',
        description: 'Deducts approved PTO days from employee balance and creates transaction record',
    },

    operation: {
        perform,

        inputFields: [
            {
                key: 'employeeId',
                label: 'Employee Record ID',
                type: 'string',
                required: true,
                helpText: 'The Airtable record ID of the employee'
            },
            {
                key: 'daysToDeduct',
                label: 'Days to Deduct',
                type: 'number',
                required: true,
                helpText: 'Number of PTO days to deduct from balance'
            },
            {
                key: 'requestId',
                label: 'Related PTO Request ID',
                type: 'string',
                required: false,
                helpText: 'The PTO request this balance update relates to'
            }
        ],

        sample: {
            employeeId: 'recEMP123',
            balanceRecordId: 'recBAL456',
            transactionId: 'recTXN789',
            previousBalance: 22,
            daysDeducted: 5,
            newBalance: 17,
            requestId: 'recREQ123',
            updateDate: '2025-09-04T15:30:00.000Z',
            success: true
        },

        outputFields: [
            { key: 'employeeId', label: 'Employee ID', type: 'string' },
            { key: 'balanceRecordId', label: 'Balance Record ID', type: 'string' },
            { key: 'transactionId', label: 'Transaction ID', type: 'string' },
            { key: 'previousBalance', label: 'Previous Balance', type: 'number' },
            { key: 'daysDeducted', label: 'Days Deducted', type: 'number' },
            { key: 'newBalance', label: 'New Balance', type: 'number' },
            { key: 'requestId', label: 'Related Request ID', type: 'string' },
            { key: 'updateDate', label: 'Update Date', type: 'datetime' },
            { key: 'success', label: 'Success', type: 'boolean' }
        ]
    }
};