package br.com.maoamiga.api.controller;

import br.com.maoamiga.api.dto.DoacaoRequestDTO;
import br.com.maoamiga.api.dto.DoacaoResponseDTO;
import br.com.maoamiga.api.service.DoacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doacoes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DoacaoController {

    private final DoacaoService service;

    @GetMapping("/filtro")
    public Page<DoacaoResponseDTO> filtrar(
            @RequestParam(required = false) String filtro,
            @PageableDefault(size = 10, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return service.filtrar(filtro, pageable);
    }

    @GetMapping("/{id}")
    public DoacaoResponseDTO buscar(@PathVariable UUID id) {
        return service.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DoacaoResponseDTO criar(@Valid @RequestBody DoacaoRequestDTO dto) {
        return service.criar(dto);
    }

    @PutMapping("/{id}")
    public DoacaoResponseDTO atualizar(@PathVariable UUID id, @Valid @RequestBody DoacaoRequestDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID id) {
        service.excluir(id);
    }
}

