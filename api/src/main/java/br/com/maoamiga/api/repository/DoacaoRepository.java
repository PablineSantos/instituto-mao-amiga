package br.com.maoamiga.api.repository;

import br.com.maoamiga.api.entity.Doacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface DoacaoRepository extends JpaRepository<Doacao, UUID> {

    @Query("SELECT d FROM Doacao d WHERE :filtro IS NULL OR :filtro = '' "
            + "OR LOWER(d.tipoItem) LIKE LOWER(CONCAT('%', :filtro, '%'))")
    Page<Doacao> buscar(@Param("filtro") String filtro, Pageable pageable);
}

