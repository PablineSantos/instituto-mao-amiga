package br.com.maoamiga.api.repository;

import br.com.maoamiga.api.entity.Ponto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PontoRepository extends JpaRepository<Ponto, UUID> {
}
