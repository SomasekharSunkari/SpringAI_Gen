package com.emailauto.emailAutomation.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.emailauto.emailAutomation.payload.Emailrequest;
import com.emailauto.emailAutomation.services.Emailservice;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EmailautoController {
    private final Emailservice emailservice;

    @PostMapping("/generate")
    ResponseEntity<String> generateEmail(@RequestBody Emailrequest emailrequest) {
        String response = emailservice.genreateEmailReplay(emailrequest);
        return ResponseEntity.ok(response);
    }

}
