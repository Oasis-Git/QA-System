package app.brace.server.model;

public enum UserRoleName implements RoleName {
    ROLE_RESPONDENT,
    ROLE_USER;

    @Override
    public GroupName getGroupName() {return GroupName.GROUP_USER;}
}
