package cl.worellana.posts_ms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class PostsMsApplication {

	public static void main(String[] args) {
		SpringApplication.run(PostsMsApplication.class, args);
	}

}
