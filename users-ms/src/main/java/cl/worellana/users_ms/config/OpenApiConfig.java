package cl.worellana.users_ms.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI usersOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("IronFeed Users API")
                        .description("Authentication, user profile, and user summary endpoints for IronFeed.")
                        .version("v1"));
    }
}
