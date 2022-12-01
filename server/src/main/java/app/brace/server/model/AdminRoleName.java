package app.brace.server.model;

public enum AdminRoleName implements RoleName {
    ROLE_ROOT,
    ROLE_ADMIN;

    @Override
    public GroupName getGroupName() {return GroupName.GROUP_ADMIN;}
}
