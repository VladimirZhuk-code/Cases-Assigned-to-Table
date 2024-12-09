public with sharing class GetCasesAssignedTo {
    @AuraEnabled
    public static List<Case> getCasesList(Id userId) {
        return [
            SELECT Id, CaseNumber, OwnerId, Owner.Name, AccountId, 
            Account.Name, Category__c, Subject, Description, CreatedDate,
            Case_Age_in_Days__c, Status, Priority
            FROM Case 
            WHERE Assigned_to__c = :userId AND IsClosed = false AND IsDeleted = false 
            WITH USER_MODE
            ORDER BY CreatedDate ASC 
            LIMIT 100
        ];
    }
}