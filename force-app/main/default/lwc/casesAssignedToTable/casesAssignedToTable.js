import { LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import USER_Id from '@salesforce/user/Id';
import NAME_FIELD from '@salesforce/schema/User.Name';
import getCasesList from '@salesforce/apex/GetCasesAssignedTo.getCasesList';

const COLMNS = [
    {
        label: 'Case Number', fieldName: 'CaseNumber', type: 'url',
        typeAttributes: {
            label: { fieldName: 'Name' },
            tooltip: { fieldName: 'Tooltip' },
            target: '_blank'
        }
    },
    { label: 'Account', fieldName: 'Account' },
    { label: 'Subject', fieldName: 'Subject', wrapText: true },
    { label: 'Date Opened', fieldName: 'CreatedDate', type: 'date' }
];

export default class DatatableWithRowActions extends LightningElement {
    error;
    userId = USER_Id;
    columns = COLMNS;
    caseAssignedToTitle = "";
    todayDate = new Date();
    options = {};
    todayHTML;
    quantity;
    data = [];
    isLoading = false;

    @wire(getRecord, { recordId: USER_Id, fields: [NAME_FIELD] })
    userDetails;

    get name() {
        return getFieldValue(this.userDetails.data, NAME_FIELD);
    }

    connectedCallback() {
        this.getServerData();
    }

    async getServerData() {
        try {
            let d = await getCasesList({ userId: this.userId });
            let dt = [];
            this.error = undefined;
            if (d.length) {
                d.forEach(row => {
                    let elt = {};
                    elt.Id = row.Id;
                    elt.Name = row.CaseNumber
                    elt.CaseNumber = '/' + row.Id;
                    elt.Account = row.Account?.Name;
                    elt.Owner = row.Owner?.Name;
                    elt.Category__c = row.Category__c;
                    elt.Subject = row.Subject;
                    elt.Description = row.Description;
                    elt.Priority = row.Priority;
                    elt.Case_Age_in_Days__c = row.Case_Age_in_Days__c;
                    elt.CreatedDate = row.CreatedDate;
                    elt.Status = row.Status;
                    elt.Tooltip = row.AccountId ? 'Case ' + row.CaseNumber +
                        ' Account: ' + row.Account?.Name + ' Case Owner: ' + row.Owner?.Name +
                        ' Case Age: ' + row.Case_Age_in_Days__c : 'Case ' +
                        row.CaseNumber + ' Case Owner: ' + row.Owner?.Name +
                        ' Case Age: ' + row.Case_Age_in_Days__c;
                    dt.push(elt);
                })
            };
            this.data = dt;
            this.quantity = dt.length;
            this.caseAssignedToTitle = "Cases Assigned to " + this.name;
            this.options = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: "true",
                timeZoneName: "longGeneric"
            };
            this.todayHTML = this.todayDate.toLocaleString("en-US", this.options);
        } catch (error) {
            this.error = error;
        }
    }

    async handleRefresh() {
        try {
            this.isLoading = true;
            await this.getServerData();
            const buttonName = this.template.querySelector('[data-id="refreshId"]');
            buttonName.blur();
            this.isLoading = false;
        }
        catch (error) {
            this.error = error;
        }
    }
}