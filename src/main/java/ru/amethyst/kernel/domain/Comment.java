package ru.amethyst.kernel.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Comment.
 */
@Entity
@Table(name = "comment")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Comment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "text")
    private String text;

    @ManyToOne
    @JsonIgnoreProperties(value = { "organization", "space", "author" }, allowSetters = true)
    private Article article;

    @ManyToOne
    @JsonIgnoreProperties(value = { "organization", "space", "article", "author" }, allowSetters = true)
    private Block block;

    @ManyToOne
    private User author;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Comment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return this.text;
    }

    public Comment text(String text) {
        this.setText(text);
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Article getArticle() {
        return this.article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }

    public Comment article(Article article) {
        this.setArticle(article);
        return this;
    }

    public Block getBlock() {
        return this.block;
    }

    public void setBlock(Block block) {
        this.block = block;
    }

    public Comment block(Block block) {
        this.setBlock(block);
        return this;
    }

    public User getAuthor() {
        return this.author;
    }

    public void setAuthor(User user) {
        this.author = user;
    }

    public Comment author(User user) {
        this.setAuthor(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Comment)) {
            return false;
        }
        return id != null && id.equals(((Comment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Comment{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            "}";
    }
}
