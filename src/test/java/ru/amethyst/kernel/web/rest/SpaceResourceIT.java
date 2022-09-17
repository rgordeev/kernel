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
import ru.amethyst.kernel.domain.Space;
import ru.amethyst.kernel.repository.SpaceRepository;
import ru.amethyst.kernel.service.dto.SpaceDTO;
import ru.amethyst.kernel.service.mapper.SpaceMapper;

/**
 * Integration tests for the {@link SpaceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SpaceResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_PROJECT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_PROJECT_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_ICON = "AAAAAAAAAA";
    private static final String UPDATED_ICON = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/spaces";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SpaceRepository spaceRepository;

    @Autowired
    private SpaceMapper spaceMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSpaceMockMvc;

    private Space space;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Space createEntity(EntityManager em) {
        Space space = new Space().title(DEFAULT_TITLE).projectCode(DEFAULT_PROJECT_CODE).icon(DEFAULT_ICON);
        return space;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Space createUpdatedEntity(EntityManager em) {
        Space space = new Space().title(UPDATED_TITLE).projectCode(UPDATED_PROJECT_CODE).icon(UPDATED_ICON);
        return space;
    }

    @BeforeEach
    public void initTest() {
        space = createEntity(em);
    }

    @Test
    @Transactional
    void createSpace() throws Exception {
        int databaseSizeBeforeCreate = spaceRepository.findAll().size();
        // Create the Space
        SpaceDTO spaceDTO = spaceMapper.toDto(space);
        restSpaceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(spaceDTO))
            )
            .andExpect(status().isCreated());

        // Validate the Space in the database
        List<Space> spaceList = spaceRepository.findAll();
        assertThat(spaceList).hasSize(databaseSizeBeforeCreate + 1);
        Space testSpace = spaceList.get(spaceList.size() - 1);
        assertThat(testSpace.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testSpace.getProjectCode()).isEqualTo(DEFAULT_PROJECT_CODE);
        assertThat(testSpace.getIcon()).isEqualTo(DEFAULT_ICON);
    }

    @Test
    @Transactional
    void createSpaceWithExistingId() throws Exception {
        // Create the Space with an existing ID
        space.setId(1L);
        SpaceDTO spaceDTO = spaceMapper.toDto(space);

        int databaseSizeBeforeCreate = spaceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSpaceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(spaceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Space in the database
        List<Space> spaceList = spaceRepository.findAll();
        assertThat(spaceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSpaces() throws Exception {
        // Initialize the database
        spaceRepository.saveAndFlush(space);

        // Get all the spaceList
        restSpaceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(space.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].projectCode").value(hasItem(DEFAULT_PROJECT_CODE)))
            .andExpect(jsonPath("$.[*].icon").value(hasItem(DEFAULT_ICON)));
    }

    @Test
    @Transactional
    void getSpace() throws Exception {
        // Initialize the database
        spaceRepository.saveAndFlush(space);

        // Get the space
        restSpaceMockMvc
            .perform(get(ENTITY_API_URL_ID, space.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(space.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.projectCode").value(DEFAULT_PROJECT_CODE))
            .andExpect(jsonPath("$.icon").value(DEFAULT_ICON));
    }

    @Test
    @Transactional
    void getNonExistingSpace() throws Exception {
        // Get the space
        restSpaceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSpace() throws Exception {
        // Initialize the database
        spaceRepository.saveAndFlush(space);

        int databaseSizeBeforeUpdate = spaceRepository.findAll().size();

        // Update the space
        Space updatedSpace = spaceRepository.findById(space.getId()).get();
        // Disconnect from session so that the updates on updatedSpace are not directly saved in db
        em.detach(updatedSpace);
        updatedSpace.title(UPDATED_TITLE).projectCode(UPDATED_PROJECT_CODE).icon(UPDATED_ICON);
        SpaceDTO spaceDTO = spaceMapper.toDto(updatedSpace);

        restSpaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, spaceDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(spaceDTO))
            )
            .andExpect(status().isOk());

        // Validate the Space in the database
        List<Space> spaceList = spaceRepository.findAll();
        assertThat(spaceList).hasSize(databaseSizeBeforeUpdate);
        Space testSpace = spaceList.get(spaceList.size() - 1);
        assertThat(testSpace.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testSpace.getProjectCode()).isEqualTo(UPDATED_PROJECT_CODE);
        assertThat(testSpace.getIcon()).isEqualTo(UPDATED_ICON);
    }

    @Test
    @Transactional
    void putNonExistingSpace() throws Exception {
        int databaseSizeBeforeUpdate = spaceRepository.findAll().size();
        space.setId(count.incrementAndGet());

        // Create the Space
        SpaceDTO spaceDTO = spaceMapper.toDto(space);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSpaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, spaceDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(spaceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Space in the database
        List<Space> spaceList = spaceRepository.findAll();
        assertThat(spaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSpace() throws Exception {
        int databaseSizeBeforeUpdate = spaceRepository.findAll().size();
        space.setId(count.incrementAndGet());

        // Create the Space
        SpaceDTO spaceDTO = spaceMapper.toDto(space);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSpaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(spaceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Space in the database
        List<Space> spaceList = spaceRepository.findAll();
        assertThat(spaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSpace() throws Exception {
        int databaseSizeBeforeUpdate = spaceRepository.findAll().size();
        space.setId(count.incrementAndGet());

        // Create the Space
        SpaceDTO spaceDTO = spaceMapper.toDto(space);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSpaceMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(spaceDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Space in the database
        List<Space> spaceList = spaceRepository.findAll();
        assertThat(spaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSpaceWithPatch() throws Exception {
        // Initialize the database
        spaceRepository.saveAndFlush(space);

        int databaseSizeBeforeUpdate = spaceRepository.findAll().size();

        // Update the space using partial update
        Space partialUpdatedSpace = new Space();
        partialUpdatedSpace.setId(space.getId());

        partialUpdatedSpace.title(UPDATED_TITLE).projectCode(UPDATED_PROJECT_CODE).icon(UPDATED_ICON);

        restSpaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSpace.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSpace))
            )
            .andExpect(status().isOk());

        // Validate the Space in the database
        List<Space> spaceList = spaceRepository.findAll();
        assertThat(spaceList).hasSize(databaseSizeBeforeUpdate);
        Space testSpace = spaceList.get(spaceList.size() - 1);
        assertThat(testSpace.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testSpace.getProjectCode()).isEqualTo(UPDATED_PROJECT_CODE);
        assertThat(testSpace.getIcon()).isEqualTo(UPDATED_ICON);
    }

    @Test
    @Transactional
    void fullUpdateSpaceWithPatch() throws Exception {
        // Initialize the database
        spaceRepository.saveAndFlush(space);

        int databaseSizeBeforeUpdate = spaceRepository.findAll().size();

        // Update the space using partial update
        Space partialUpdatedSpace = new Space();
        partialUpdatedSpace.setId(space.getId());

        partialUpdatedSpace.title(UPDATED_TITLE).projectCode(UPDATED_PROJECT_CODE).icon(UPDATED_ICON);

        restSpaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSpace.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSpace))
            )
            .andExpect(status().isOk());

        // Validate the Space in the database
        List<Space> spaceList = spaceRepository.findAll();
        assertThat(spaceList).hasSize(databaseSizeBeforeUpdate);
        Space testSpace = spaceList.get(spaceList.size() - 1);
        assertThat(testSpace.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testSpace.getProjectCode()).isEqualTo(UPDATED_PROJECT_CODE);
        assertThat(testSpace.getIcon()).isEqualTo(UPDATED_ICON);
    }

    @Test
    @Transactional
    void patchNonExistingSpace() throws Exception {
        int databaseSizeBeforeUpdate = spaceRepository.findAll().size();
        space.setId(count.incrementAndGet());

        // Create the Space
        SpaceDTO spaceDTO = spaceMapper.toDto(space);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSpaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, spaceDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(spaceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Space in the database
        List<Space> spaceList = spaceRepository.findAll();
        assertThat(spaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSpace() throws Exception {
        int databaseSizeBeforeUpdate = spaceRepository.findAll().size();
        space.setId(count.incrementAndGet());

        // Create the Space
        SpaceDTO spaceDTO = spaceMapper.toDto(space);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSpaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(spaceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Space in the database
        List<Space> spaceList = spaceRepository.findAll();
        assertThat(spaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSpace() throws Exception {
        int databaseSizeBeforeUpdate = spaceRepository.findAll().size();
        space.setId(count.incrementAndGet());

        // Create the Space
        SpaceDTO spaceDTO = spaceMapper.toDto(space);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSpaceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(spaceDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Space in the database
        List<Space> spaceList = spaceRepository.findAll();
        assertThat(spaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSpace() throws Exception {
        // Initialize the database
        spaceRepository.saveAndFlush(space);

        int databaseSizeBeforeDelete = spaceRepository.findAll().size();

        // Delete the space
        restSpaceMockMvc
            .perform(delete(ENTITY_API_URL_ID, space.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Space> spaceList = spaceRepository.findAll();
        assertThat(spaceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
