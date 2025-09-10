# PTO Management System - Zapier Integration

A comprehensive Paid Time Off (PTO) management system that automates employee leave requests, manager approvals, balance tracking, and notifications using Airtable and Zapier.

## Overview

This system streamlines the entire PTO workflow from request submission to balance updates, eliminating manual processes and ensuring accurate record-keeping. Employees can submit requests, managers receive automatic notifications for approval, and balances are updated automatically upon approval.

## System Architecture

The system uses a **7-table Airtable database** with **separation of concerns** design principles:

### Core Tables

1. **[Employees](https://airtable.com/appfTb63V9hx3lZuN/tblWrBuJbx9sBAVvd/viwIuIe4ZkyCqH8tg)** - Employee identity and organizational structure
2. **[System Configurations](https://airtable.com/appfTb63V9hx3lZuN/tbl10bdA8FUR3oGOV/viwdaADJhZIQUTyx6)** - Business rules and settings
3. **[PTO Balances](https://airtable.com/appfTb63V9hx3lZuN/tbl5Xknv6NLrxFSNA/viwj04J3qhho4Bay9)** - Current PTO balance state management
4. **[PTO Requests](https://airtable.com/appfTb63V9hx3lZuN/tblWprw5Se5si6NTi/viwmgAFPBUAqnKBwZ)** - Request submission and lifecycle
5. **[Approvals](https://airtable.com/appfTb63V9hx3lZuN/tblYx6C9sQEova3qF/viwOKeCiZgwTiGNtq)** - Approval workflow and decisions
6. **[Balance Transactions](https://airtable.com/appfTb63V9hx3lZuN/tblY2TDib7SGLlQeP/viwfte1QD1yA9Ampt)** - Audit trail of all balance changes
7. **[Notifications](https://airtable.com/appfTb63V9hx3lZuN/tblKHlKv00fvEtuue/viw1u9Jezkyx07JDm)** - Communication tracking

### Data Flow

```
Employee submits PTO Request → 
Approval record created → 
Manager receives notification → 
Manager makes decision → 
Request status updated → 
Balance deducted (if approved) → 
Transaction recorded → 
Employee notified
```

## Features

### For Employees

- Submit PTO requests with date ranges and notes
- Track request status in real-time
- View current PTO balance and usage history
- Receive automated notifications on request decisions

### For Managers

- Automatic notifications for pending approvals
- Review employee PTO history and current balance
- Add comments when approving/rejecting requests
- Dashboard view of team PTO schedules

### For HR/Administrators

- Complete audit trail of all PTO transactions
- Balance management and yearly resets
- Configurable business rules (annual PTO days, etc.)
- Comprehensive reporting and analytics

## Prerequisites

- Airtable account with the PTO Management base
- Zapier account (free or paid)
- Node.js (version 20 or higher)
- Zapier CLI installed globally

## Installation & Setup

### 1. Clone and Install

```bash
git clone https://github.com/onisj/PTO-Management
cd pto-management
npm install
```

### 2. Airtable Setup

Access the pre-configured base: [PTO Management Base](https://airtable.com/appfTb63V9hx3lZuN/tblWrBuJbx9sBAVvd/viwIuIe4ZkyCqH8tg?blocks=hide)

#### Required Airtable Automations

Set up these automations in your Airtable base:

**Automation 1: New Request → Create Approval**

- Trigger: When record created in PTO Requests
- Action: Create record in Approvals table
- Purpose: Automatically creates approval workflow

**Automation 2: Approval Decision → Update Request Status**

- Trigger: When Approval Status updated (not "Pending")
- Action: Update corresponding PTO Request status
- Purpose: Keeps request status synchronized

### 3. Zapier Integration Deployment

```bash
# Test the integration
zapier test

# Register with Zapier
zapier register "PTO Management System"

# Deploy to Zapier
zapier push
```

### 4. Configure Authentication

You'll need:

- **Airtable API Token**: Get from [Airtable Account](https://airtable.com/account)
- **Base ID**: Found in your Airtable base URL (`appfTb63V9hx3lZuN`)

## Zapier Triggers & Actions

### Triggers

- **New PTO Request**: Fires when employee submits a request
- **PTO Approval Decision Made**: Fires when manager approves/rejects

### Actions

- **Create Approval Record**: Links requests to approvers
- **Update PTO Balance**: Deducts approved days and creates audit trail
- **Create Notification Record**: Manages communication queue

## Recommended Zapier Workflows

### Workflow 1: Manager Notification

**Trigger**: New PTO Request
**Actions**:

1. Send email to manager (Gmail/Outlook)
2. Send Slack notification (optional)

### Workflow 2: Approval Processing

**Trigger**: PTO Approval Decision Made
**Filter**: Status = "Approved"
**Actions**:

1. Update PTO Balance (custom action)
2. Send confirmation email to employee
3. Add to Google Calendar (optional)

### Workflow 3: Rejection Notification

**Trigger**: PTO Approval Decision Made
**Filter**: Status = "Rejected"
**Actions**:

1. Send rejection email to employee with manager comments

## Forms & User Interactions

### Employee PTO Request Form

Create an Airtable form for employees to submit requests:

1. Go to PTO Requests table
2. Create form with fields:
   - Employee (lookup)
   - Start Date
   - End Date
   - Request Type
   - Employee Notes
3. Share form link with employees

### Manager Approval Interface

Managers can:

- View pending approvals in Airtable
- Use filtered views to see only their team's requests
- Add comments and change approval status directly in Airtable

## Reporting & Analytics

### Available Views

- **Pending Requests**: All requests awaiting approval
- **Team Calendar**: Visual timeline of approved time off
- **Balance Summary**: Current PTO balances by department
- **Transaction History**: Complete audit trail

### Key Metrics

- Average approval response time
- PTO usage rates by department
- Request approval/rejection rates
- Balance trends and forecasting

## Customization

### Business Rules Configuration

Update the System Configurations table to modify:

- Annual PTO days allocation
- Maximum single request duration
- Advance notice requirements
- Department-specific rules

### Adding New Request Types

1. Update "Request Type" single-select options in PTO Requests table
2. Modify notification templates in Zapier workflows
3. Update any filtered views as needed

## Testing

### Local Testing

```bash
npm test
zapier test
```

### End-to-End Testing

1. Create test employee records
2. Submit test PTO request
3. Verify approval record creation
4. Test manager approval process
5. Confirm balance updates and notifications

## Troubleshooting

### Common Issues

**Automation not triggering**

- Check that trigger conditions are met exactly
- Verify field names match between tables
- Ensure linked records exist

**Balance calculations incorrect**

- Check for multiple current balance records per employee
- Verify transaction records are created properly
- Review formula fields for calculation errors

**Notifications not sending**

- Confirm Zapier workflows are active
- Check authentication credentials
- Verify email addresses in employee records

### Debug Mode

Enable detailed logging in Zapier by adding console.log statements to your integration code.

## Resources

- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [Zapier Platform CLI](https://github.com/zapier/zapier-platform/blob/main/packages/cli/README.md)
- [PTO Management Base](https://airtable.com/appfTb63V9hx3lZuN/tblWrBuJbx9sBAVvd/viwIuIe4ZkyCqH8tg?blocks=hide)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Test your changes thoroughly
4. Submit a pull request with detailed description

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Quick Links

- **Airtable Base**: [PTO Management System](https://airtable.com/appfTb63V9hx3lZuN/tblWrBuJbx9sBAVvd/viwIuIe4ZkyCqH8tg?blocks=hide)
- **Employee Request Form**: [Submit PTO Request](https://airtable.com/appfTb63V9hx3lZuN/pagfWkZDzc5xYDd7h/form)
- **Manager Dashboard**: [Pending Approvals](https://airtable.com/appfTb63V9hx3lZuN/tblApprovals123/viwPending)
- **Balance Overview**: [Current Balances](https://airtable.com/appfTb63V9hx3lZuN/tblpKVCpyHLDUzGzF/viw8sP2xVOQ5vvAeq)

---

**Need Help?** Check the troubleshooting section above or create an issue in this repository.
