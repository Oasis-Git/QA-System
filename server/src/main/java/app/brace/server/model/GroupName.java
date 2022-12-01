package app.brace.server.model;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

public enum GroupName {
    GROUP_ADMIN,
    GROUP_USER;

    public static final char DELIMITER = '@';

    public static @NotNull GroupName
    getGroupName(final @NotNull String usernameWithGroupSuffix)
    {
        return GroupName.valueOf(usernameWithGroupSuffix.substring(
                usernameWithGroupSuffix.lastIndexOf(GroupName.DELIMITER) + 1));
    }

    @Contract(pure = true)
    public static @NotNull String withGroupSuffix(final @NotNull String username,
                                                  final @NotNull GroupName groupName)
    {
        return username + GroupName.DELIMITER + groupName.name();
    }

    public static @NotNull String
    withoutGroupSuffix(final @NotNull String usernameWithGroupSuffix)
    {
        return usernameWithGroupSuffix
                .substring(0, usernameWithGroupSuffix.lastIndexOf(GroupName.DELIMITER));
    }
}
