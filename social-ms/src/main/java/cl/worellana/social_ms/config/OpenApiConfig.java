package cl.worellana.social_ms.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI socialOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("IronFeed Social API")
                        .description("Follow and follower relationship endpoints for IronFeed.")
                        .version("v1"));
    }
}
