package com.sunshine.iti.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sunshine.iti.model.AdminUser;
import com.sunshine.iti.repository.AdminUserRepository;
import com.sunshine.iti.repository.AdmissionDetailRepository;
import com.sunshine.iti.repository.OtpVerificationRepository;
import com.sunshine.iti.security.JwtUtil;
import com.sunshine.iti.util.EmailHelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import com.sunshine.iti.repository.NoticeRepository;
import com.sunshine.iti.repository.StudyMaterialRepository;
import com.sunshine.iti.repository.GalleryImageRepository;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for unit tests
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminUserRepository adminUserRepository;

    @MockBean
    private AdmissionDetailRepository admissionDetailRepository;

    @MockBean
    private OtpVerificationRepository otpVerificationRepository;

    @MockBean
    private NoticeRepository noticeRepository;

    @MockBean
    private StudyMaterialRepository studyMaterialRepository;

    @MockBean
    private GalleryImageRepository galleryImageRepository;

    @MockBean
    private JavaMailSender mailSender;

    @MockBean
    private EmailHelper emailHelper;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private AdminUser mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new AdminUser("admin", "encodedPassword", "sunshineiti8@gmail.com");
        mockUser.setId(1L);
    }

    @Test
    void testSignup_Success() throws Exception {
        Mockito.when(adminUserRepository.findFirstByUsername(anyString())).thenReturn(Optional.empty());
        Mockito.when(adminUserRepository.findFirstByEmail(anyString())).thenReturn(Optional.empty());
        Mockito.when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        
        AdminUser savedUser = new AdminUser("newAdmin", "hashedPassword", "new@gmail.com");
        savedUser.setId(2L);
        Mockito.when(adminUserRepository.save(any(AdminUser.class))).thenReturn(savedUser);

        AdminUser requestUser = new AdminUser("newAdmin", "rawPassword", "new@gmail.com");

        mockMvc.perform(post("/api/admin/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("newAdmin"))
                .andExpect(jsonPath("$.id").value(2));
    }

    @Test
    void testSignup_UsernameExists() throws Exception {
        Mockito.when(adminUserRepository.findFirstByUsername("admin")).thenReturn(Optional.of(mockUser));

        AdminUser requestUser = new AdminUser("admin", "password123", "new@gmail.com");

        mockMvc.perform(post("/api/admin/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Username already exists"));
    }

    @Test
    void testLogin_Success() throws Exception {
        Mockito.when(adminUserRepository.findFirstByUsername("admin")).thenReturn(Optional.of(mockUser));
        Mockito.when(passwordEncoder.matches("password123", mockUser.getPassword())).thenReturn(true);
        Mockito.when(jwtUtil.generateToken("admin")).thenReturn("mocked-jwt-token");

        Map<String, String> credentials = new HashMap<>();
        credentials.put("username", "admin");
        credentials.put("password", "password123");

        mockMvc.perform(post("/api/admin/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mocked-jwt-token"))
                .andExpect(jsonPath("$.user.username").value("admin"));
    }

    @Test
    void testLogin_Failure_WrongPassword() throws Exception {
        Mockito.when(adminUserRepository.findFirstByUsername("admin")).thenReturn(Optional.of(mockUser));
        Mockito.when(passwordEncoder.matches("wrongpass", mockUser.getPassword())).thenReturn(false);

        Map<String, String> credentials = new HashMap<>();
        credentials.put("username", "admin");
        credentials.put("password", "wrongpass");

        mockMvc.perform(post("/api/admin/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid username or password"));
    }

    @Test
    void testLogin_Failure_UserNotFound() throws Exception {
        Mockito.when(adminUserRepository.findFirstByUsername("unknown")).thenReturn(Optional.empty());

        Map<String, String> credentials = new HashMap<>();
        credentials.put("username", "unknown");
        credentials.put("password", "password123");

        mockMvc.perform(post("/api/admin/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isUnauthorized());
    }
}
