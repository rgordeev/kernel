package ru.amethyst.kernel.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.UUID;
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
import ru.amethyst.kernel.domain.Attachment;
import ru.amethyst.kernel.repository.AttachmentRepository;
import ru.amethyst.kernel.service.dto.AttachmentDTO;
import ru.amethyst.kernel.service.mapper.AttachmentMapper;

/**
 * Integration tests for the {@link AttachmentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AttachmentResourceIT {

    private static final UUID DEFAULT_UUID = UUID.randomUUID();
    private static final UUID UPDATED_UUID = UUID.randomUUID();

    private static final String DEFAULT_URI = "AAAAAAAAAA";
    private static final String UPDATED_URI = "BBBBBBBBBB";

    private static final String DEFAULT_FILE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FILE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_MIME_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_MIME_TYPE = "BBBBBBBBBB";

    private static final Long DEFAULT_LENGTH = 1L;
    private static final Long UPDATED_LENGTH = 2L;

    private static final String ENTITY_API_URL = "/api/attachments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private AttachmentMapper attachmentMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAttachmentMockMvc;

    private Attachment attachment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Attachment createEntity(EntityManager em) {
        Attachment attachment = new Attachment()
            .uuid(DEFAULT_UUID)
            .uri(DEFAULT_URI)
            .fileName(DEFAULT_FILE_NAME)
            .mimeType(DEFAULT_MIME_TYPE)
            .length(DEFAULT_LENGTH);
        return attachment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Attachment createUpdatedEntity(EntityManager em) {
        Attachment attachment = new Attachment()
            .uuid(UPDATED_UUID)
            .uri(UPDATED_URI)
            .fileName(UPDATED_FILE_NAME)
            .mimeType(UPDATED_MIME_TYPE)
            .length(UPDATED_LENGTH);
        return attachment;
    }

    @BeforeEach
    public void initTest() {
        attachment = createEntity(em);
    }

    @Test
    @Transactional
    void createAttachment() throws Exception {
        int databaseSizeBeforeCreate = attachmentRepository.findAll().size();
        // Create the Attachment
        AttachmentDTO attachmentDTO = attachmentMapper.toDto(attachment);
        restAttachmentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attachmentDTO))
            )
            .andExpect(status().isCreated());

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll();
        assertThat(attachmentList).hasSize(databaseSizeBeforeCreate + 1);
        Attachment testAttachment = attachmentList.get(attachmentList.size() - 1);
        assertThat(testAttachment.getUuid()).isEqualTo(DEFAULT_UUID);
        assertThat(testAttachment.getUri()).isEqualTo(DEFAULT_URI);
        assertThat(testAttachment.getFileName()).isEqualTo(DEFAULT_FILE_NAME);
        assertThat(testAttachment.getMimeType()).isEqualTo(DEFAULT_MIME_TYPE);
        assertThat(testAttachment.getLength()).isEqualTo(DEFAULT_LENGTH);
    }

    @Test
    @Transactional
    void createAttachmentWithExistingId() throws Exception {
        // Create the Attachment with an existing ID
        attachment.setId(1L);
        AttachmentDTO attachmentDTO = attachmentMapper.toDto(attachment);

        int databaseSizeBeforeCreate = attachmentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAttachmentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attachmentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll();
        assertThat(attachmentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAttachments() throws Exception {
        // Initialize the database
        attachmentRepository.saveAndFlush(attachment);

        // Get all the attachmentList
        restAttachmentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(attachment.getId().intValue())))
            .andExpect(jsonPath("$.[*].uuid").value(hasItem(DEFAULT_UUID.toString())))
            .andExpect(jsonPath("$.[*].uri").value(hasItem(DEFAULT_URI)))
            .andExpect(jsonPath("$.[*].fileName").value(hasItem(DEFAULT_FILE_NAME)))
            .andExpect(jsonPath("$.[*].mimeType").value(hasItem(DEFAULT_MIME_TYPE)))
            .andExpect(jsonPath("$.[*].length").value(hasItem(DEFAULT_LENGTH.intValue())));
    }

    @Test
    @Transactional
    void getAttachment() throws Exception {
        // Initialize the database
        attachmentRepository.saveAndFlush(attachment);

        // Get the attachment
        restAttachmentMockMvc
            .perform(get(ENTITY_API_URL_ID, attachment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(attachment.getId().intValue()))
            .andExpect(jsonPath("$.uuid").value(DEFAULT_UUID.toString()))
            .andExpect(jsonPath("$.uri").value(DEFAULT_URI))
            .andExpect(jsonPath("$.fileName").value(DEFAULT_FILE_NAME))
            .andExpect(jsonPath("$.mimeType").value(DEFAULT_MIME_TYPE))
            .andExpect(jsonPath("$.length").value(DEFAULT_LENGTH.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingAttachment() throws Exception {
        // Get the attachment
        restAttachmentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAttachment() throws Exception {
        // Initialize the database
        attachmentRepository.saveAndFlush(attachment);

        int databaseSizeBeforeUpdate = attachmentRepository.findAll().size();

        // Update the attachment
        Attachment updatedAttachment = attachmentRepository.findById(attachment.getId()).get();
        // Disconnect from session so that the updates on updatedAttachment are not directly saved in db
        em.detach(updatedAttachment);
        updatedAttachment
            .uuid(UPDATED_UUID)
            .uri(UPDATED_URI)
            .fileName(UPDATED_FILE_NAME)
            .mimeType(UPDATED_MIME_TYPE)
            .length(UPDATED_LENGTH);
        AttachmentDTO attachmentDTO = attachmentMapper.toDto(updatedAttachment);

        restAttachmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, attachmentDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attachmentDTO))
            )
            .andExpect(status().isOk());

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
        Attachment testAttachment = attachmentList.get(attachmentList.size() - 1);
        assertThat(testAttachment.getUuid()).isEqualTo(UPDATED_UUID);
        assertThat(testAttachment.getUri()).isEqualTo(UPDATED_URI);
        assertThat(testAttachment.getFileName()).isEqualTo(UPDATED_FILE_NAME);
        assertThat(testAttachment.getMimeType()).isEqualTo(UPDATED_MIME_TYPE);
        assertThat(testAttachment.getLength()).isEqualTo(UPDATED_LENGTH);
    }

    @Test
    @Transactional
    void putNonExistingAttachment() throws Exception {
        int databaseSizeBeforeUpdate = attachmentRepository.findAll().size();
        attachment.setId(count.incrementAndGet());

        // Create the Attachment
        AttachmentDTO attachmentDTO = attachmentMapper.toDto(attachment);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttachmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, attachmentDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attachmentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAttachment() throws Exception {
        int databaseSizeBeforeUpdate = attachmentRepository.findAll().size();
        attachment.setId(count.incrementAndGet());

        // Create the Attachment
        AttachmentDTO attachmentDTO = attachmentMapper.toDto(attachment);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttachmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attachmentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAttachment() throws Exception {
        int databaseSizeBeforeUpdate = attachmentRepository.findAll().size();
        attachment.setId(count.incrementAndGet());

        // Create the Attachment
        AttachmentDTO attachmentDTO = attachmentMapper.toDto(attachment);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttachmentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attachmentDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAttachmentWithPatch() throws Exception {
        // Initialize the database
        attachmentRepository.saveAndFlush(attachment);

        int databaseSizeBeforeUpdate = attachmentRepository.findAll().size();

        // Update the attachment using partial update
        Attachment partialUpdatedAttachment = new Attachment();
        partialUpdatedAttachment.setId(attachment.getId());

        partialUpdatedAttachment.uri(UPDATED_URI).mimeType(UPDATED_MIME_TYPE);

        restAttachmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttachment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAttachment))
            )
            .andExpect(status().isOk());

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
        Attachment testAttachment = attachmentList.get(attachmentList.size() - 1);
        assertThat(testAttachment.getUuid()).isEqualTo(DEFAULT_UUID);
        assertThat(testAttachment.getUri()).isEqualTo(UPDATED_URI);
        assertThat(testAttachment.getFileName()).isEqualTo(DEFAULT_FILE_NAME);
        assertThat(testAttachment.getMimeType()).isEqualTo(UPDATED_MIME_TYPE);
        assertThat(testAttachment.getLength()).isEqualTo(DEFAULT_LENGTH);
    }

    @Test
    @Transactional
    void fullUpdateAttachmentWithPatch() throws Exception {
        // Initialize the database
        attachmentRepository.saveAndFlush(attachment);

        int databaseSizeBeforeUpdate = attachmentRepository.findAll().size();

        // Update the attachment using partial update
        Attachment partialUpdatedAttachment = new Attachment();
        partialUpdatedAttachment.setId(attachment.getId());

        partialUpdatedAttachment
            .uuid(UPDATED_UUID)
            .uri(UPDATED_URI)
            .fileName(UPDATED_FILE_NAME)
            .mimeType(UPDATED_MIME_TYPE)
            .length(UPDATED_LENGTH);

        restAttachmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttachment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAttachment))
            )
            .andExpect(status().isOk());

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
        Attachment testAttachment = attachmentList.get(attachmentList.size() - 1);
        assertThat(testAttachment.getUuid()).isEqualTo(UPDATED_UUID);
        assertThat(testAttachment.getUri()).isEqualTo(UPDATED_URI);
        assertThat(testAttachment.getFileName()).isEqualTo(UPDATED_FILE_NAME);
        assertThat(testAttachment.getMimeType()).isEqualTo(UPDATED_MIME_TYPE);
        assertThat(testAttachment.getLength()).isEqualTo(UPDATED_LENGTH);
    }

    @Test
    @Transactional
    void patchNonExistingAttachment() throws Exception {
        int databaseSizeBeforeUpdate = attachmentRepository.findAll().size();
        attachment.setId(count.incrementAndGet());

        // Create the Attachment
        AttachmentDTO attachmentDTO = attachmentMapper.toDto(attachment);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttachmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, attachmentDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(attachmentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAttachment() throws Exception {
        int databaseSizeBeforeUpdate = attachmentRepository.findAll().size();
        attachment.setId(count.incrementAndGet());

        // Create the Attachment
        AttachmentDTO attachmentDTO = attachmentMapper.toDto(attachment);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttachmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(attachmentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAttachment() throws Exception {
        int databaseSizeBeforeUpdate = attachmentRepository.findAll().size();
        attachment.setId(count.incrementAndGet());

        // Create the Attachment
        AttachmentDTO attachmentDTO = attachmentMapper.toDto(attachment);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttachmentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(attachmentDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAttachment() throws Exception {
        // Initialize the database
        attachmentRepository.saveAndFlush(attachment);

        int databaseSizeBeforeDelete = attachmentRepository.findAll().size();

        // Delete the attachment
        restAttachmentMockMvc
            .perform(delete(ENTITY_API_URL_ID, attachment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Attachment> attachmentList = attachmentRepository.findAll();
        assertThat(attachmentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
