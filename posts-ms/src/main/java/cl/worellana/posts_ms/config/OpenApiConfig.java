package cl.worellana.posts_ms.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI postsOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("IronFeed Posts API")
                        .description("Post, reaction, comment, and global feed endpoints for IronFeed.")
                        .version("v1"));
    }
}
