package app.brace.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@SuppressWarnings("LombokEqualsAndHashCodeInspection")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode(of = "username")
@MappedSuperclass
public abstract class UserModel {
    @Id
    @Column(updatable = false)
    private String username;

    @Setter
    @JsonIgnore
    @Column(nullable = false, length = 60)
    private String password;

    public String getUsernameWithGroupSuffix() {
        return GroupName.withGroupSuffix(this.getUsername(),
                                         this.getRole().getName().getGroupName());
    }

    public abstract Role getRole();
}
