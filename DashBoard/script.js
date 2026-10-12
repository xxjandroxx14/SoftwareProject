// script.js - Comprehensive Application Script

document.addEventListener("DOMContentLoaded", () => {
  initDayDropdown();
  setupNavigation();
});

/* ==========================================================================
   1. INITIALIZATION & UTILITIES
   ========================================================================== */

/**
 * Dynamically populates days 1-31 for the Birthday dropdown in Registration Form
 */
function initDayDropdown() {
  const daySelect = document.getElementById("daySelect");
  if (!daySelect) return;

  // Clear existing options except default
  daySelect.innerHTML = '<option value="" disabled selected>Day</option>';

  for (let d = 1; d <= 31; d++) {
    const option = document.createElement("option");
    option.value = d;
    option.textContent = d;
    daySelect.appendChild(option);
  }
}

/**
 * Handles main tab navigation using hash fragments or element IDs
 */
function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav-item, .dropdown-menu a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const targetViewId = href.substring(1);
        switchView(targetViewId);

        // Highlight active link in main navigation bar
        document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("active"));
        const parentNavItem = link.classList.contains("nav-item") ? link : document.getElementById("navServices");
        if (parentNavItem) parentNavItem.classList.add("active");
      }
    });
  });
}

/**
 * Switches visible view panel
 * @param {string} viewId - ID of the element to display
 */
function switchView(viewId) {
  const panels = document.querySelectorAll(".view-panel");
  panels.forEach((panel) => {
    panel.classList.add("hidden");
  });

  const targetPanel = document.getElementById(viewId);
  if (targetPanel) {
    targetPanel.classList.remove("hidden");
  }
}

/* ==========================================================================
   2. STUDENT MANAGEMENT MODULE
   ========================================================================== */

/**
 * Saves a new student or updates an existing record
 */
function saveStudent() {
  const dbId = document.getElementById("studentDbId").value;
  const studentNum = document.getElementById("studentNumberInput").value.trim();
  const firstName = document.getElementById("firstNameInput").value.trim();
  const middleName = document.getElementById("middleNameInput").value.trim();
  const lastName = document.getElementById("lastNameInput").value.trim();
  const gender = document.getElementById("genderSelect").value;
  const birthDate = document.getElementById("birthDateInput").value;
  const program = document.getElementById("programSelect").value;
  const yearLevel = document.getElementById("yearLevelSelect").value;

  if (!studentNum || !firstName || !lastName || !birthDate) {
    alert("Please fill in all required fields.");
    return;
  }

  const fullName = `${lastName}, ${firstName} ${middleName ? middleName.charAt(0) + "." : ""}`;
  const tableBody = document.getElementById("studentsDirectoryTable");

  if (dbId) {
    // Editing existing student row
    const existingRow = document.querySelector(`tr[data-id="${dbId}"]`);
    if (existingRow) {
      existingRow.cells[0].innerHTML = `<strong>${studentNum}</strong>`;
      existingRow.cells[1].textContent = fullName;
      existingRow.cells[2].textContent = program;
      existingRow.cells[3].textContent = `Year ${yearLevel}`;
    }
    alert("Student record updated successfully!");
  } else {
    // Appending new row
    const newRow = document.createElement("tr");
    const uniqueId = "STU-" + Date.now();
    newRow.setAttribute("data-id", uniqueId);
    newRow.setAttribute("data-gender", gender);
    newRow.setAttribute("data-dob", birthDate);

    newRow.innerHTML = `
      <td><strong>${studentNum}</strong></td>
      <td>${fullName}</td>
      <td>${program}</td>
      <td>Year ${yearLevel}</td>
      <td><span class="badge badge-success">Active</span></td>
      <td>
        <button class="btn-primary" onclick="viewStudentProfile('${studentNum}')">Profile</button>
        <button class="btn-action-batch" onclick="editStudent('${studentNum}')">Edit</button>
        <button class="btn-danger" onclick="toggleStudentStatus(this)">Deactivate</button>
      </td>
    `;
    tableBody.appendChild(newRow);
    alert("New student registered successfully!");
  }

  clearStudentForm();
}

/**
 * Resets the student input form
 */
function clearStudentForm() {
  document.getElementById("studentDbId").value = "";
  document.getElementById("studentRegistrationForm").reset();
  document.getElementById("studentFormTitle").textContent = "Student Registration Form";
  document.getElementById("saveStudentBtn").textContent = "SAVE";
}

/**
 * Searches and filters student directory table
 */
function searchStudents() {
  const query = document.getElementById("searchStudentInput").value.toLowerCase();
  const filterStatus = document.getElementById("filterStatusSelect").value;
  const rows = document.querySelectorAll("#studentsDirectoryTable tr");

  rows.forEach((row) => {
    const studentNum = row.cells[0]?.textContent.toLowerCase() || "";
    const name = row.cells[1]?.textContent.toLowerCase() || "";
    const status = row.cells[4]?.textContent.trim() || "";

    const matchesQuery = studentNum.includes(query) || name.includes(query);
    const matchesStatus = filterStatus === "All" || status === filterStatus;

    if (matchesQuery && matchesStatus) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

/**
 * Populates form with student data for modification
 */
function editStudent(studentNum) {
  const rows = document.querySelectorAll("#studentsDirectoryTable tr");
  let targetRow = null;

  rows.forEach((row) => {
    if (row.cells[0]?.textContent.trim() === studentNum) {
      targetRow = row;
    }
  });

  if (!targetRow) return;

  document.getElementById("studentDbId").value = targetRow.getAttribute("data-id") || "STU-EX";
  document.getElementById("studentNumberInput").value = studentNum;

  const fullNameStr = targetRow.cells[1].textContent;
  const parts = fullNameStr.split(",");
  const lastName = parts[0] ? parts[0].trim() : "";
  const firstAndMiddle = parts[1] ? parts[1].trim().split(" ") : [];

  document.getElementById("lastNameInput").value = lastName;
  document.getElementById("firstNameInput").value = firstAndMiddle[0] || "";
  document.getElementById("middleNameInput").value = firstAndMiddle[1] || "";

  document.getElementById("studentFormTitle").textContent = "Edit Student Profile";
  document.getElementById("saveStudentBtn").textContent = "UPDATE";

  // Scroll to form view smoothly
  document.getElementById("studentRegistrationForm").scrollIntoView({ behavior: "smooth" });
}

/**
 * Displays details panel for selected student
 */
function viewStudentProfile(studentNum) {
  const modal = document.getElementById("studentProfileModal");
  if (!modal) return;

  const rows = document.querySelectorAll("#studentsDirectoryTable tr");
  rows.forEach((row) => {
    if (row.cells[0]?.textContent.trim() === studentNum) {
      document.getElementById("profStudentNumber").textContent = studentNum;
      document.getElementById("profFullName").textContent = row.cells[1].textContent;
      document.getElementById("profProgramYear").textContent = `${row.cells[2].textContent} - ${row.cells[3].textContent}`;

      const gender = row.getAttribute("data-gender") || "N/A";
      const dob = row.getAttribute("data-dob") || "N/A";
      document.getElementById("profGenderBirth").textContent = `${gender} | ${dob}`;
      document.getElementById("profStatus").textContent = row.cells[4].textContent.trim();
    }
  });

  modal.classList.remove("hidden");
  modal.scrollIntoView({ behavior: "smooth" });
}

/**
 * Closes the detailed profile view panel
 */
function closeStudentProfile() {
  const modal = document.getElementById("studentProfileModal");
  if (modal) modal.classList.add("hidden");
}

/**
 * Toggles student active/inactive status badge
 */
function toggleStudentStatus(btn) {
  const row = btn.closest("tr");
  const statusTd = row.cells[4];
  const currentBadge = statusTd.querySelector(".badge");

  if (currentBadge.classList.contains("badge-success")) {
    currentBadge.className = "badge badge-danger";
    currentBadge.textContent = "Inactive";
    btn.textContent = "Activate";
    btn.className = "btn-primary";
  } else {
    currentBadge.className = "badge badge-success";
    currentBadge.textContent = "Active";
    btn.textContent = "Deactivate";
    btn.className = "btn-danger";
  }
}

/* ==========================================================================
   3. ACADEMIC SETUP & FACULTY MANAGEMENT
   ========================================================================== */

/**
 * Switches between Student Subjects and Teacher Allocation sub-tabs
 */
function switchAcademicSubTab(subPanelId, activeBtn) {
  document.getElementById("student-subjects-view").classList.add("hidden");
  document.getElementById("teacher-approval-view").classList.add("hidden");

  document.querySelectorAll(".sub-tab-btn").forEach((btn) => btn.classList.remove("active"));

  document.getElementById(subPanelId).classList.remove("hidden");
  if (activeBtn) activeBtn.classList.add("active");
}

/**
 * Enrolls a student into a selected subject subject to approval
 */
function assignSubject() {
  const studentSelect = document.getElementById("studentSelect");
  const subjectSelect = document.getElementById("subjectSelect");

  const [studentId, studentName] = studentSelect.options[studentSelect.selectedIndex].text.split(" | ");
  const [subjCode, subjTitle, units, yearLevel] = subjectSelect.value.split("|");

  const tableBody = document.getElementById("studentApprovalTable");

  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td class="td-center"><input type="checkbox" class="student-select-chk"></td>
    <td>${studentId}</td>
    <td>${studentName}</td>
    <td><strong>${subjCode}</strong></td>
    <td>${subjTitle}</td>
    <td>${units}</td>
    <td>${yearLevel}${getOrdinalSuffix(yearLevel)} Year</td>
    <td><span class="badge badge-warning">Pending Approval</span></td>
    <td>
      <button class="btn-primary" onclick="approveStudent(this)">Approve</button>
      <button class="btn-danger" onclick="rejectStudent(this)">Reject</button>
    </td>
  `;

  tableBody.appendChild(newRow);
  alert(`Subject ${subjCode} assigned to ${studentName}. Pending approval.`);
}

function approveStudent(btn) {
  const row = btn.closest("tr");
  const badge = row.cells[7].querySelector(".badge");
  badge.className = "badge badge-success";
  badge.textContent = "Approved";
  btn.disabled = true;
}

function rejectStudent(btn) {
  const row = btn.closest("tr");
  const badge = row.cells[7].querySelector(".badge");
  badge.className = "badge badge-danger";
  badge.textContent = "Rejected";
}

function toggleSelectAllStudentsCheckbox(masterCheckbox) {
  const checkboxes = document.querySelectorAll(".student-select-chk");
  checkboxes.forEach((chk) => (chk.checked = masterCheckbox.checked));
}

function toggleSelectAllStudents(btn) {
  const master = document.getElementById("selectAllCheckbox");
  master.checked = !master.checked;
  toggleSelectAllStudentsCheckbox(master);
}

function approveAllSelectedStudents() {
  const checkboxes = document.querySelectorAll(".student-select-chk:checked");
  if (checkboxes.length === 0) {
    alert("No records selected.");
    return;
  }

  checkboxes.forEach((chk) => {
    const row = chk.closest("tr");
    const approveBtn = row.querySelector(".btn-primary");
    if (approveBtn && !approveBtn.disabled) {
      approveStudent(approveBtn);
    }
  });
}

/**
 * Faculty Management Handlers
 */
function addNewTeacher() {
  const name = document.getElementById("newTeacherName").value.trim();
  const dept = document.getElementById("newTeacherDept").value;

  if (!name) {
    alert("Please enter teacher full name.");
    return;
  }

  const teacherSelect = document.getElementById("teacherSelect");
  const option = document.createElement("option");
  option.value = `${name}|${dept}`;
  option.textContent = `${name} (${dept})`;
  teacherSelect.appendChild(option);

  document.getElementById("newTeacherName").value = "";
  alert(`Added ${name} to system directory.`);
}

function assignTeacherToSubject() {
  const teacherVal = document.getElementById("teacherSelect").value;
  const subjectVal = document.getElementById("teacherSubjectSelect").value;

  if (!teacherVal || !subjectVal) return;

  const [tName] = teacherVal.split("|");
  const [sCode, sTitle] = subjectVal.split("|");

  alert(`Successfully allocated ${sCode} (${sTitle}) to ${tName}.`);
}

/* ==========================================================================
   4. GRADES COMPUTATION MODULE
   ========================================================================== */

/**
 * Computes weighted average: Prelim (30%) + Midterm (30%) + Finals (40%)
 */
function computeGrade() {
  const studentVal = document.getElementById("gradeStudentSelect").value;
  const studentText = document.getElementById("gradeStudentSelect").options[document.getElementById("gradeStudentSelect").selectedIndex].text;
  const subjectCode = document.getElementById("gradeSubjectSelect").value;

  const prelim = parseFloat(document.getElementById("prelimGrade").value);
  const midterm = parseFloat(document.getElementById("midtermGrade").value);
  const finals = parseFloat(document.getElementById("finalsGrade").value);

  if (isNaN(prelim) || isNaN(midterm) || isNaN(finals)) {
    alert("Please enter valid numeric values for all grade components.");
    return;
  }

  // Weighted score calculation
  const totalScore = prelim * 0.3 + midterm * 0.3 + finals * 0.4;
  const roundedScore = totalScore.toFixed(1);

  // Convert percentage score to Philippine GPA scale
  const gpa = convertToGpa(totalScore);
  const remarks = totalScore >= 75 ? '<span class="badge badge-success">Passed</span>' : '<span class="badge badge-danger">Failed</span>';

  const [studentId, studentName] = studentText.split(" | ");
  const tableBody = document.getElementById("gradeRecordsTable");

  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${studentId}</td>
    <td>${studentName}</td>
    <td>${subjectCode}</td>
    <td>${prelim}</td>
    <td>${midterm}</td>
    <td>${finals}</td>
    <td>${roundedScore}%</td>
    <td><strong>${gpa}</strong></td>
    <td>${remarks}</td>
  `;

  tableBody.appendChild(newRow);

  // Clear inputs
  document.getElementById("prelimGrade").value = "";
  document.getElementById("midtermGrade").value = "";
  document.getElementById("finalsGrade").value = "";

  alert(`Grade calculated: ${roundedScore}% (Equivalent: ${gpa})`);
}

/**
 * Maps percentage to grading system equivalents
 */
function convertToGpa(score) {
  if (score >= 97) return "1.00";
  if (score >= 94) return "1.25";
  if (score >= 91) return "1.50";
  if (score >= 88) return "1.75";
  if (score >= 85) return "2.00";
  if (score >= 82) return "2.25";
  if (score >= 79) return "2.50";
  if (score >= 76) return "2.75";
  if (score >= 75) return "3.00";
  return "5.00";
}

function getOrdinalSuffix(val) {
  const i = parseInt(val);
  if (i === 1) return "st";
  if (i === 2) return "nd";
  if (i === 3) return "rd";
  return "th";
}