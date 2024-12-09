@isTest
public with sharing class TestGetCasesAssignedTo {
    public static User createUser(String profile) {
        //Create Test User
        return new User(
            ProfileId = [SELECT Id FROM Profile WHERE Name = :profile].Id,
            LastName = 'last',
            Email = 'testUser@test.com',
            UserName = 'Test.User' + DateTime.now().getTime() + '@test.com',
            Alias = 'alias',
            TimeZoneSidKey = 'America/Los_Angeles',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US'
        );
    }

    public static User myUsr = createUser('System Administrator');
    public static void createCase(Integer amount){ 
        List<Case> cases = new List<Case>();
        
        for(Integer i = 0; i < amount; i++){
            cases.add(
                new Case(
                    Subject = 'New' + i,
                    Description = 'Test' + i,
                    Assigned_to__c = myUsr.Id
                )
            );
        }

        insert cases;        
    }

@isTest
    static void getCasesList() {
        TestGetCasesAssignedTo.createCase(100);

        Test.startTest();
        List<Case> cses = GetCasesAssignedTo.getCasesList(myUsr.Id);
        Test.stopTest();

        Assert.areEqual(100, cses.size(), 'The cases list size should be 100');  
    }
}