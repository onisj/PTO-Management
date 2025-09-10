// triggers/newPtoRequest.js
const perform = async (z, bundle) => {
    const { baseId } = bundle.authData;

    // Fetch recent PTO requests from Airtable
    const response = await z.request({
        url: `https://api.airtable.com/v0/${baseId}/PTO%20Requests`,
        method: 'GET',
        params: {
            filterByFormula: '{Request Status} = "Submitted"',
            sort: [{ field: 'Submitted Date', direction: 'desc' }],
            maxRecords: 100
        }
    });

    // Transform Airtable records into Zapier-friendly format
    return response.data.records.map(record => ({
        id: record.id,
        requestId: record.fields['Request ID'],
        employeeId: record.fields['Employee']?.[0], // Linked record ID
        employeeName: record.fields['Employee Name'] || 'Unknown',
        startDate: record.fields['Start Date'],
        endDate: record.fields['End Date'],
        daysRequested: record.fields['Days Requested'],
        requestType: record.fields['Request Type'],
        requestStatus: record.fields['Request Status'],
        employeeNotes: record.fields['Employee Notes'],
        submittedDate: record.fields['Submitted Date'],
        employeeEmail: record.fields['Employee Email'],
        employeeDepartment: record.fields['Employee Department'],
        managerId: record.fields['Manager']?.[0], // Linked record ID
        // Include raw record for advanced users
        _raw: record
    }));
};

export default {
    key: 'newPtoRequest',
    noun: 'PTO Request',

    display: {
        label: 'New PTO Request',
        description: 'Triggers when an employee submits a new PTO request.',
    },

    operation: {
        perform,

        inputFields: [
            {
                key: 'requestType',
                label: 'Request Type Filter',
                type: 'string',
                choices: ['Vacation', 'Sick', 'Personal', 'Emergency', 'Other'],
                helpText: 'Only trigger for specific request types (optional)',
                required: false
            }
        ],

        sample: {
            id: 'recABC123',
            requestId: 1,
            employeeId: 'recEMP001',
            employeeName: 'John Doe',
            startDate: '2025-09-15',
            endDate: '2025-09-19',
            daysRequested: 5,
            requestType: 'Vacation',
            requestStatus: 'Submitted',
            employeeNotes: 'Family vacation to Italy',
            submittedDate: '2025-09-04T10:30:00.000Z',
            employeeEmail: 'john.doe@company.com',
            employeeDepartment: 'Engineering',
            managerId: 'recMGR001'
        },

        outputFields: [
            { key: 'id', label: 'Record ID', type: 'string' },
            { key: 'requestId', label: 'Request ID', type: 'integer' },
            { key: 'employeeId', label: 'Employee ID', type: 'string' },
            { key: 'employeeName', label: 'Employee Name', type: 'string' },
            { key: 'startDate', label: 'Start Date', type: 'datetime' },
            { key: 'endDate', label: 'End Date', type: 'datetime' },
            { key: 'daysRequested', label: 'Days Requested', type: 'number' },
            { key: 'requestType', label: 'Request Type', type: 'string' },
            { key: 'requestStatus', label: 'Request Status', type: 'string' },
            { key: 'employeeNotes', label: 'Employee Notes', type: 'string' },
            { key: 'employeeEmail', label: 'Employee Email', type: 'string' },
            { key: 'employeeDepartment', label: 'Employee Department', type: 'string' },
            { key: 'managerId', label: 'Manager ID', type: 'string' }
        ]
    }
};