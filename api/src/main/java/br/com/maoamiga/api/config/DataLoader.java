package br.com.maoamiga.api.config;

import br.com.maoamiga.api.entity.Ponto;
import br.com.maoamiga.api.repository.PontoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataLoader {

    private static final String[][] BASE = {
            {"Banco de Alimentos Centro", "Av. Goias, 100", "Centro"},
            {"Ponto Setor Bueno", "Av. T-10, 1200", "Setor Bueno"},
            {"Ponto Setor Marista", "Rua 90, 350", "Setor Marista"},
            {"Ponto Jardim America", "Av. Republica do Libano, 500", "Jardim America"},
            {"Ponto Campinas", "Av. Anhanguera, 4000", "Campinas"},
            {"Ponto Setor Oeste", "Rua 5, 220", "Setor Oeste"},
            {"Ponto Vila Nova", "Rua 7, 80", "Vila Nova"},
            {"Ponto Parque Amazonia", "Av. Perimetral, 900", "Parque Amazonia"},
    };

    @Bean
    CommandLineRunner seedPontos(PontoRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }
            List<Ponto> pontos = new ArrayList<>();
            for (int i = 0; i < BASE.length; i++) {
                pontos.add(novo(BASE[i][0], BASE[i][1], BASE[i][2], i % 2 == 0 ? "coleta" : "distribuição"));
            }
            repository.saveAll(pontos);
        };
    }

    private Ponto novo(String nome, String endereco, String bairro, String tipo) {
        Ponto p = new Ponto();
        p.setNome(nome);
        p.setEndereco(endereco);
        p.setBairro(bairro);
        p.setHorario("Seg a Sex, 8h às 17h");
        p.setTipo(tipo);
        return p;
    }
}
