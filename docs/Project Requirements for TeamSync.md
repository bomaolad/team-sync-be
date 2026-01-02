# **Project Requirements Document (PRD)**

**Project Name:** TeamSync **Platform:** Mobile App (iOS & Android) **Tech Stack:**

- **Frontend:** React Native
- **Backend:** NestJS
- **Database:** PostgreSQL (Recommended)

## **1\. Project Overview**

**TeamSync** is a mobile-first task management application designed for teams to collaborate efficiently without the clutter of enterprise software. It focuses on clarity, speed, and real-time status updates.  
The core problem it solves is **"Status Ambiguity"**—eliminating the need for team members to ask "Is this done yet?" by providing clear, visual status indicators (e.g., In Progress, Under Review, Done).

## **2\. User Roles**

1. **Owner/Admin:** The person who creates the workspace. They can invite members, remove members, and see all projects.
2. **Member:** A team member who can be assigned tasks, create tasks, and update statuses.
3. **Viewer (Optional):** Can only view tasks (good for clients or upper management), but cannot edit.

## **3\. The Full User Walkthrough (User Journey)**

### **Phase 1: Onboarding**

1. **Splash Screen:** The user opens the app and sees the logo with a quick animation.
2. **Auth Screen:** The user signs up using Email/Password or Google Login.
3. **Workspace Setup:**
   - _If new:_ User creates a "Workspace" (e.g., "Development Team").
   - _If invited:_ User enters an Invite Code or accepts a link to join an existing workspace.

### **Phase 2: The Work Flow**

1. **Home Dashboard:** The user lands on the Home page. They immediately see **"My Priorities"** (Tasks assigned to them that are due soon).
2. **Project Creation:** The Admin creates a specific project (e.g., "Website Redesign").
3. **Task Creation:** Inside the project, the Admin creates a task: "Design Home Page Banner."
4. **Assignment:** The Admin selects a team member (e.g., Muhammed) to do the task.
5. **Notification:** Muhammed receives a push notification: _"New Task Assigned: Design Home Page Banner."_

### **Phase 3: Execution & Updates**

1. **Working:** Muhammed opens the task. He changes the status from **"To Do"** to **"In Progress."** The whole team sees this update instantly.
2. **Collaboration:** Muhammed has a question. He posts a comment on the task: _"Should this be blue or red?"_ The Admin replies in the thread.
3. **Review:** Muhammed finishes the design. He uploads the image to the task and changes status to **"Under Review."**
4. **Completion:** The Admin checks the work, approves it, and changes the status to **"Done."**

## **4\. Detailed Page Breakdown & Features**

### **A. Authentication & Onboarding**

- **Login / Sign Up:** Clean forms. "Forgot Password" functionality is essential.
- **Verify Email:** A simple screen entering a 4-digit code sent to email (handled by NestJS).
- **Create Profile:** Upload avatar (image), set Full Name, and Job Title (e.g., "Frontend Dev").

### **B. The "Home" Tab (Personal Dashboard)**

- **Greeting:** "Good Morning, \[Name\]."
- **Progress Circle:** A visual ring showing tasks completed today vs. remaining.
- **"My Tasks" List:** A list of tasks assigned specifically to the user, sorted by Due Date.
  - _Green Text:_ Due in future.
  - _Red Text:_ Overdue.
- **Recent Activity:** A feed showing what teammates are doing (e.g., "Sarah completed 'API Fix'").

### **C. The "Projects" Tab**

- **Project List:** Cards showing all active projects.
  - _Card Content:_ Project Name, Number of Tasks, Progress Bar (e.g., 40% complete).
- **Create Project Button:** Floating action button (+) to start a new project.

### **D. Project Detail View (Inside a Project)**

This is the heart of the app. It should have two tabs at the top: **List View** and **Board View**.

- **Filter/Sort:** Filter by "Assigned to Me" or "Status."
- **Status Columns (Kanban):**
  - To Do
  - In Progress
  - Under Review (Critical for teams)
  - Done
- **Task Card (Preview):** Shows Title, Assignee Avatar, and a small colored badge for Priority (High/Med/Low).

### **E. Task Detail Page (When clicking a task)**

- **Header:** Task Title.
- **Status Dropdown:** A large, colorful button to change status (To Do \-\> In Progress).
- **Assignee:** Clickable avatar to change who is doing the work.
- **Date Picker:** Start Date and Due Date.
- **Description:** Rich text (bold, lists) describing the work.
- **Sub-tasks:** Checkboxes for smaller steps within the task.
- **Attachments:** Ability to upload photos or documents.
- **Activity/Comments:** Chat-style history at the bottom.
  - _System messages:_ "Muhammed changed status to In Progress."
  - _User comments:_ "Here is the file."

### **F. The "Team" Tab**

- **Member List:** List of all people in the Workspace.
- **Invite Member:** Input email to send an invite.
- **Stats:** See how many tasks each member has completed this week (Gamification aspect).

### **G. Settings / Profile**

- **Dark Mode Toggle:** Essential for developer apps.
- **Notifications:** Toggles for "Email me when..." or "Push notify when..."
- **Log Out.**

## **5\. Technical Requirements (React Native & NestJS)**

### **Frontend (React Native)**

1. **State Management:** Use **Zustand** or **Redux Toolkit**. We need to cache data so the app works if the internet cuts out briefly.
2. **Navigation:** **React Navigation** (Stack and Bottom Tabs).
3. **UI Library:** Use **Tamagui** or **NativeBase** for fast, responsive styling that looks good on both iOS and Android.
4. **Offline Support:** Use **React Native Async Storage** or **WatermelonDB**. Users should be able to view tasks while offline, and the app syncs when back online.

### **Backend (NestJS)**

1. **Architecture:** REST API (standard) \+ WebSockets (Gateway) for real-time updates.
2. **Auth:** **Passport.js** with JWT (JSON Web Tokens). Secure, stateless authentication.
3. **Validation:** Use **class-validator** DTOs (Data Transfer Objects) to ensure bad data doesn't crash the server.
4. **Database:**
   - **Users Table:** ID, email, password_hash, avatar.
   - **Workspaces Table:** ID, name, owner_id.
   - **Projects Table:** ID, workspace_id, name.
   - **Tasks Table:** ID, project_id, assigned_user_id, status (enum), priority, due_date.
   - **Comments Table:** ID, task_id, user_id, text.

## **6\. Competitive Advantages (The "Why Us?")**

1. **The "Under Review" Workflow:** Most simple apps go straight from "In Progress" to "Done." Your app enforces a "Review" stage, which is crucial for quality control in teams.
2. **Real-Time Sync:** Using NestJS Gateways, if User A moves a card, User B sees it move instantly without refreshing.
3. **Focus Mode:** A specific feature in the task detail page that hides everything else on the screen except the current task description, helping users with ADHD or focus issues (a common request in reviews).
