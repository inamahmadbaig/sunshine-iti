package com.sunshine.iti;

import com.sunshine.iti.model.Notice;
import com.sunshine.iti.model.AdminUser;
import com.sunshine.iti.model.StudyMaterial;
import com.sunshine.iti.model.GalleryImage;
import com.sunshine.iti.repository.NoticeRepository;
import com.sunshine.iti.repository.AdminUserRepository;
import com.sunshine.iti.repository.StudyMaterialRepository;
import com.sunshine.iti.repository.GalleryImageRepository;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import java.io.ByteArrayOutputStream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;

@SpringBootApplication
public class ItiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ItiApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(NoticeRepository noticeRepository, AdminUserRepository adminUserRepository, StudyMaterialRepository studyMaterialRepository, GalleryImageRepository galleryImageRepository, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
		return (args) -> {
			if (noticeRepository.count() == 0) {
				noticeRepository.save(new Notice("NCVT Main Examination Schedule August 2026 Released", LocalDate.now().minusDays(1), true, "#"));
				noticeRepository.save(new Notice("Admissions Open for Session 2026-27 in Electrician & Fitter Trades", LocalDate.now().minusDays(2), true, "#"));
				noticeRepository.save(new Notice("Campus Placement Drive by Suzuki Motors on 25th June 2026", LocalDate.now().minusDays(3), true, "#"));
				noticeRepository.save(new Notice("Scholarship Portal Open for SC/ST/OBC Students - Apply Online", LocalDate.now().minusDays(5), false, "#"));
				noticeRepository.save(new Notice("List of Shortlisted Candidates for Apprenticeship Program", LocalDate.now().minusDays(7), false, "#"));
			}
			if (adminUserRepository.count() == 0) {
				AdminUser defaultAdmin = new AdminUser("admin", passwordEncoder.encode("admin123"), "sunshineiti8@gmail.com");
				adminUserRepository.save(defaultAdmin);
				System.out.println("Default admin user initialized successfully: username=admin, password=admin123");
			} else {
				adminUserRepository.findAll().forEach(admin -> {
					if (!"sunshineiti8@gmail.com".equalsIgnoreCase(admin.getEmail())) {
						admin.setEmail("sunshineiti8@gmail.com");
						adminUserRepository.save(admin);
						System.out.println("Updated email for admin user " + admin.getUsername() + " to sunshineiti8@gmail.com");
					}
				});
			}
			
			// Always clear and re-seed to update database schema entries
			studyMaterialRepository.deleteAll();
			if (studyMaterialRepository.count() == 0) {
				// Syllabus
				createDummyMaterial(studyMaterialRepository, "Electrician Syllabus NCVT 2026", "इलेक्ट्रीशियन पाठ्यक्रम एनसीवीटी 2026", "Electrician", "इलेक्ट्रीशियन", "SYLLABUS", "electrician_syllabus_2026.pdf", new String[] {
					"### Course Overview",
					"The Electrician trade at Sunshine ITI is a 2-year (4 semesters) program approved by the NCVT, Govt of India. It prepares students for installing, maintaining, and repairing electrical wiring, equipment, and fixtures.",
					"### First Year Syllabus",
					"- Safety Rules & First Aid Practices in Electrical Workshops",
					"- Fundamental Electrical Laws (Ohm's Law, Kirchhoff's Laws)",
					"- Hand Tools, Wire Joints, and Soldering Techniques",
					"- AC Circuits, Magnetism, and Electromagnetic Induction",
					"- Underground Cables & Earthing Systems",
					"- Semiconductor Diodes, Transistors, and Power Supplies",
					"### Second Year Syllabus",
					"- DC Generators & DC Motors (Construction, Wiring, Control)",
					"- Single Phase & Three Phase AC Alternators and Motors",
					"- Transformers (Working Principles, Testing, Cooling, Maintenance)",
					"- Electrical Measuring Instruments (Voltmeter, Ammeter, Wattmeter, Megger)",
					"- Power Generation, Transmission, and Distribution Networks",
					"- Industrial Wiring & Control Panels (Relays, Solenoids, PLC Basics)"
				}, new String[] {
					"### पाठ्यक्रम विवरण",
					"सनशाइन आईटीआई में इलेक्ट्रीशियन ट्रेड भारत सरकार के एनसीवीटी (NCVT) द्वारा स्वीकृत 2-वर्षीय (4 सेमेस्टर) कार्यक्रम है। यह छात्रों को इलेक्ट्रिकल वायरिंग, उपकरणों और फिटिंग को स्थापित करने, रखरखाव करने और मरम्मत करने के लिए तैयार करता है।",
					"### प्रथम वर्ष का पाठ्यक्रम",
					"- इलेक्ट्रिकल वर्कशॉप में सुरक्षा नियम और प्राथमिक चिकित्सा अभ्यास",
					"- मौलिक विद्युत नियम (ओम का नियम, किरचॉफ का नियम)",
					"- हस्त उपकरण, वायर जॉइंट और सोल्डरिंग तकनीक",
					"- एसी सर्किट, चुंबकत्व और विद्युत छटपटाहट",
					"- भूमिगत केबल और अर्थिंग सिस्टम",
					"- सेमीकंडक्टर डायोड, ट्रांजिस्टर और पावर सप्लाई",
					"### द्वितीय वर्ष का पाठ्यक्रम",
					"- डीसी जनरेटर और डीसी मोटर (निर्माण, वायरिंग, नियंत्रण)",
					"- सिंगल फेज और थ्री फेज एसी अल्टरनेटर और मोटर्स",
					"- ट्रांसफार्मर (कार्य सिद्धांत, परीक्षण, कूलिंग, रखरखाव)",
					"- इलेक्ट्रिकल मापन उपकरण (वोल्टमीटर, एमीटर, वाटमीटर, मेगर)",
					"- बिजली उत्पादन, संचरण और वितरण नेटवर्क",
					"- औद्योगिक वायरिंग और नियंत्रण पैनल (रिले, सोलेनोइड, पीएलसी मूल बातें)"
				});
				createDummyMaterial(studyMaterialRepository, "DCA Course Scheme and Syllabus", "डीसीए कोर्स स्कीम और पाठ्यक्रम", "DCA", "डीसीए (DCA)", "SYLLABUS", "dca_syllabus_scheme.pdf", new String[] {
					"### Course Overview",
					"DCA is a 1-year (2 semesters) professional program offering fundamental training in computer applications, IT systems, and business tools.",
					"### First Semester Syllabus",
					"- Computer Fundamentals: Hardware, Software, Input/Output Devices",
					"- Operating Systems: Windows, DOS, and basic Linux commands",
					"- MS Office Suite: MS Word (formatting), MS Excel (spreadsheets & formulas), MS PowerPoint (presentations)",
					"- Hindi and English Typing: Mangal (Unicode) and Kruti Dev fonts",
					"- Internet & Communication: Web Browsers, Emails, Search Engines",
					"### Second Semester Syllabus",
					"- Financial Accounting: Tally Prime with GST configuration",
					"- Desktop Publishing (DTP): Photoshop, CorelDRAW, PageMaker",
					"- Programming Basics: C Language Fundamentals and OOP concepts",
					"- Database Management: Access and Basic SQL Queries",
					"- Project Work: Building a business database and document portfolio"
				}, new String[] {
					"### पाठ्यक्रम विवरण",
					"DCA एक 1-वर्षीय (2 सेमेस्टर) व्यावसायिक कार्यक्रम है जो कंप्यूटर एप्लीकेशन, आईटी सिस्टम और व्यावसायिक उपकरणों में मौलिक प्रशिक्षण प्रदान करता है।",
					"### प्रथम सेमेस्टर पाठ्यक्रम",
					"- कंप्यूटर के मूल सिद्धांत: हार्डवेयर, सॉफ्टवेयर, इनपुट/आउटपुट डिवाइस",
					"- Operating System: विंडोज, डॉस और बुनियादी लिनक्स कमांड",
					"- एमएस ऑफिस सूट: एमएस वर्ड (फॉर्मेटिंग), एमएस एक्सेल (स्प्रेडशीट और फॉर्मूले), एमएस पावरपॉइंट (प्रस्तुति)",
					"- हिंदी और अंग्रेजी टाइपिंग: मंगल (यूनिकोड) और कृति देव फॉन्ट",
					"- इंटरनेट और संचार: वेब ब्राउज़र, ईमेल, सर्च इंजन",
					"### द्वितीय सेमेस्टर पाठ्यक्रम",
					"- वित्तीय लेखांकन: जीएसटी कॉन्फ़िगरेशन के साथ टैली प्राइम",
					"- डेस्कटॉप पब्लिशिंग (DTP): फोटोशॉप, कोरलड्रॉ, पेजमेकर",
					"- प्रोग्रामिंग की मूल बातें: सी भाषा के मूल सिद्धांत और ओओपी (OOP) अवधारणाएं",
					"- डेटाबेस प्रबंधन: एक्सेस और बुनियादी एसक्यूएल (SQL) क्वेरी",
					"- परियोजना कार्य: एक व्यावसायिक डेटाबेस और दस्तावेज़ पोर्टफोलियो बनाना"
				});
				createDummyMaterial(studyMaterialRepository, "Health Sanitary Inspector Syllabus", "स्वास्थ्य स्वच्छता निरीक्षक पाठ्यक्रम", "Health Sanitary Inspector", "स्वास्थ्य स्वच्छता निरीक्षक", "SYLLABUS", "hsi_syllabus_2026.pdf", new String[] {
					"### Course Overview",
					"Health Sanitary Inspector is a 1-year vocational program preparing students for sanitation, hygiene, and public health roles in Municipalities, Railways, and Hospitals.",
					"### First Semester Syllabus",
					"- Introduction to Public Health, Personal Hygiene, and Sanitation",
					"- Human Anatomy & Physiology: Body systems and organs",
					"- Medical Microbiology: Bacteria, Viruses, and Parasites",
					"- Environmental Sanitation: Waste collection and transport",
					"- Water Supply Management: Purification methods & Chlorine tests",
					"### Second Semester Syllabus",
					"- Municipal Solid Waste Management & Incineration",
					"- Liquid Waste & Sewage Treatment Plants (STP)",
					"- Food Safety & Nutrition: Food Adulteration Act and FSSAI standards",
					"- Food Epidemiology: Outbreak control, vaccination, and sanitization",
					"- First Aid, CPR, and Disaster Emergency Response",
					"- Field Work: Regular inspections of local dairies, markets, and water reservoirs"
				}, new String[] {
					"### पाठ्यक्रम विवरण",
					"स्वास्थ्य सेनेटरी इंस्पेक्टर (Health Sanitary Inspector) एक 1-वर्षीय व्यावसायिक कार्यक्रम है जो छात्रों को नगर पालिकाओं, रेलवे और अस्पतालों में स्वच्छता, स्वास्थ्य और सार्वजनिक स्वच्छता भूमिकाओं के लिए तैयार करता है।",
					"### प्रथम सेमेस्टर पाठ्यक्रम",
					"- सार्वजनिक स्वास्थ्य, व्यक्तिगत स्वच्छता और स्वच्छता का परिचय",
					"- मानव शरीर रचना विज्ञान और शरीर क्रिया विज्ञान: शरीर प्रणाली और अंग",
					"- चिकित्सा सूक्ष्म जीव विज्ञान: बैक्टीरिया, वायरस और परजीवी",
					"- पर्यावरणीय स्वच्छता: अपशिष्ट संग्रह और परिवहन",
					"- जलापूर्ति प्रबंधन: शुद्धिकरण विधियाँ और क्लोरीन परीक्षण",
					"### द्वितीय सेमेस्टर पाठ्यक्रम",
					"- नगर पालिका ठोस अपशिष्ट प्रबंधन और भस्मीकरण (Incineration)",
					"- तरल अपशिष्ट और सीवेज उपचार संयंत्र (STP)",
					"- खाद्य सुरक्षा और पोषण: खाद्य अपमिश्रण अधिनियम और एफएसएसएआई (FSSAI) मानक",
					"- खाद्य महामारी विज्ञान: बीमारी का प्रकोप नियंत्रण, टीकाकरण और स्वच्छता",
					"- प्राथमिक चिकित्सा, सीपीआर और आपदा आपातकालीन प्रतिक्रिया",
					"- Field Work: स्थानीय डेयरियों, बाजारों और जल जलाशयों का नियमित निरीक्षण"
				});
				createDummyMaterial(studyMaterialRepository, "PGDCA Course Scheme and Syllabus", "पीजीडीसीए कोर्स स्कीम और पाठ्यक्रम", "PGDCA", "पीजीडीसीए (PGDCA)", "SYLLABUS", "pgdca_syllabus_scheme.pdf", new String[] {
					"### Course Overview",
					"PGDCA is a 1-year postgraduate diploma designed for graduates aiming to enter the IT sector with strong programming and database skills.",
					"### First Semester Syllabus",
					"- Information Technology & System Analysis",
					"- Programming in C: Variables, Arrays, Functions, and Pointers",
					"- Object-Oriented Programming (OOP) in C++",
					"- Database Management Systems (DBMS) using SQL Server and Oracle",
					"- Web Development: HTML5, CSS3, and JavaScript basics",
					"### Second Semester Syllabus",
					"- Software Engineering & System Development Life Cycle (SDLC)",
					"- Advanced Web Development & Intro to React/Node.js",
					"- Python Programming: Syntaxes, Scripts, and basic Data Analysis",
					"- Business Accounting: Tally Prime & GST Taxation",
					"- Network Security & Cryptography Basics",
					"- Major Project: Developing a functional web application or billing software"
				}, new String[] {
					"### पाठ्यक्रम विवरण",
					"PGDCA एक 1-वर्षीय स्नातकोत्तर डिप्लोमा है जो उन स्नातकों के लिए डिज़ाइन किया गया है जो मजबूत प्रोग्रामिंग और डेटाबेस कौशल के साथ आईटी क्षेत्र में प्रवेश करना चाहते हैं।",
					"### प्रथम सेमेस्टर पाठ्यक्रम",
					"- सूचना प्रौद्योगिकी और सिस्टम विश्लेषण",
					"- सी में प्रोग्रामिंग: वेरिएबल्स, एरे, फंक्शन और पॉइंटर्स",
					"- सी++ में ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग (OOP)",
					"- एसक्यूएल सर्वर और ओरेकल का उपयोग करके डेटाबेस प्रबंधन प्रणाली (DBMS)",
					"- वेब डेवलपमेंट: HTML5, CSS3 और जावास्क्रिप्ट बेसिक्स",
					"### द्वितीय सेमेस्टर पाठ्यक्रम",
					"- सॉफ्टवेयर इंजीनियरिंग और सिस्टम डेवलपमेंट लाइफ साइकिल (SDLC)",
					"- उन्नत वेब विकास और रिएक्ट/नोड.जेएस का परिचय",
					"- पायथन प्रोग्रामिंग: सिंटैक्स, स्क्रिप्ट और बुनियादी डेटा विश्लेषण",
					"- व्यावसायिक लेखांकन: टैली प्राइम और जीएसटी कराधान",
					"- नेटवर्क सुरक्षा और क्रिप्टोग्राफी मूल बातें",
					"- प्रमुख परियोजना (Major Project): एक कार्यात्मक वेब एप्लिकेशन या बिलिंग सॉफ़्टवेयर विकसित करना"
				});

				// Previous Year Papers
				createDummyMaterial(studyMaterialRepository, "Electrician Theory Paper 2025", "इलेक्ट्रीशियन थ्योरी पेपर 2025", "Electrician", "इलेक्ट्रीशियन", "PREVIOUS_PAPER", "electrician_theory_2025.pdf", new String[] {
					"### Question Paper Details",
					"Exam: NCVT AITT Theory  |  Duration: 2 Hours  |  Max Marks: 100",
					"### Sample Questions (Theory)",
					"Q1. Which rule is used to determine the direction of rotation of a DC motor armature?",
					"    A) Fleming's Right-Hand Rule   B) Fleming's Left-Hand Rule   C) Maxwell's Screw Rule   D) Lenz's Law",
					"    Answer: B (Fleming's Left-Hand Rule)",
					"",
					"Q2. What is the unit of specific resistance (resistivity)?",
					"    A) Ohm   B) Ohm-meter   C) Ohm/meter   D) Mho",
					"    Answer: B (Ohm-meter)",
					"",
					"Q3. Which type of transformer winding is connected directly to the AC supply line?",
					"    A) Secondary Winding   B) Primary Winding   C) Tertiary Winding   D) Auxiliary Winding",
					"    Answer: B (Primary Winding)",
					"",
					"Q4. What is the main purpose of providing a silica gel breather in a transformer?",
					"    A) To cool the transformer oil   B) To absorb moisture from incoming air   C) To filter dust particles   D) To measure oil level",
					"    Answer: B (To absorb moisture from incoming air)",
					"",
					"Q5. Which instrument is used to measure the insulation resistance of electrical installations?",
					"    A) Multimeter   B) Megger   C) Wattmeter   D) Energy Meter",
					"    Answer: B (Megger)"
				}, new String[] {
					"### प्रश्न पत्र विवरण",
					"परीक्षा: NCVT AITT थ्योरी | अवधि: 2 घंटे | अधिकतम अंक: 100",
					"### नमूना प्रश्न (थ्योरी)",
					"प्रश्न 1. डीसी मोटर आर्मेचर के घूमने की दिशा निर्धारित करने के लिए किस नियम का उपयोग किया जाता है?",
					"    A) फ्लेमिंग का दायां हाथ का नियम B) फ्लेमिंग का बायां हाथ का नियम C) मैक्सवेल का स्क्रू नियम D) लेंज का नियम",
					"    उत्तर: B (फ्लेमिंग का बायां हाथ का नियम)",
					"",
					"प्रश्न 2. विशिष्ट प्रतिरोध (प्रतिरोधकता) की इकाई क्या है?",
					"    A) ओम B) ओम-मीटर C) ओम/मीटर D) म्हो",
					"    उत्तर: B (ओम-मीटर)",
					"",
					"प्रश्न 3. किस प्रकार की ट्रांसफार्मर वाइंडिंग सीधे एसी आपूर्ति लाइन से जुड़ी होती है?",
					"    A) द्वितीयक वाइंडिंग B) प्राथमिक वाइंडिंग C) तृतीयक वाइंडिंग D) सहायक वाइंडिंग",
					"    उत्तर: B (प्राथमिक वाइंडिंग)",
					"",
					"प्रश्न 4. ट्रांसफार्मर में सिलिका जेल ब्रीदर लगाने का मुख्य उद्देश्य क्या है?",
					"    A) ट्रांसफार्मर तेल को ठंडा करना B) आने वाली हवा से नमी सोखना C) धूल के कणों को छानना D) तेल के स्तर को मापना",
					"    उत्तर: B (आने वाली हवा से नमी सोखना)",
					"",
					"प्रश्न 5. विद्युत प्रतिष्ठानों के इन्सुलेशन प्रतिरोध को मापने के लिए किस उपकरण का उपयोग किया जाता है?",
					"    A) मल्टीमीटर B) मेगर C) वाटमीटर D) ऊर्जा मीटर",
					"    उत्तर: B (मेगर)"
				});
				createDummyMaterial(studyMaterialRepository, "DCA Computer Fundamentals 2025", "डीसीए कंप्यूटर फंडामेंटल्स 2025", "DCA", "डीसीए (DCA)", "PREVIOUS_PAPER", "dca_fundamentals_2025.pdf", new String[] {
					"### Question Paper Details",
					"Exam: Semester I DCA Theory  |  Duration: 3 Hours  |  Max Marks: 80",
					"### Section A: Objective Questions",
					"Q1. Which memory is volatile in nature?",
					"    A) ROM   B) RAM   C) EPROM   D) Hard Disk",
					"    Answer: B (RAM)",
					"",
					"Q2. What is the shortcut key to paste copied text in MS Word?",
					"    A) Ctrl + C   B) Ctrl + V   C) Ctrl + P   D) Ctrl + Z",
					"    Answer: B (Ctrl + V)",
					"",
					"Q3. Which formula is correct to calculate the sum of cells A1 to A5 in MS Excel?",
					"    A) =SUM(A1..A5)   B) =SUM(A1:A5)   C) =ADD(A1:A5)   D) =TOTAL(A1:A5)",
					"    Answer: B (=SUM(A1:A5))",
					"### Section B: Theory Questions",
					"Q4. Define the term 'Operating System'. Explain the main differences between single-user and multi-user operating systems with examples.",
					"Q5. Draw a block diagram of the CPU. Explain the functions of the Control Unit (CU) and Arithmetic Logic Unit (ALU) in detail."
				}, new String[] {
					"### प्रश्न पत्र विवरण",
					"परीक्षा: सेमेस्टर I DCA थ्योरी | अवधि: 3 घंटे | अधिकतम अंक: 80",
					"### खंड अ: वस्तुनिष्ठ प्रश्न",
					"प्रश्न 1. कौन सी मेमोरी प्रकृति में अस्थिर (volatile) है?",
					"    A) रोम (ROM) B) रैम (RAM) C) ईप्रोम (EPROM) D) हार्ड डिस्क",
					"    उत्तर: B (रैम)",
					"",
					"प्रश्न 2. एमएस वर्ड में कॉपी किए गए टेक्स्ट को पेस्ट करने की शॉर्टकट कुंजी क्या है?",
					"    A) Ctrl + C B) Ctrl + V C) Ctrl + P D) Ctrl + Z",
					"    उत्तर: B (Ctrl + V)",
					"",
					"प्रश्न 3. एमएस एक्सेल में सेल A1 से A5 के योग की गणना करने के लिए कौन सा फॉर्मूला सही है?",
					"    A) =SUM(A1..A5) B) =SUM(A1:A5) C) =ADD(A1:A5) D) =TOTAL(A1:A5)",
					"    उत्तर: B (=SUM(A1:A5))",
					"### खंड ब: थ्योरी प्रश्न",
					"प्रश्न 4. 'ऑपरेटिंग सिस्टम' शब्द को परिभाषित करें। उदाहरणों के साथ सिंगल-यूज़र और मल्टी-यूज़र ऑपरेटिंग सिस्टम के बीच मुख्य अंतर समझाएं।",
					"प्रश्न 5. सीपीयू (CPU) का ब्लॉक आरेख बनाएं। नियंत्रण इकाई (CU) और अंकगणितीय तर्क इकाई (ALU) के कार्यों को विस्तार से समझाएं।"
				});
				createDummyMaterial(studyMaterialRepository, "HSI Workshop Calculation Paper 2024", "स्वास्थ्य स्वच्छता निरीक्षक वर्कशॉप कैलकुलेशन पेपर 2024", "Health Sanitary Inspector", "स्वास्थ्य स्वच्छता निरीक्षक", "PREVIOUS_PAPER", "hsi_workshop_calc_2024.pdf", new String[] {
					"### Question Paper Details",
					"Exam: Health Sanitary Inspector Annual Exam  |  Duration: 2.5 Hours  |  Max Marks: 75",
					"### Question Set",
					"Q1. Which of the following is a classic waterborne disease?",
					"    A) Malaria   B) Cholera   C) Tuberculosis   D) Influenza",
					"    Answer: B (Cholera)",
					"",
					"Q2. What is the recommended temperature range for the primary chamber of a medical waste incinerator?",
					"    A) 400 - 600 C   B) 800 - 850 C   C) 1100 - 1200 C   D) 1500 - 1800 C",
					"    Answer: B (800 - 850 C)",
					"",
					"Q3. What is the standard dose of chlorine required for disinfecting drinking water?",
					"    A) 0.1 - 0.2 ppm   B) 0.5 - 1.0 ppm   C) 2.0 - 5.0 ppm   D) 10.0 ppm",
					"    Answer: B (0.5 - 1.0 ppm)",
					"",
					"Q4. Explain the process of 'Composting'. Differentiate between aerobic and anaerobic composting methods.",
					"Q5. Describe the duties and responsibilities of a Health Sanitary Inspector during a cholera outbreak in a rural village."
				}, new String[] {
					"### प्रश्न पत्र विवरण",
					"परीक्षा: स्वास्थ्य सेनेटरी इंस्पेक्टर वार्षिक परीक्षा | अवधि: 2.5 घंटे | अधिकतम अंक: 75",
					"### प्रश्न सेट",
					"प्रश्न 1. निम्नलिखित में से कौन सा एक जलजनित रोग है?",
					"    A) मलेरिया B) हैजा (Cholera) C) तपेदिक D) इन्फ्लूएंजा",
					"    उत्तर: B (हैजा)",
					"",
					"प्रश्न 2. मेडिकल कचरा भस्मीकरण (incinerator) के प्राथमिक कक्ष के लिए अनुशंसित तापमान सीमा क्या है?",
					"    A) 400 - 600 C B) 800 - 850 C C) 1100 - 1200 C D) 1500 - 1800 C",
					"    उत्तर: B (800 - 850 C)",
					"",
					"प्रश्न 3. पीने के पानी को कीटाणुरहित करने के लिए आवश्यक क्लोरीन की मानक खुराक क्या है?",
					"    A) 0.1 - 0.2 ppm B) 0.5 - 1.0 ppm C) 2.0 - 5.0 ppm D) 10.0 ppm",
					"    उत्तर: B (0.5 - 1.0 ppm)",
					"",
					"प्रश्न 4. 'कम्पोस्टिंग' की प्रक्रिया को स्पष्ट कीजिए। वायवीय (aerobic) और अवायवीय (anaerobic) खाद बनाने के तरीकों में अंतर स्पष्ट कीजिए।",
					"प्रश्न 5. ग्रामीण गाँव में हैजा फैलने के दौरान स्वास्थ्य स्वच्छता निरीक्षक के कर्तव्यों और जिम्मेदारियों का वर्णन करें।"
				});

				// Scholarship Forms
				createDummyMaterial(studyMaterialRepository, "MP Post Matric Scholarship Form", "मध्य प्रदेश पोस्ट मैट्रिक छात्रवृत्ति फॉर्म", "All Trades", "सभी ट्रेड्स", "SCHOLARSHIP", "mp_scholarship_form_2026.pdf", new String[] {
					"### Scholarship Scheme Details",
					"The MP Post Matric Scholarship Scheme provides financial assistance to SC, ST, and OBC students pursuing higher education, including technical ITI programs.",
					"### Eligibility Criteria",
					"- Student must be a permanent resident of Madhya Pradesh.",
					"- Category must be SC, ST, or OBC.",
					"- Family annual income limits: SC/ST - Less than Rs. 6.0 Lakhs; OBC - Less than Rs. 3.0 Lakhs.",
					"- Attendance in the ITI program must be at least 75%.",
					"### Required Documents List",
					"1. MP Domicile Certificate (Mool Niwas Praman Patra)",
					"2. Valid Caste Certificate (issued by authorized SDM/Tehsildar)",
					"3. Valid Family Income Certificate (not older than 3 years)",
					"4. Student Aadhar Card (Must be linked with Active Bank Account & Mobile Number)",
					"5. Samagra ID Card (Family & Member ID)",
					"6. 10th / 12th Class Marksheets",
					"7. ITI Fee Receipt & Admission Confirmation Letter",
					"### Step-by-Step Application Process",
					"1. Visit the MP Scholarship Portal (MPTAAS) website.",
					"2. Complete student profiling using Aadhar OTP.",
					"3. Choose the 'Post Matric Scholarship' scheme.",
					"4. Enter Sunshine ITI admission details and MIS Code (PU23001071).",
					"5. Upload scanned documents and submit the application.",
					"6. Print the application form and submit a copy to the college office for verification."
				}, new String[] {
					"### छात्रवृत्ति योजना विवरण",
					"एमपी पोस्ट मैट्रिक छात्रवृत्ति योजना तकनीकी आईटीआई कार्यक्रमों सहित उच्च शिक्षा प्राप्त करने वाले अनुसूचित जाति, अनुसूचित जनजाति और अन्य पिछड़ा वर्ग के छात्रों को वित्तीय सहायता प्रदान करती है।",
					"### पात्रता मापदंड",
					"- छात्र मध्य प्रदेश का मूल निवासी होना चाहिए।",
					"- वर्ग अनुसूचित जाति, अनुसूचित जनजाति या अन्य पिछड़ा वर्ग होना चाहिए।",
					"- पारिवारिक वार्षिक आय सीमा: SC/ST - 6.0 लाख रुपये से कम; OBC - 3.0 लाख रुपये से कम।",
					"- आईटीआई कार्यक्रम में उपस्थिति कम से कम 75% होनी चाहिए।",
					"### आवश्यक दस्तावेजों की सूची",
					"1. एमपी मूल निवासी प्रमाण पत्र (मूल निवास प्रमाण पत्र)",
					"2. वैध जाति प्रमाण पत्र (सक्षम राजस्व अधिकारी द्वारा जारी)",
					"3. वैध पारिवारिक आय प्रमाण पत्र (3 वर्ष से अधिक पुराना नहीं)",
					"4. छात्र का आधार कार्ड (सक्रिय बैंक खाते और मोबाइल नंबर से लिंक होना अनिवार्य)",
					"5. समग्र आईडी कार्ड (परिवार और सदस्य आईडी)",
					"6. 10वीं / 12वीं कक्षा की अंकसूची",
					"7. आईटीआई शुल्क रसीद और प्रवेश पुष्टि पत्र",
					"### चरण-दर-चरण आवेदन प्रक्रिया",
					"1. एमपी स्कॉलरशिप पोर्टल (MPTAAS) की वेबसाइट पर जाएं।",
					"2. आधार ओटीपी का उपयोग करके छात्र प्रोफाइलिंग पूरी करें।",
					"3. 'पोस्ट मैट्रिक छात्रवृत्ति' योजना चुनें।",
					"4. सनशाइन आईटीआई प्रवेश विवरण और एमआईएस कोड (PU23001071) दर्ज करें।",
					"5. स्कैन किए गए दस्तावेज़ अपलोड करें और आवेदन जमा करें।",
					"6. आवेदन पत्र का प्रिंट लें और सत्यापन के लिए कॉलेज कार्यालय में एक प्रति जमा करें।"
				});
				createDummyMaterial(studyMaterialRepository, "National Scholarship Portal (NSP) Manual", "राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) नियमावली", "All Trades", "सभी ट्रेड्स", "SCHOLARSHIP", "nsp_user_manual.pdf", new String[] {
					"### About NSP",
					"The National Scholarship Portal (NSP) is a one-stop solution through which various scholarship schemes offered by Central Ministries, State Governments, and Union Territories are administered.",
					"### User Registration Steps",
					"1. Visit the official NSP Portal: scholarships.gov.in",
					"2. Click on 'New Registration' or 'Student Login'.",
					"3. Read the guidelines carefully and check the declaration boxes.",
					"4. Enter personal details: Domicile State, Scholarship Category, Student Name, DOB, Mobile, and Email.",
					"5. Provide Bank Account Details (IFSC Code, Account Number) and link Aadhar.",
					"6. Verify with OTP sent to the registered mobile number.",
					"### Document Verification",
					"After submission, the application is forwarded to Sunshine ITI (Institute level verification). The college administrator verifies the roll number, admission date, and attendance. Upon successful verification, it is forwarded to the District/State Nodal Officer for financial approval.",
					"### Important Guidelines",
					"- Double-check bank details. Wrong bank details lead to scholarship rejection.",
					"- Aadhar seeding with the bank account is mandatory for DBT (Direct Benefit Transfer)."
				}, new String[] {
					"### राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) के बारे में",
					"राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) एक वन-स्टॉप समाधान है जिसके माध्यम से केंद्र सरकार के मंत्रालयों, राज्य सरकारों और केंद्र शासित प्रदेशों द्वारा दी जाने वाली विभिन्न छात्रवृत्ति योजनाओं को संचालित किया जाता है।",
					"### उपयोगकर्ता पंजीकरण के चरण",
					"1. आधिकारिक NSP पोर्टल पर जाएं: scholarships.gov.in",
					"2. 'New Registration' या 'Student Login' पर क्लिक करें।",
					"3. दिशानिर्देशों को ध्यान से पढ़ें और स्व-घोषणा बक्सों को चेक करें।",
					"4. व्यक्तिगत विवरण दर्ज करें: मूल राज्य, छात्रवृत्ति श्रेणी, छात्र का नाम, जन्म तिथि, मोबाइल और ईमेल।",
					"5. बैंक खाता विवरण (IFSC कोड, खाता संख्या) प्रदान करें और आधार लिंक करें।",
					"6. पंजीकृत मोबाइल नंबर पर भेजे गए ओटीपी के साथ सत्यापित करें।",
					"### दस्तावेज़ सत्यापन प्रक्रिया",
					"जमा करने के बाद, आवेदन सनशाइन आईटीआई (संस्थान स्तर के सत्यापन) को भेजा जाता है। कॉलेज प्रशासक रोल नंबर, प्रवेश तिथि और उपस्थिति की पुष्टि करता है। सत्यापन सफल होने पर, इसे वित्तीय स्वीकृति के लिए जिला/राज्य नोडल अधिकारी को भेज दिया जाता है।",
					"### महत्वपूर्ण दिशानिर्देश",
					"- बैंक विवरणों की दोबारा जांच करें। गलत बैंक विवरण से छात्रवृत्ति निरस्त हो सकती है।",
					"- डीबीटी (Direct Benefit Transfer) के लिए बैंक खाते से आधार सीडिंग होना अनिवार्य है।"
				});

				// Academic Calendar
				createDummyMaterial(studyMaterialRepository, "Academic Calendar 2026-27 (Sunshine ITI)", "शैक्षणिक कैलेंडर 2026-27 (सनशाइन आईटीआई)", "All Trades", "सभी ट्रेड्स", "CALENDAR", "academic_calendar_2026_27.pdf", new String[] {
					"### Academic Term Schedule",
					"Session Duration: August 1, 2026 to July 31, 2027",
					"### Phase 1: August to October 2026",
					"- August 1, 2026: Commencement of Regular Classes & Orientation Programs",
					"- August 15, 2026: Independence Day Celebrations (Mandatory Attendance)",
					"- September 15, 2026: Engineers' Day & Model Exhibition Competition",
					"- October 2026: First Monthly Unit Test & Performance Review",
					"### Phase 2: November 2026 to January 2027",
					"- November 14, 2026: Annual Sports Week & Athletic Meet",
					"- December 2026: Semester Mid-term Examinations (Theory & Practical)",
					"- January 26, 2027: Republic Day Program & Student Awards Night",
					"### Phase 3: February to April 2027",
					"- February 2027: Second Unit Test & Project Synopsis Submission",
					"- March 15, 2027: Commencement of Industrial Training & Factory Visits",
					"- April 2027: Mock Practical Examinations & Viva-Voce Practice",
					"### Phase 4: May to July 2027",
					"- May 2027: Final Syllabus Revision & Extra Classes for Weak Students",
					"- June 2027: Hall Ticket Generation & Internal Assessments Upload",
					"- July 2027: NCVT AITT Final Theory (CBT) & Practical Examinations",
					"### Note on Attendance",
					"A minimum of 75% attendance is required to qualify for taking final exams."
				}, new String[] {
					"### शैक्षणिक सत्र अनुसूची",
					"सत्र की अवधि: 1 अगस्त, 2026 से 31 जुलाई, 2027",
					"### चरण 1: अगस्त से अक्टूबर 2026",
					"- 1 अगस्त, 2026: नियमित कक्षाओं और ओरिएंटेशन कार्यक्रमों की शुरुआत",
					"- 15 अगस्त, 2026: स्वतंत्रता दिवस समारोह (अनिवार्य उपस्थिति)",
					"- 15 सितंबर, 2026: इंजीनियर्स डे और मॉडल प्रदर्शनी प्रतियोगिता",
					"- अक्टूबर 2026: प्रथम मासिक यूनिट टेस्ट और प्रदर्शन समीक्षा",
					"### चरण 2: नवंबर 2026 से जनवरी 2027",
					"- 14 नवंबर, 2026: वार्षिक खेल सप्ताह और एथलेटिक मीट",
					"- दिसंबर 2026: सेमेस्टर मिड-टर्म परीक्षाएं (थ्योरी और प्रैक्टिकल)",
					"- 26 जनवरी, 2027: गणतंत्र दिवस कार्यक्रम और छात्र पुरस्कार समारोह",
					"### चरण 3: फरवरी से अप्रैल 2027",
					"- फरवरी 2027: दूसरा यूनिट टेस्ट और प्रोजेक्ट सिनॉप्सिस जमा करना",
					"- 15 मार्च, 2027: औद्योगिक प्रशिक्षण और फैक्ट्री दौरों की शुरुआत",
					"- अप्रैल 2027: मॉक प्रैक्टिकल परीक्षा और मौखिक (Viva-Voce) अभ्यास",
					"### चरण 4: मई से जुलाई 2027",
					"- मई 2027: अंतिम पाठ्यक्रम पुनरीक्षण और कमजोर छात्रों के लिए अतिरिक्त कक्षाएं",
					"- जून 2027: हॉल टिकट जनरेशन और आंतरिक मूल्यांकन अंक अपलोड करना",
					"- जुलाई 2027: NCVT AITT अंतिम थ्योरी (CBT) और प्रैक्टिकल परीक्षाएं",
					"### उपस्थिति पर विशेष ध्यान",
					"अंतिम परीक्षा देने के लिए अर्हता प्राप्त करने के लिए न्यूनतम 75% उपस्थिति आवश्यक है।"
				});
				createDummyMaterial(studyMaterialRepository, "Examination & Practical Training Schedule 2026", "परीक्षा और व्यावहारिक प्रशिक्षण समय सारणी 2026", "All Trades", "सभी ट्रेड्स", "CALENDAR", "exam_training_calendar_2026.pdf", new String[] {
					"### AITT Examination Guidelines",
					"Sunshine Private ITI College operates under the guidelines of DGT (Directorate General of Training) for NCVT All India Trade Tests (AITT).",
					"### Examination Timeline 2026",
					"- June 1 - June 10, 2026: Submission of Examination Fees & Form Verification",
					"- June 15 - June 20, 2026: Practical Exam Hall Ticket Download from NCVT MIS Portal",
					"- July 1 - July 5, 2026: Trade Practical Examinations (at Sunshine ITI Campus)",
					"- July 10 - July 25, 2026: Online CBT Theory Examinations (at designated central centers)",
					"- August 25, 2026: Declaration of Final Results on NCVT Portal",
					"### Practical Training Schedule",
					"To bridge the gap between classroom teaching and industry requirements, practical factory training is scheduled as follows:",
					"- Electrician: 15-day training at MP Electricity Board Substation, Seoni.",
					"- Health Sanitary Inspector: 15-day training at Municipal Corporation Waste Management Facility.",
					"- DCA / PGDCA: 10-day hands-on training on network servers and software troubleshooting at Sunshine ITI Computer Lab."
				}, new String[] {
					"### AITT परीक्षा दिशानिर्देश",
					"सनशाइन प्राइवेट आईटीआई कॉलेज एनसीवीटी ऑल इंडिया ट्रेड टेस्ट (AITT) के लिए डीजीटी (प्रशिक्षण महानिदेशालय) के दिशानिर्देशों के तहत काम करता है।",
					"### परीक्षा समय सारणी 2026",
					"- 1 जून - 10 जून, 2026: परीक्षा शुल्क जमा करना और फॉर्म सत्यापन",
					"- 15 जून - 20 जून, 2026: NCVT MIS पोर्टल से प्रैक्टिकल परीक्षा हॉल टिकट डाउनलोड",
					"- 1 जुलाई - 5 जुलाई, 2026: Practical परीक्षा (सनशाइन आईटीआई कैंपस में)",
					"- 10 जुलाई - 25 जुलाई, 2026: ऑनलाइन सीबीटी (CBT) थ्योरी परीक्षाएं (निर्धारित केंद्रों पर)",
					"- 25 अगस्त, 2026: एनसीवीटी पोर्टल पर अंतिम परिणामों की घोषणा",
					"### व्यावहारिक प्रशिक्षण (Practical Training) अनुसूची",
					"कक्षा शिक्षण और उद्योग की आवश्यकताओं के बीच के अंतर को पाटने के लिए, व्यावहारिक फैक्ट्री प्रशिक्षण की समय सारणी इस प्रकार है:",
					"- इलेक्ट्रीशियन: एमपी विद्युत मंडल सबस्टेशन, सिवनी में 15 दिवसीय प्रशिक्षण।",
					"- स्वास्थ्य स्वच्छता निरीक्षक: नगर पालिका अपशिष्ट प्रबंधन इकाई में 15 दिवसीय प्रशिक्षण।",
					"- DCA / PGDCA: सनशाइन आईटीआई कंप्यूटर लैब में नेटवर्क सर्वर और सॉफ्टवेयर समस्या निवारण पर 10 दिवसीय व्यावहारिक प्रशिक्षण।"
				});

				// Rules & Regulations
				createDummyMaterial(studyMaterialRepository, "Sunshine ITI Code of Conduct & Rules", "सनशाइन आईटीआई आचार संहिता और नियम", "All Trades", "सभी ट्रेड्स", "RULES", "college_rules_and_regulations.pdf", new String[] {
					"### General Discipline Guidelines",
					"All students at Sunshine Private ITI College are required to adhere to the code of conduct to ensure a healthy learning environment.",
					"### Main Rules & Regulations",
					"1. Attendance: Minimum 75% attendance is compulsory in both lectures and practical labs to appear in final AITT examinations.",
					"2. Uniform: Students must wear the prescribed college uniform on all working days. Casual dress is not allowed.",
					"3. Punctuality: Morning assembly starts at 9:00 AM. Latecomers will not be allowed to enter classrooms.",
					"4. ID Card: Wearing the college-issued Identity Card is mandatory at all times inside the college premises.",
					"5. Mobile Phones: Mobile phones must be kept on silent mode or switched off during classes and workshops.",
					"6. Safety Gear: While working in the Electrician lab, wearing insulated shoes and protective gear is mandatory.",
					"### Leave Procedure",
					"Any student taking leave must submit a written application signed by parents. Medical leaves must be supported by a doctor's certificate."
				}, new String[] {
					"### सामान्य अनुशासन दिशानिर्देश",
					"सनशाइन प्राइवेट आईटीआई कॉलेज के सभी छात्रों को एक स्वस्थ शिक्षण वातावरण सुनिश्चित करने के लिए आचार संहिता का पालन करना आवश्यक है।",
					"### मुख्य नियम और विनियम",
					"1. उपस्थिति: अंतिम AITT परीक्षाओं में बैठने के लिए व्याख्यान और व्यावहारिक प्रयोगशाला दोनों में न्यूनतम 75% उपस्थिति अनिवार्य है।",
					"2. गणवेश (Uniform): छात्रों को सभी कार्य दिवसों में निर्धारित कॉलेज ड्रेस पहनना आवश्यक है। कैजुअल ड्रेस की अनुमति नहीं है।",
					"3. समयपालन: सुबह की सभा 9:00 बजे शुरू होती है। देरी से आने वालों को कक्षाओं में प्रवेश करने की अनुमति नहीं दी जाएगी।",
					"4. पहचान पत्र: कॉलेज परिसर के अंदर हर समय कॉलेज द्वारा जारी पहचान पत्र (ID Card) पहनना अनिवार्य है।",
					"5. मोबाइल फोन: कक्षाओं और कार्यशालाओं के दौरान मोबाइल फोन को साइलेंट मोड पर या बंद रखना होगा।",
					"6. सुरक्षा उपकरण: इलेक्ट्रीशियन लैब में काम करते समय इंसुलेटेड जूते और सुरक्षात्मक उपकरण पहनना अनिवार्य है।",
					"### अवकाश प्रक्रिया",
					"अवकाश लेने वाले किसी भी छात्र को माता-पिता द्वारा हस्ताक्षरित लिखित आवेदन जमा करना होगा। चिकित्सा अवकाश के साथ डॉक्टर का प्रमाण पत्र होना चाहिए।"
				});
				createDummyMaterial(studyMaterialRepository, "Anti-Ragging Affidavits & Guidelines", "एंटी-रैगिंग शपथ पत्र और दिशानिर्देश", "All Trades", "सभी ट्रेड्स", "RULES", "anti_ragging_rules.pdf", new String[] {
					"### Zero Tolerance Policy",
					"Sunshine Private ITI College maintains a strict zero-tolerance policy towards ragging in any form. Ragging is a punishable criminal offense under UGC and State laws.",
					"### What Constitutes Ragging?",
					"- Any act of physical, mental, or emotional abuse, harassment, or teasing.",
					"- Forcing a student to perform tasks that cause embarrassment, fear, or discomfort.",
					"- Restricting the freedom of movement or speech of fresh students.",
					"### Penalties for Ragging",
					"Students found guilty of ragging can face severe consequences, including:",
					"- Suspension from attending classes and academic privileges.",
					"- Fine up to Rs. 25,000.",
					"- Expulsion from the college.",
					"- Filing of an FIR with the local police, leading to arrest and trial under the IPC.",
					"### Anti-Ragging Affidavit Procedure",
					"Every student and parent must submit an online anti-ragging affidavit at the time of admission:",
					"1. Go to antiragging.in or amanmovement.org",
					"2. Fill out the application form with college details.",
					"3. Submit the form and download the signed declaration.",
					"4. Submit the printout to the college administration office."
				}, new String[] {
					"### शून्य सहनशीलता (Zero Tolerance) नीति",
					"सनशाइन प्राइवेट आईटीआई कॉलेज किसी भी रूप में रैगिंग के प्रति सख्त शून्य सहनशीलता नीति रखता है। यूजीसी और राज्य कानूनों के तहत रैगिंग एक दंडनीय आपराधिक अपराध है।",
					"### रैगिंग क्या है?",
					"- शारीरिक, मानसिक या भावनात्मक दुर्व्यवहार, उत्पीड़न या चिढ़ाने का कोई भी कार्य।",
					"- किसी छात्र को ऐसे काम करने के लिए मजबूर करना जिससे शर्मिंदगी, डर या असुविधा हो।",
					"- नए छात्रों की आने-जाने या बोलने की स्वतंत्रता को प्रतिबंधित करना।",
					"### रैगिंग के लिए दंड",
					"रैगिंग के दोषी पाए जाने वाले छात्रों को गंभीर परिणामों का सामना करना पड़ सकता है, जिनमें शामिल हैं:",
					"- कक्षाओं और शैक्षणिक विशेषाधिकारों में भाग लेने से निलंबन।",
					"- 25,000 रुपये तक का जुर्माना।",
					"- कॉलेज से निष्कासन (Expulsion)।",
					"- स्थानीय पुलिस के पास प्राथमिकी (FIR) दर्ज कराना, जिससे गिरफ्तारी और आईपीसी के तहत मुकदमा चलाया जा सके।",
					"### एंटी-रैगिंग शपथ पत्र प्रक्रिया",
					"प्रवेश के समय प्रत्येक छात्र और अभिभावक को एक ऑनलाइन एंटी-रैगिंग शपथ पत्र जमा करना होगा:",
					"1. antiragging.in या amanmovement.org पर जाएं।",
					"2. कॉलेज विवरण के साथ आवेदन पत्र भरें।",
					"3. फॉर्म जमा करें और हस्ताक्षरित घोषणा पत्र डाउनलोड करें।",
					"4. प्रिंटआउट कॉलेज प्रशासनिक कार्यालय में जमा करें।"
				});
				
				System.out.println("Initialized dummy study materials and documents successfully.");
			}

			galleryImageRepository.deleteAll();
			if (galleryImageRepository.count() == 0) {
				GalleryImage img1 = new GalleryImage();
				img1.setTitle("Electrician Practical Workshop");
				img1.setCategory("Labs");
				img1.setImageUrl("/images/electrician_workshop.png");
				galleryImageRepository.save(img1);

				GalleryImage img2 = new GalleryImage();
				img2.setTitle("Advanced Computer & IT Center");
				img2.setCategory("Labs");
				img2.setImageUrl("/images/computer_lab.png");
				galleryImageRepository.save(img2);

				GalleryImage img3 = new GalleryImage();
				img3.setTitle("Sunshine ITI Main Campus Entrance");
				img3.setCategory("Campus");
				img3.setImageUrl("/images/campus_building.png");
				galleryImageRepository.save(img3);

				GalleryImage img4 = new GalleryImage();
				img4.setTitle("Modern Smart Classroom & Seminar Hall");
				img4.setCategory("Events");
				img4.setImageUrl("/images/events_hall.png");
				galleryImageRepository.save(img4);

				GalleryImage img5 = new GalleryImage();
				img5.setTitle("Mechanical Fitter Trade Workshop");
				img5.setCategory("Labs");
				img5.setImageUrl("/images/fitter_workshop.png");
				galleryImageRepository.save(img5);

				GalleryImage img6 = new GalleryImage();
				img6.setTitle("Well-equipped Student Library & Study Hall");
				img6.setCategory("Campus");
				img6.setImageUrl("/images/library.png");
				galleryImageRepository.save(img6);

				GalleryImage img7 = new GalleryImage();
				img7.setTitle("Annual Campus Placement & Interview Drive");
				img7.setCategory("Events");
				img7.setImageUrl("/images/placement_drive.png");
				galleryImageRepository.save(img7);

				GalleryImage img8 = new GalleryImage();
				img8.setTitle("Sunshine ITI Sports Field & Recreation Area");
				img8.setCategory("Campus");
				img8.setImageUrl("/images/sports_ground.png");
				galleryImageRepository.save(img8);

				System.out.println("Initialized dummy gallery images successfully.");
			}
		};
	}

	private void createDummyMaterial(StudyMaterialRepository repo, String title, String titleHn, String trade, String tradeHn, String type, String fileName, String[] detailsEn, String[] detailsHn) {
		StudyMaterial material = new StudyMaterial();
		material.setTitle(title);
		material.setTitleHn(titleHn);
		material.setTrade(trade);
		material.setTradeHn(tradeHn);
		material.setType(type);
		material.setFileName(fileName);
		material.setFileType("application/pdf");
		material.setFileData(generateBeautifulPdf(title, trade, type, detailsEn));

		StringBuilder sb = new StringBuilder();
		for (String line : detailsEn) {
			sb.append(line).append("\n");
		}
		material.setDescription(sb.toString().trim());

		StringBuilder sbHn = new StringBuilder();
		for (String line : detailsHn) {
			sbHn.append(line).append("\n");
		}
		material.setDescriptionHn(sbHn.toString().trim());

		repo.save(material);
	}

	private byte[] generateBeautifulPdf(String title, String trade, String category, String[] contentLines) {
		try {
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			Document document = new Document(PageSize.A4);
			document.setMargins(50, 50, 50, 50);
			PdfWriter.getInstance(document, baos);
			document.open();

			// Fonts
			Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD, new java.awt.Color(37, 99, 235));
			Font metaFont  = new Font(Font.HELVETICA, 10, Font.ITALIC, new java.awt.Color(100, 116, 139));
			Font headingFont = new Font(Font.HELVETICA, 12, Font.BOLD, new java.awt.Color(30, 41, 59));
			Font bodyFont  = new Font(Font.HELVETICA, 10, Font.NORMAL, new java.awt.Color(51, 65, 85));

			// Title
			Paragraph mainTitle = new Paragraph(title.toUpperCase(), titleFont);
			mainTitle.setAlignment(Element.ALIGN_CENTER);
			mainTitle.setSpacingAfter(10f);
			document.add(mainTitle);

			// Meta Information
			Paragraph meta = new Paragraph("Sunshine Private ITI College, Seoni (M.P.)\nTrade: " + trade + "  |  Category: " + category + "  |  Academic Year: 2026-27", metaFont);
			meta.setAlignment(Element.ALIGN_CENTER);
			meta.setSpacingAfter(15f);
			document.add(meta);

			document.add(new Chunk(new LineSeparator(1f, 100f, new java.awt.Color(226, 232, 240), Element.ALIGN_CENTER, -2f)));
			document.add(new Paragraph(" "));

			// Body Content
			for (String line : contentLines) {
				if (line.startsWith("### ")) {
					Paragraph heading = new Paragraph(line.substring(4), headingFont);
					heading.setSpacingBefore(12f);
					heading.setSpacingAfter(6f);
					document.add(heading);
				} else {
					Paragraph body = new Paragraph(line, bodyFont);
					body.setSpacingAfter(6f);
					document.add(body);
				}
			}

			// Footer line
			document.add(new Paragraph(" "));
			document.add(new Chunk(new LineSeparator(1f, 100f, new java.awt.Color(226, 232, 240), Element.ALIGN_CENTER, -2f)));
			document.add(new Paragraph(" "));
			
			Paragraph footer = new Paragraph("This is an official reference document generated by Sunshine ITI. For any queries, please visit the administrative office.", metaFont);
			footer.setAlignment(Element.ALIGN_CENTER);
			document.add(footer);

			document.close();
			return baos.toByteArray();
		} catch (Exception e) {
			e.printStackTrace();
			return ("Error generating PDF for " + title).getBytes();
		}
	}
}
