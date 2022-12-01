package app.brace.server.repository;

import app.brace.server.model.Speciality;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SpecialityRepository extends JpaRepository<Speciality, String> {
    Speciality getSpecialityByValue(String value);

    boolean existsByValue(String value);
}
