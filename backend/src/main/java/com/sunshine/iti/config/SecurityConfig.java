package com.sunshine.iti.config;

import com.sunshine.iti.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configure(http))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(HttpMethod.POST, "/api/admin/login", "/api/admin/forgot-password", "/api/admin/forgot-username", "/api/admin/reset-password").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/gallery/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/notices/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/study-materials/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/admissions").permitAll() // Students submit admission form
                .requestMatchers(HttpMethod.GET, "/api/admissions/search").permitAll() // Check admission status
                .requestMatchers(HttpMethod.POST, "/api/inquiries").permitAll() // Contact Us
                .requestMatchers(HttpMethod.GET, "/api/admissions/*/files/**").permitAll() // Allow serving admission photos/docs without auth token
                .requestMatchers(HttpMethod.GET, "/api/fees/student/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/fees").permitAll() // Pay fee
                .requestMatchers(HttpMethod.GET, "/api/results/student/**").permitAll()
                
                // Protected endpoints
                .requestMatchers("/api/admin/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/gallery").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/gallery/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/notices").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/notices/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/study-materials").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/study-materials/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/upload").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/admissions").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/admissions/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/admissions/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/inquiries").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/inquiries/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/inquiries/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/fees").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/fees/pending").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/fees/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/results/student/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/results/**").authenticated()
                
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
