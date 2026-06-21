package com.sunshine.iti.controller;

import com.sunshine.iti.model.Notice;
import com.sunshine.iti.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/notices")
@CrossOrigin(origins = "*")
public class NoticeController {

    @Autowired
    private NoticeRepository noticeRepository;

    @GetMapping
    public List<Notice> getAllNotices() {
        return noticeRepository.findAll();
    }

    @PostMapping
    public Notice createNotice(@RequestBody Notice notice) {
        if (notice.getDate() == null) {
            notice.setDate(LocalDate.now());
        }
        return noticeRepository.save(notice);
    }

    @DeleteMapping("/{id}")
    public void deleteNotice(@PathVariable Long id) {
        noticeRepository.deleteById(id);
    }
}
