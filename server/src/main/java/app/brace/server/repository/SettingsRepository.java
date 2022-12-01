package app.brace.server.repository;

import app.brace.server.model.Settings;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.time.Duration;

public interface SettingsRepository extends JpaRepository<Settings, String> {
    Settings getSettingsByFake(String settings);
}

@AllArgsConstructor
@Component
class SettingsLoader {
    private final SettingsRepository repository;

    @PostConstruct
    private void load() {
        Settings settings=new Settings("setting",0, Duration.ofMinutes(20).toString(),
                Duration.ofMinutes(20).toString(),Duration.ofMinutes(20).toString(),Duration.ofMinutes(20).toString());
        repository.save(settings);
    }
}
