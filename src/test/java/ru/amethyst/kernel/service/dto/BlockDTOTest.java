package ru.amethyst.kernel.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import ru.amethyst.kernel.web.rest.TestUtil;

class BlockDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(BlockDTO.class);
        BlockDTO blockDTO1 = new BlockDTO();
        blockDTO1.setId(1L);
        BlockDTO blockDTO2 = new BlockDTO();
        assertThat(blockDTO1).isNotEqualTo(blockDTO2);
        blockDTO2.setId(blockDTO1.getId());
        assertThat(blockDTO1).isEqualTo(blockDTO2);
        blockDTO2.setId(2L);
        assertThat(blockDTO1).isNotEqualTo(blockDTO2);
        blockDTO1.setId(null);
        assertThat(blockDTO1).isNotEqualTo(blockDTO2);
    }
}
