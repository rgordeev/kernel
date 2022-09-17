package ru.amethyst.kernel.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import ru.amethyst.kernel.domain.enumeration.BlockType;

/**
 * A Block.
 */
@Entity
@Table(name = "block")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Block implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private BlockType type;

    @Column(name = "suz_order")
    private Integer order;

    @Column(name = "payload")
    private String payload;

    @ManyToOne
    private Organization organization;

    @ManyToOne
    @JsonIgnoreProperties(value = { "organization", "owner" }, allowSetters = true)
    private Space space;

    @ManyToOne
    @JsonIgnoreProperties(value = { "organization", "space", "author" }, allowSetters = true)
    private Article article;

    @ManyToOne
    private User author;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Block id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BlockType getType() {
        return this.type;
    }

    public Block type(BlockType type) {
        this.setType(type);
        return this;
    }

    public void setType(BlockType type) {
        this.type = type;
    }

    public Integer getOrder() {
        return this.order;
    }

    public Block order(Integer order) {
        this.setOrder(order);
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public String getPayload() {
        return this.payload;
    }

    public Block payload(String payload) {
        this.setPayload(payload);
        return this;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public Organization getOrganization() {
        return this.organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public Block organization(Organization organization) {
        this.setOrganization(organization);
        return this;
    }

    public Space getSpace() {
        return this.space;
    }

    public void setSpace(Space space) {
        this.space = space;
    }

    public Block space(Space space) {
        this.setSpace(space);
        return this;
    }

    public Article getArticle() {
        return this.article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }

    public Block article(Article article) {
        this.setArticle(article);
        return this;
    }

    public User getAuthor() {
        return this.author;
    }

    public void setAuthor(User user) {
        this.author = user;
    }

    public Block author(User user) {
        this.setAuthor(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Block)) {
            return false;
        }
        return id != null && id.equals(((Block) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Block{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", order=" + getOrder() +
            ", payload='" + getPayload() + "'" +
            "}";
    }
}
