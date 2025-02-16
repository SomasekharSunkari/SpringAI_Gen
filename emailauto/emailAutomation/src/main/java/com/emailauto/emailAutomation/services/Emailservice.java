package com.emailauto.emailAutomation.services;

import com.emailauto.emailAutomation.payload.Emailrequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class Emailservice {

    private final WebClient webClient;

    @Autowired
    Emailservice(WebClient.Builder wBuilder) {
        this.webClient = wBuilder.build();
    }

    @Value("${gemini.api.url}")
    String gemini_url;
    @Value("${gemini.api.key}")
    String gemini_key;

    public String genreateEmailReplay(Emailrequest emailRequest) {
        String prompt = buildPrompt(emailRequest);
        Map<String, Object> craft = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[] {
                                Map.of("text", prompt)
                        })
                });
        String response = webClient.post().uri(gemini_url + gemini_key).header("Content-type", "application/json")
                .bodyValue(craft)
                .retrieve().bodyToMono(String.class).block();
        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            // For Converting data from json ot java and vice versa
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        } catch (Exception e) {
            System.out.println("Error Happend in  Extracting the data from the response");
            return "Error Processing Request" + e.getMessage();
        }
    }

    private String buildPrompt(Emailrequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append(
                "Generate a professional email replay for following email content. Please don't generate a subject line with detail explonation ");
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone.");
        }
        prompt.append("\nOriginal Email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
