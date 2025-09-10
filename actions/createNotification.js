// actions/createNotification.js
const perform = async (z, bundle) => {
    const { baseId } = bundle.authData;
    const {
        recipientId,
        notificationType,
        relatedRequestId,
        relatedApprovalId,
        subject,
        messageContent,
        priority = 'Normal'
    } = bundle.inputData;

    const response = await z.request({
        url: `https://api.airtable.com/v0/${baseId}/Notifications`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            fields: {
                'Recipient': [recipientId],
                'Notification Type': notificationType,
                'Related Request': relatedRequestId ? [relatedRequestId] : undefined,
                'Related Approval': relatedApprovalId ? [relatedApprovalId] : undefined,
                'Subject': subject,
                'Message Content': messageContent,
                'Send Status': 'Pending',
                'Scheduled Send Date': new Date().toISOString().split('T')[0],
                'Priority': priority
            }
        }
    });

    const notification = response.data;

    return {
        id: notification.id,
        notificationId: notification.fields['Notification ID'],
        recipientId: recipientId,
        notificationType: notificationType,
        subject: subject,
        sendStatus: 'Pending',
        priority: priority,
        success: true,
        createdTime: notification.createdTime
    };
};

export default {
    key: 'createNotification',
    noun: 'Notification',

    display: {
        label: 'Create Notification Record',
        description: 'Creates a notification record for email/communication tracking',
    },

    operation: {
        perform,

        inputFields: [
            {
                key: 'recipientId',
                label: 'Recipient Employee Record ID',
                type: 'string',
                required: true,
                helpText: 'The Airtable record ID of the notification recipient'
            },
            {
                key: 'notificationType',
                label: 'Notification Type',
                type: 'string',
                choices: [
                    'Request Submitted',
                    'Approval Needed',
                    'Request Approved',
                    'Request Rejected',
                    'Balance Updated',
                    'Reminder'
                ],
                required: true
            },
            {
                key: 'relatedRequestId',
                label: 'Related PTO Request ID',
                type: 'string',
                required: false,
                helpText: 'Link to related PTO request'
            },
            {
                key: 'relatedApprovalId',
                label: 'Related Approval ID',
                type: 'string',
                required: false,
                helpText: 'Link to related approval record'
            },
            {
                key: 'subject',
                label: 'Email Subject',
                type: 'string',
                required: true,
                helpText: 'Subject line for the notification'
            },
            {
                key: 'messageContent',
                label: 'Message Content',
                type: 'text',
                required: true,
                helpText: 'Full notification message content'
            },
            {
                key: 'priority',
                label: 'Priority',
                type: 'string',
                choices: ['Low', 'Normal', 'High', 'Urgent'],
                default: 'Normal',
                required: false
            }
        ],

        sample: {
            id: 'recNOT789',
            notificationId: 15,
            recipientId: 'recEMP123',
            notificationType: 'Request Approved',
            subject: 'Your PTO request has been approved',
            sendStatus: 'Pending',
            priority: 'Normal',
            success: true,
            createdTime: '2025-09-04T15:30:00.000Z'
        },

        outputFields: [
            { key: 'id', label: 'Record ID', type: 'string' },
            { key: 'notificationId', label: 'Notification ID', type: 'integer' },
            { key: 'recipientId', label: 'Recipient ID', type: 'string' },
            { key: 'notificationType', label: 'Notification Type', type: 'string' },
            { key: 'subject', label: 'Subject', type: 'string' },
            { key: 'sendStatus', label: 'Send Status', type: 'string' },
            { key: 'priority', label: 'Priority', type: 'string' },
            { key: 'success', label: 'Success', type: 'boolean' }
        ]
    }
};