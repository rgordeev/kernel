package ru.amethyst.kernel.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import ru.amethyst.kernel.domain.Article;

/**
 * Spring Data JPA repository for the Article entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    @Query("select article from Article article where article.author.login = ?#{principal.preferredUsername}")
    List<Article> findByAuthorIsCurrentUser();
}
