package ru.amethyst.kernel.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SpaceMapperTest {

    private SpaceMapper spaceMapper;

    @BeforeEach
    public void setUp() {
        spaceMapper = new SpaceMapperImpl();
    }
}
