package cl.worellana.users_ms.controller;

import cl.worellana.users_ms.model.dto.BaseResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class BaseController {

    private final String appName;
    private final String appVersion;

    public BaseController(@Value("${app.name}") String appName,
                          @Value("${app.version}") String appVersion) {
        this.appName = appName;
        this.appVersion = appVersion;
    }

    @GetMapping("")
    public BaseResponse base() {
        return new BaseResponse(appName, appVersion);
    }
}
