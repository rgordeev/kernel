package ru.amethyst.kernel.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import ru.amethyst.kernel.IntegrationTest;
import ru.amethyst.kernel.domain.Block;
import ru.amethyst.kernel.domain.enumeration.BlockType;
import ru.amethyst.kernel.repository.BlockRepository;
import ru.amethyst.kernel.service.dto.BlockDTO;
import ru.amethyst.kernel.service.mapper.BlockMapper;

/**
 * Integration tests for the {@link BlockResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BlockResourceIT {

    private static final BlockType DEFAULT_TYPE = BlockType.TEXT;
    private static final BlockType UPDATED_TYPE = BlockType.IMAGE;

    private static final Integer DEFAULT_ORDER = 1;
    private static final Integer UPDATED_ORDER = 2;

    private static final String DEFAULT_PAYLOAD = "AAAAAAAAAA";
    private static final String UPDATED_PAYLOAD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/blocks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BlockRepository blockRepository;

    @Autowired
    private BlockMapper blockMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBlockMockMvc;

    private Block block;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Block createEntity(EntityManager em) {
        Block block = new Block().type(DEFAULT_TYPE).order(DEFAULT_ORDER).payload(DEFAULT_PAYLOAD);
        return block;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Block createUpdatedEntity(EntityManager em) {
        Block block = new Block().type(UPDATED_TYPE).order(UPDATED_ORDER).payload(UPDATED_PAYLOAD);
        return block;
    }

    @BeforeEach
    public void initTest() {
        block = createEntity(em);
    }

    @Test
    @Transactional
    void createBlock() throws Exception {
        int databaseSizeBeforeCreate = blockRepository.findAll().size();
        // Create the Block
        BlockDTO blockDTO = blockMapper.toDto(block);
        restBlockMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blockDTO))
            )
            .andExpect(status().isCreated());

        // Validate the Block in the database
        List<Block> blockList = blockRepository.findAll();
        assertThat(blockList).hasSize(databaseSizeBeforeCreate + 1);
        Block testBlock = blockList.get(blockList.size() - 1);
        assertThat(testBlock.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testBlock.getOrder()).isEqualTo(DEFAULT_ORDER);
        assertThat(testBlock.getPayload()).isEqualTo(DEFAULT_PAYLOAD);
    }

    @Test
    @Transactional
    void createBlockWithExistingId() throws Exception {
        // Create the Block with an existing ID
        block.setId(1L);
        BlockDTO blockDTO = blockMapper.toDto(block);

        int databaseSizeBeforeCreate = blockRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBlockMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blockDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Block in the database
        List<Block> blockList = blockRepository.findAll();
        assertThat(blockList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBlocks() throws Exception {
        // Initialize the database
        blockRepository.saveAndFlush(block);

        // Get all the blockList
        restBlockMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(block.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)))
            .andExpect(jsonPath("$.[*].payload").value(hasItem(DEFAULT_PAYLOAD)));
    }

    @Test
    @Transactional
    void getBlock() throws Exception {
        // Initialize the database
        blockRepository.saveAndFlush(block);

        // Get the block
        restBlockMockMvc
            .perform(get(ENTITY_API_URL_ID, block.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(block.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER))
            .andExpect(jsonPath("$.payload").value(DEFAULT_PAYLOAD));
    }

    @Test
    @Transactional
    void getNonExistingBlock() throws Exception {
        // Get the block
        restBlockMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBlock() throws Exception {
        // Initialize the database
        blockRepository.saveAndFlush(block);

        int databaseSizeBeforeUpdate = blockRepository.findAll().size();

        // Update the block
        Block updatedBlock = blockRepository.findById(block.getId()).get();
        // Disconnect from session so that the updates on updatedBlock are not directly saved in db
        em.detach(updatedBlock);
        updatedBlock.type(UPDATED_TYPE).order(UPDATED_ORDER).payload(UPDATED_PAYLOAD);
        BlockDTO blockDTO = blockMapper.toDto(updatedBlock);

        restBlockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, blockDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blockDTO))
            )
            .andExpect(status().isOk());

        // Validate the Block in the database
        List<Block> blockList = blockRepository.findAll();
        assertThat(blockList).hasSize(databaseSizeBeforeUpdate);
        Block testBlock = blockList.get(blockList.size() - 1);
        assertThat(testBlock.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testBlock.getOrder()).isEqualTo(UPDATED_ORDER);
        assertThat(testBlock.getPayload()).isEqualTo(UPDATED_PAYLOAD);
    }

    @Test
    @Transactional
    void putNonExistingBlock() throws Exception {
        int databaseSizeBeforeUpdate = blockRepository.findAll().size();
        block.setId(count.incrementAndGet());

        // Create the Block
        BlockDTO blockDTO = blockMapper.toDto(block);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, blockDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blockDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Block in the database
        List<Block> blockList = blockRepository.findAll();
        assertThat(blockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBlock() throws Exception {
        int databaseSizeBeforeUpdate = blockRepository.findAll().size();
        block.setId(count.incrementAndGet());

        // Create the Block
        BlockDTO blockDTO = blockMapper.toDto(block);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blockDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Block in the database
        List<Block> blockList = blockRepository.findAll();
        assertThat(blockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBlock() throws Exception {
        int databaseSizeBeforeUpdate = blockRepository.findAll().size();
        block.setId(count.incrementAndGet());

        // Create the Block
        BlockDTO blockDTO = blockMapper.toDto(block);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlockMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blockDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Block in the database
        List<Block> blockList = blockRepository.findAll();
        assertThat(blockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBlockWithPatch() throws Exception {
        // Initialize the database
        blockRepository.saveAndFlush(block);

        int databaseSizeBeforeUpdate = blockRepository.findAll().size();

        // Update the block using partial update
        Block partialUpdatedBlock = new Block();
        partialUpdatedBlock.setId(block.getId());

        partialUpdatedBlock.type(UPDATED_TYPE).payload(UPDATED_PAYLOAD);

        restBlockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlock.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlock))
            )
            .andExpect(status().isOk());

        // Validate the Block in the database
        List<Block> blockList = blockRepository.findAll();
        assertThat(blockList).hasSize(databaseSizeBeforeUpdate);
        Block testBlock = blockList.get(blockList.size() - 1);
        assertThat(testBlock.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testBlock.getOrder()).isEqualTo(DEFAULT_ORDER);
        assertThat(testBlock.getPayload()).isEqualTo(UPDATED_PAYLOAD);
    }

    @Test
    @Transactional
    void fullUpdateBlockWithPatch() throws Exception {
        // Initialize the database
        blockRepository.saveAndFlush(block);

        int databaseSizeBeforeUpdate = blockRepository.findAll().size();

        // Update the block using partial update
        Block partialUpdatedBlock = new Block();
        partialUpdatedBlock.setId(block.getId());

        partialUpdatedBlock.type(UPDATED_TYPE).order(UPDATED_ORDER).payload(UPDATED_PAYLOAD);

        restBlockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlock.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlock))
            )
            .andExpect(status().isOk());

        // Validate the Block in the database
        List<Block> blockList = blockRepository.findAll();
        assertThat(blockList).hasSize(databaseSizeBeforeUpdate);
        Block testBlock = blockList.get(blockList.size() - 1);
        assertThat(testBlock.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testBlock.getOrder()).isEqualTo(UPDATED_ORDER);
        assertThat(testBlock.getPayload()).isEqualTo(UPDATED_PAYLOAD);
    }

    @Test
    @Transactional
    void patchNonExistingBlock() throws Exception {
        int databaseSizeBeforeUpdate = blockRepository.findAll().size();
        block.setId(count.incrementAndGet());

        // Create the Block
        BlockDTO blockDTO = blockMapper.toDto(block);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, blockDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blockDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Block in the database
        List<Block> blockList = blockRepository.findAll();
        assertThat(blockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBlock() throws Exception {
        int databaseSizeBeforeUpdate = blockRepository.findAll().size();
        block.setId(count.incrementAndGet());

        // Create the Block
        BlockDTO blockDTO = blockMapper.toDto(block);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blockDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Block in the database
        List<Block> blockList = blockRepository.findAll();
        assertThat(blockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBlock() throws Exception {
        int databaseSizeBeforeUpdate = blockRepository.findAll().size();
        block.setId(count.incrementAndGet());

        // Create the Block
        BlockDTO blockDTO = blockMapper.toDto(block);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlockMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blockDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Block in the database
        List<Block> blockList = blockRepository.findAll();
        assertThat(blockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBlock() throws Exception {
        // Initialize the database
        blockRepository.saveAndFlush(block);

        int databaseSizeBeforeDelete = blockRepository.findAll().size();

        // Delete the block
        restBlockMockMvc
            .perform(delete(ENTITY_API_URL_ID, block.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Block> blockList = blockRepository.findAll();
        assertThat(blockList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
