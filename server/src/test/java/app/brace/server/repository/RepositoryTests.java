package app.brace.server.repository;

import app.brace.server.config.WebEnvironmentConfig;
import app.brace.server.model.*;
import app.brace.server.security.PasswordEncoder;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

@Order(0)
public class RepositoryTests extends WebEnvironmentConfig {
    @Value("${admin.root-username}")
    private String rootUsername;

    @Value("${admin.root-password}")
    private String rootPassword;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdminRoleRepository adminRoleRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RespondentProfileRepository respondentProfileRepository;

    @Autowired
    private RespondentProfileStatusRepository respondentProfileStatusRepository;

    @Autowired
    private SpecialityRepository specialityRepository;

    @Autowired
    private StatusRepository statusRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Test
    @Order(0)
    void contextLoads() {
        assertThat(this.rootUsername).isNotNull();
        assertThat(this.rootPassword).isNotNull();

        assertThat(this.passwordEncoder).isNotNull();

        assertThat(this.adminRepository).isNotNull();
        assertThat(this.adminRoleRepository).isNotNull();
        assertThat(this.orderRepository).isNotNull();
        assertThat(this.respondentProfileRepository).isNotNull();
        assertThat(this.respondentProfileStatusRepository).isNotNull();
        assertThat(this.specialityRepository).isNotNull();
        assertThat(this.statusRepository).isNotNull();
        assertThat(this.userProfileRepository).isNotNull();
        assertThat(this.userRepository).isNotNull();
        assertThat(this.userRoleRepository).isNotNull();
    }

    @Test
    void loadAdminRepository() {
        final Optional<Admin> root = this.adminRepository.findByUsername(this.rootUsername);
        assertThat(root).isPresent();
        assertThat(root.get().getUsername()).isEqualTo(this.rootUsername);
        assertThat(this.passwordEncoder).matches(
                encoder -> encoder.matches(this.rootPassword, root.get().getPassword()));
        assertThat(root.get().getRole()).isEqualTo(
                this.adminRoleRepository.getByName(AdminRoleName.ROLE_ROOT));
    }

    @Test
    void loadAdminRoleRepository() {
        final Stream<Boolean> existences = Arrays.stream(AdminRoleName.values())
                                                 .map(this.adminRoleRepository::existsByName);
        assertThat(existences).allMatch(Boolean::booleanValue);
    }

    @Test
    void loadOrderRepository() {
        assertThat(this.orderRepository.findAll()).isEmpty();
    }

    @Test
    void loadRespondentProfileRepository() {
        assertThat(this.respondentProfileRepository.findAll()).isEmpty();
    }

    @Test
    void loadRespondentProfileStatusRepository() {
        final Stream<Boolean> existences = Arrays.stream(RespondentProfileStatusName.values())
                                                 .map(this.respondentProfileStatusRepository::existsByName);
        assertThat(existences).allMatch(Boolean::booleanValue);
    }

    @Test
    void loadSpecialityRepository() {
        assertThat(this.specialityRepository.findAll()).isEmpty();
    }

    @Test
    void loadStatusRepository() {
        final Stream<Boolean> existences = Arrays.stream(StatusName.values())
                                                 .map(this.statusRepository::existsByName);
        assertThat(existences).allMatch(Boolean::booleanValue);
    }

    @Test
    void loadUserProfileRepository() {
        assertThat(this.userProfileRepository.findAll()).isEmpty();
    }

    @Test
    void loadUserRepository() {
        assertThat(this.userRepository.findAll()).isEmpty();
    }

    @Test
    void loadUserRoleRepository() {
        final Stream<Boolean> existences = Arrays.stream(UserRoleName.values())
                                                 .map(this.userRoleRepository::existsByName);
        assertThat(existences).allMatch(Boolean::booleanValue);
    }
}
