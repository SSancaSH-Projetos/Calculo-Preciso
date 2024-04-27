package com.precisiontech.cp.DTO;

import com.precisiontech.cp.entity.MaoDeObra;
import com.precisiontech.cp.entity.Material;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaoDeObraDTO {
    private Long id;
    private String profissional;
    private double precoPorHora;
}