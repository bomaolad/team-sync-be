# **Comprehensive Product Requirements Document: Cross-Platform Team Task Management Application**

## **1\. Executive Summary and Project Vision**

### **1.1 Introduction**

This document serves as the definitive Product Requirements Document (PRD) for the development of a new, high-performance mobile task management application. The project is designed to address specific inefficiencies inherent in current market solutions, specifically focusing on team collaboration, rigid workflow enforcement, and offline reliability. The application will be engineered using **React Native** for the frontend, ensuring a seamless cross-platform experience on iOS and Android, and **NestJS** for the backend, providing a scalable, modular server-side architecture.

The core philosophy of this product is "Structured Accountability." Unlike generic to-do lists, this application enforces a specific lifecycle for tasks—moving strictly from "To Do" to "In Progress," "Under Review," "Recheck," and finally "Done." This structure is designed to support teams that require quality assurance loops, ensuring that work is not just marked as finished but is verified and approved.

### **1.2 Problem Statement**

The current landscape of task management software is crowded but polarized. On one end, there are simple to-do list apps that lack team features and robust permissions. On the other end, there are enterprise-grade behemoths like Jira and ClickUp, which suffer from severe feature bloat.

Extensive market research indicates a growing dissatisfaction among mobile users of these major platforms. A consistent theme in user reviews is the degradation of performance on mobile devices. Users report that apps like ClickUp are "extremely slow" and "bloated," often taking up to 10 seconds just to load a simple board.1 Similarly, Asana users have expressed significant frustration with mobile stability, citing bugs where the app reloads unexpectedly, causing data loss during task editing.4

Furthermore, the "Offline-First" capability is frequently marketing hype rather than a functional reality. Field teams and remote workers often find themselves unable to access or update tasks when connectivity is poor, leading to synchronization conflicts and lost work.5

### **1.3 Proposed Solution**

Our solution is a purpose-built application that prioritizes:

1. **Performance:** Leveraging React Native’s optimized rendering and local databases to ensure instant load times, contrasting with the sluggishness of competitors.  
2. **Workflow Specificity:** Implementing a hard-coded "Recheck" status to formalize the feedback loop between managers and executors, a feature often requiring complex customization in other tools.7  
3. **True Offline Capability:** utilizing an architecture where the app functions primarily from a local database that synchronizes with the NestJS backend only when connectivity allows, ensuring 100% uptime for the user.6

## ---

**2\. Market Research and Competitor Analysis**

To ensure this application succeeds where others have faltered, we have conducted a deep analysis of market leaders, specifically focusing on their mobile shortcomings as reported by actual users. This analysis informs our "Not-To-Do" list as much as our feature set.

### **2.1 ClickUp: The Perils of Feature Bloat**

ClickUp markets itself as the "app for everything," combining docs, chat, goals, and tasks. While this sounds appealing on a desktop, it has proven disastrous for mobile performance.

User Insights:  
User reviews reveal a pattern of performance degradation. Reports indicate that the mobile app is "no use at all" for some, citing that it is "extremely slow" and fails to edit documents properly.1 Even on simple Kanban boards, load times can lag significantly.2 Users explicitly advise against using ClickUp as a database or storing unnecessary data because it becomes "bloated" and unresponsive.3  
Strategic Implication:  
Our application will strictly limit its scope to Task Management. We will not attempt to be a document editor or a CRM. By reducing the complexity of the data model in our NestJS backend and avoiding heavy document rendering in React Native, we can guarantee a snappy, responsive UI that ClickUp cannot match.

### **2.2 Asana: The Disconnect Between Web and Mobile**

Asana is a giant in the industry, but its mobile app is often treated as a companion rather than a standalone tool.

User Insights:  
Users have flagged that the Android app is "consistently full of significant bugs," such as the app reloading and discarding draft text when the user switches apps briefly.4 There is also dissatisfaction with the lack of feature parity; users complain they cannot sort by project or access custom fields on mobile that are available on the web.5 Furthermore, recent updates have rendered the app incompatible with older phones, alienating a portion of the user base.10  
Strategic Implication:  
We must ensure that the mobile app is a first-class citizen. Every feature available in the API must be accessible via the mobile UI. Additionally, our React Native implementation must handle "app state restoration" robustly, ensuring that if the OS kills the app in the background, the user's draft comment is saved locally and restored upon reopening.

### **2.3 Monday.com: Pricing and Reliability Issues**

Monday.com is known for its visual appeal, but it creates friction for smaller teams and mobile users.

User Insights:  
A major complaint revolves around the pricing model, which forces users to buy "seats" in bundles (e.g., paying for 3 seats even if you only need 1), making it expensive for small startups.11 Technically, users have reported issues with file uploads failing repeatedly on mobile networks, a critical failure for teams that need to upload photos of completed work.11  
Strategic Implication:  
Our file attachment system, built on NestJS and an object storage service (like AWS S3), must implement a "Background Retry" mechanism. If an upload fails, the app should not force the user to try again manually; it should queue the upload and retry automatically when the connection is stable.

### **2.4 Jira: Complexity Overload**

Jira is the standard for developers but is often considered overkill for general business teams.

User Insights:  
The mobile app is frequently described as complex, with users reporting that it "constantly hangs" or leads to blank pages when navigating from notifications.13 The sheer number of fields and configuration options makes the mobile interface cluttered and difficult to navigate for simple tasks.14  
Strategic Implication:  
We will adopt a "Fixed Layout" philosophy. Unlike Jira’s infinitely customizable screens which cause rendering lag, our Task Detail screen will have a fixed, optimized layout. This predictability allows for aggressive performance optimization in React Native.

## ---

**3\. User Personas and Roles**

Defining the users is critical for designing the Role-Based Access Control (RBAC) system in the NestJS backend. We identify three primary personas.

### **3.1 The Team Lead (Admin)**

Profile: A project manager or business owner responsible for the overall delivery of projects.  
Psychographics: They are anxious about deadlines and quality. They hate having to chase people for status updates.  
Behaviors:

* Creates projects and invites team members.  
* Assigns tasks in bulk at the beginning of the week.  
* Reviews "Done" tasks to ensure quality.  
* Uses the "Recheck" status frequently when work is substandard.  
  Requirements: Needs a high-level dashboard showing team velocity and a unified "Review Queue" to approve or reject work quickly.15

### **3.2 The Executor (Team Member)**

Profile: A field worker, developer, or creative staff member who performs the actual work.  
Psychographics: They value clarity. They want to know exactly what to do and when it is due. They dislike administrative overhead (e.g., complex forms).  
Behaviors:

* Checks "My Tasks" first thing in the morning.  
* Filters tasks by "Due Today" or "High Priority."  
* Changes status from "To Do" to "In Progress" to signal they are working.  
* Uploads attachments (photos, docs) as proof of work.  
  Requirements: An ultra-simple "My Tasks" view, one-tap status updates, and reliable offline access.9

### **3.3 The Observer (Guest/Client)**

Profile: A client or upper management stakeholder who needs visibility but not control.  
Psychographics: They want reassurance that progress is happening without needing to ask.  
Behaviors:

* Logs in occasionally to check project progress bars.  
* Reads comments but rarely posts them.  
  Requirements: Read-only access to specific projects. The app must hide internal "Recheck" loops from this user if configured, showing only high-level progress.

## ---

**4\. Technical Architecture: Backend (NestJS)**

The backend is the brain of the operation. We will use **NestJS**, a framework for building efficient, scalable Node.js server-side applications. It uses modern JavaScript, is built with TypeScript, and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

### **4.1 Modular Architecture**

NestJS encourages a modular structure, which helps in organizing code and separating concerns.18 Our application will be divided into the following Feature Modules:

#### **4.1.1 AppModule**

The root module that aggregates all other modules. It will also handle global configurations such as database connections (via TypeORM) and environment variables (via ConfigModule).

#### **4.1.2 AuthModule**

Responsible for security and identity.

* **Functionality:** Handles user registration, login, and token generation.  
* **Technology:** We will use **Passport.js** with a **JWT (JSON Web Token)** strategy.  
* **Flow:** When a user logs in, this module validates credentials and issues a JWT. This token must be included in the header of subsequent API requests to authenticate the user.20

#### **4.1.3 UsersModule**

Manages user data.

* **Functionality:** Profile updates, avatar uploads, and team membership management.  
* **RBAC:** This module will define the roles (Admin, Member, Guest) and ensure that a user cannot elevate their own privileges.21

#### **4.1.4 TasksModule**

The core business logic.

* **Functionality:** CRUD operations for tasks. It manages the state machine for task statuses (To Do \-\> In Progress \-\>...).  
* **Complexity:** This module will handle the logic for the "Recheck" loop. If a task is moved to "Recheck," this module will enforce the requirement that a comment explaining the rejection must be attached.8

#### **4.1.5 ProjectsModule**

Manages the containers for tasks.

* **Functionality:** Creating projects, setting project-level permissions, and calculating project progress (e.g., "5/10 tasks completed").

#### **4.1.6 GatewayModule (Real-time)**

To support team collaboration, we need real-time updates.

* **Technology:** NestJS Gateways (built on Socket.io).  
* **Usage:** When an Admin marks a task as "Recheck," a socket event is emitted. The Executor's app receives this event instantly and updates the UI without needing a page refresh.23

### **4.2 Database Strategy**

We will use **PostgreSQL** as the primary relational database, interfaced via **TypeORM**.

#### **4.2.1 TypeORM Entities**

TypeORM allows us to define our database schema using TypeScript classes.24

* **Relationship Management:** We will heavily use OneToMany and ManyToOne decorators. For example, a User has many Tasks, and a Project has many Tasks.  
* **Migrations:** We will use TypeORM's migration feature to manage database schema changes version by version, ensuring safe deployments.

### **4.3 Security Implementation**

* **RBAC Guards:** We will implement custom Guards (@Roles()) to restrict endpoints. For instance, the DELETE /projects/:id endpoint will be guarded so that only users with the ADMIN role can execute it.26  
* **Input Validation:** We will use class-validator and DTOs (Data Transfer Objects) to ensure that data sent to the API is valid (e.g., ensuring email fields actually contain emails, and due dates are valid timestamps).18

## ---

**5\. Technical Architecture: Frontend (React Native)**

The frontend determines the user experience. We will use **React Native** to build a high-performance mobile app.

### **5.1 Navigation Structure**

Navigation is often a pain point in mobile apps. We will use **React Navigation (v6)**, utilizing a combination of Stack and Tab navigators.28

* **Switch Navigator (Root):** Decides whether to show the Auth flow (Login) or the App flow (Dashboard) based on the presence of a stored token.  
* **Auth Stack:** Login Screen \-\> Sign Up Screen \-\> Forgot Password.  
* **Main Tab Navigator:**  
  * **Home Tab:** Dashboard view.  
  * **Projects Tab:** List of projects.  
  * **My Tasks Tab:** Filtered list of tasks assigned to the user.  
  * **Profile Tab:** Settings and user details.  
* **Task Detail Stack:** Pushed on top of the tabs when a user taps a task. This allows the user to "go back" to their previous context easily.30

### **5.2 State Management & Offline-First**

To solve the offline issues seen in competitors, we will adopt a strict "Offline-First" architecture.

#### **5.2.1 Local Database**

We will use **WatermelonDB** or **SQLite**. WatermelonDB is preferred for React Native because it is lazy-loaded and highly performant with large datasets.31

* **Mechanism:** The app primarily reads from and writes to this local database. The UI *never* waits for the API. It updates the local DB immediately (Optimistic UI) and queues the network request.

#### **5.2.2 Synchronization Engine**

A background service will manage the sync between the local WatermelonDB and the NestJS backend.6

* **Push:** Checks for locally modified records (marked as 'dirty') and sends them to the server.  
* **Pull:** Asks the server for any changes since the last\_synced\_at timestamp.

### **5.3 UI Component Library**

To ensure consistency and speed of development, we will use a UI kit like **React Native Paper** or **Tamagui**, which provides pre-built, accessible components (Buttons, Cards, Inputs) that follow Material Design or iOS Human Interface Guidelines.32

## ---

**6\. Database Schema Design**

A robust data model is the foundation of the app. The following describes the schema tables and their relationships.

### **6.1 Entity Relationship Description**

| Table Name | Description | Key Columns | Relationships |
| :---- | :---- | :---- | :---- |
| **Users** | Stores account info | id, email, password\_hash, role, avatar\_url | One-to-Many with Tasks (Assignee), One-to-Many with Comments. |
| **Teams** | Groups of users | id, name, owner\_id | One-to-Many with Users, One-to-Many with Projects. |
| **Projects** | Containers for tasks | id, title, description, team\_id, status | Many-to-One with Teams, One-to-Many with Tasks. |
| **Tasks** | The core unit of work | id, project\_id, assignee\_id, status, priority, due\_date | Many-to-One with Projects, Many-to-One with Users. |
| **Comments** | Feedback & History | id, task\_id, user\_id, content, is\_rejection | Many-to-One with Tasks. |
| **Attachments** | Files/Images | id, task\_id, url, file\_type | Many-to-One with Tasks. |

### **6.2 The Status Enum**

The most critical data point is the Task Status. To support the requested workflow, the status column in the Tasks table will be an ENUM with the following values:

* TODO: Default state.  
* IN\_PROGRESS: Work has started.  
* UNDER\_REVIEW: Work is finished and waiting for Admin approval.  
* RECHECK: Admin has rejected the work; requires attention.  
* DONE: Work is approved and closed.

This strict Enum enforcement at the database level prevents invalid states (e.g., a task cannot be "Half Done").

## ---

**7\. Functional Walkthrough: Page by Page**

This section provides a detailed walkthrough of every screen in the application, describing the content, user actions, and backend interactions.

### **7.1 Splash & Onboarding Screen**

Objective: Welcome the user and determine authentication state.  
Content:

* App Logo centered.  
* Loading spinner (ActivityIndicator).  
  Logic:  
* On mount, the app checks AsyncStorage (or WatermelonDB) for a valid JWT.  
* If valid, navigate to **Dashboard**.  
* If invalid, navigate to **Login**.

### **7.2 Login Screen**

Objective: Secure user entry.  
Content:

* **Input:** Email Address (with validation for format).  
* **Input:** Password (with "Show/Hide" toggle icon).33  
* **Button:** "Sign In" (Primary color).  
* **Link:** "Forgot Password?".  
* Link: "Don't have an account? Sign Up".  
  Logic:  
* User taps "Sign In".  
* Frontend sends POST /auth/login to NestJS.  
* NestJS verifies credentials using AuthService.  
* If success, returns Access Token. App stores token and redirects to Dashboard.  
* If failure, show a "Toast" error message (e.g., "Invalid credentials").

### **7.3 Dashboard (Home Screen)**

Objective: High-level overview of work. This is the "Command Center."  
Content:

* **Header:** "Good Morning, \[Name\]". Avatar in top right.  
* **Statistics Cards (Horizontal Scroll):**  
  * "My Pending Tasks" (Number).  
  * "In Review" (Number).  
  * "Recheck Needed" (Number \- Red background for urgency).  
* **"My Tasks" List:** A simplified list of the top 5 tasks assigned to the user, sorted by Priority and Due Date.  
* FAB (Floating Action Button): A persistent "+" button in the bottom right to create a new task.34  
  Logic:  
* This screen pulls data from the local DB immediately.  
* Background sync refreshes the data from the server.  
* Tapping a task navigates to **Task Detail**.

### **7.4 Projects List Screen**

Objective: Navigate work hierarchy.  
Content:

* **Search Bar:** Filter projects by name.  
* **Filter Chips:** "Active", "Archived", "All".  
* **Project List:** Vertical list of cards.  
  * Card UI: Project Title, Client Name, circular progress bar indicating % of completed tasks, overlapping avatars of team members.  
    Logic:  
* Implemented using FlatList for performance.  
* Tapping a card navigates to **Project Detail**.

### **7.5 Project Detail Screen**

Objective: Manage tasks within a specific scope.  
Content:

* **Header:** Project Title and "Edit" icon (if Admin).  
* **View Switcher:** "List View" vs "Board View" (Kanban).  
* **Status Columns/Sections:**  
  * To Do  
  * In Progress  
  * Review/Recheck  
  * Done  
    Logic:  
* Tasks are grouped by status.  
* Drag-and-drop functionality (using react-native-draggable-flatlist) allows moving tasks between statuses, triggering an API update.

### **7.6 Task Detail Screen (The Core Interface)**

Objective: The specific workspace for a unit of work.  
Content:

* **Navigation:** Back button (top left), Options menu (top right).  
* **Title Area:** Large, bold text. Editable if user has permission.  
* **Status Selector:** A prominent dropdown or horizontal picker showing the current stage (e.g., "In Progress").  
  * *Constraint:* Changing status to "Recheck" opens a mandatory comment modal.  
* **Attributes:**  
  * **Assignee:** Tap to reassign (opens user picker).  
  * **Due Date:** Tap to open DatePicker.  
  * **Priority:** Flag icon (Low/Med/High).  
* **Description:** Rich text area (supports bold, lists).  
* **Checklist:** Sub-tasks (simple checkboxes).  
* **Attachments:** Horizontal scroll of thumbnails. "Add" button opens Camera/Gallery.  
* **Activity Feed:** Chronological list of comments and status changes.  
  * *Empty State:* If no comments, show a friendly illustration "No activity yet".35  
  * Input: "Write a comment..." bar at the bottom.  
    Logic:  
* **Offline Handling:** If a user adds a comment offline, it appears instantly in the list with a "clock" icon. When synced, the icon changes to a "check" mark.

### **7.7 Profile & Settings Screen**

Objective: User preferences.  
Content:

* **Avatar:** Large image. Tap to upload new photo.  
* **Details:** Name, Email, Role (Read-only).  
* **Settings:**  
  * **Dark Mode:** Toggle switch.36  
  * **Notifications:** Toggle for "New Assignments", "Recheck Alerts".  
* **Sync Status:** Text showing "Last synced: 2 mins ago" or "Syncing...".  
* **Logout:** Red text button.

## ---

**8\. The "Recheck" Workflow Logic**

This workflow is the app's unique selling point and requires specific logic in both frontend and backend.

### **8.1 The Happy Path**

1. **User** starts task \-\> Status: **In Progress**.  
2. **User** completes work, uploads photo \-\> Status: **Under Review**.  
3. **Admin** gets notification. Opens task. Checks photo.  
4. **Admin** approves \-\> Status: **Done**.

### **8.2 The Recheck Path (Quality Control)**

1. **Admin** reviews photo, notices an error.  
2. **Admin** selects Status: **Recheck**.  
3. **App Intercept:** The app detects the "Recheck" selection and halts the update.  
4. **Modal Trigger:** A modal appears: "Reason for Rejection".  
5. **Input:** Admin types "The wiring is exposed in the top corner."  
6. **Submission:** App sends *two* requests:  
   * Update Status to **Recheck**.  
   * Post Comment: "Rejection Reason: The wiring is exposed..."  
7. **Notification:** The original User receives a high-priority push notification: "Task Rejected: The wiring is exposed..."  
8. **Visual Cue:** On the User's dashboard, this task moves to the top with a red "Recheck" badge.

## ---

**9\. Non-Functional Requirements**

### **9.1 Performance**

* **Launch Time:** The app must be interactive within **2 seconds** of tapping the icon (Cold Start).  
* **Scroll Performance:** Lists (Task List) must maintain **60 FPS** (Frames Per Second). This requires strictly using FlatList with optimized components (e.g., React.memo to prevent unnecessary re-renders).37  
* **Image Optimization:** Large photos uploaded by users must be compressed on the client side using react-native-image-resizer before upload to save bandwidth and storage costs.

### **9.2 Reliability & Offline**

* **Sync Queue:** The app must persist a queue of failed network requests (e.g., Redux Offline or WatermelonDB sync). If the app is killed while offline, these requests must persist and retry upon next launch.9  
* **Conflict Resolution:** If two users edit a task simultaneously, the server's version takes precedence (Last Write Wins), but the client is notified.

### **9.3 Security**

* **Data at Rest:** The local database (SQLite) should be encrypted if the device supports it.  
* **Data in Transit:** All traffic must use HTTPS (TLS 1.2+).  
* **Password Storage:** The NestJS backend must hash passwords using **Bcrypt** with a salt round of at least 10\.39

## ---

**10\. Development Roadmap**

### **Phase 1: Foundation (Weeks 1-4)**

* **Backend:** Initialize NestJS repo. Configure TypeORM and Postgres. Build AuthModule (Login/Register).  
* **Frontend:** Initialize React Native. Setup Navigation. Build Login/Signup screens.

### **Phase 2: Core Task Features (Weeks 5-8)**

* **Backend:** Build TasksModule and ProjectsModule. Implement basic CRUD.  
* **Frontend:** Build Dashboard, Project List, and Task List. Implement local database (WatermelonDB).

### **Phase 3: The Workflow Engine (Weeks 9-12)**

* **Backend:** Implement the "Recheck" logic, Comments system, and Push Notifications.  
* **Frontend:** Build Task Detail screen. Implement the "Rejection Modal" and file upload logic.

### **Phase 4: Polish & Performance (Weeks 13-16)**

* **Optimization:** Stress test the offline sync. Optimize list scrolling.  
* **QA:** Test on low-end Android devices to ensure performance meets targets.  
* **Launch:** Deploy backend to cloud (AWS/Heroku). Submit app to Stores.

## ---

**11\. Conclusion**

This Product Requirements Document outlines a robust, professional-grade solution for team task management. By addressing the specific failures of market leaders—specifically mobile performance and offline reliability—and implementing a strict "Recheck" workflow, this application is positioned to serve teams that demand accountability and speed. The combination of React Native for a fluid user experience and NestJS for a structured, scalable backend provides the ideal technical foundation for this vision.

#### **Works cited**

1. ClickUp iOS app is terrible \- Reddit, accessed December 22, 2025, [https://www.reddit.com/r/clickup/comments/1euawsq/clickup\_ios\_app\_is\_terrible/](https://www.reddit.com/r/clickup/comments/1euawsq/clickup_ios_app_is_terrible/)  
2. Why is ClickUp so slow compared to other tools? \- Reddit, accessed December 22, 2025, [https://www.reddit.com/r/clickup/comments/1n2kqar/why\_is\_clickup\_so\_slow\_compared\_to\_other\_tools/](https://www.reddit.com/r/clickup/comments/1n2kqar/why_is_clickup_so_slow_compared_to_other_tools/)  
3. why is ClickUp so Slow\!\!\!\!\!\!\!\!\!\!\!\!\!\!\! \- Reddit, accessed December 22, 2025, [https://www.reddit.com/r/clickup/comments/1ffgmqv/why\_is\_clickup\_so\_slow/](https://www.reddit.com/r/clickup/comments/1ffgmqv/why_is_clickup_so_slow/)  
4. why is the android app so consistently buggy? \- Ask the Community \- Asana Forum, accessed December 22, 2025, [https://forum.asana.com/t/why-is-the-android-app-so-consistently-buggy/1025913](https://forum.asana.com/t/why-is-the-android-app-so-consistently-buggy/1025913)  
5. Asana Reviews, Pros & Cons, and More (2025) \- Fibery, accessed December 22, 2025, [https://fibery.io/openion/asana-116/asana-mobile-app-user-feedback-compilation-386399](https://fibery.io/openion/asana-116/asana-mobile-app-user-feedback-compilation-386399)  
6. Build an offline-first app | App architecture \- Android Developers, accessed December 22, 2025, [https://developer.android.com/topic/architecture/data-layer/offline-first](https://developer.android.com/topic/architecture/data-layer/offline-first)  
7. 24 Power BI KPI Dashboard Examples: Professional Templates \- Vidi Corp, accessed December 22, 2025, [https://vidi-corp.com/power-bi-kpi-dashboard-examples/](https://vidi-corp.com/power-bi-kpi-dashboard-examples/)  
8. Streamlining Bug Tracking for Success: An Effective Workflow for Developers and Testers | by Vignaraj Ravi | Medium, accessed December 22, 2025, [https://medium.com/@vignarajj/streamlining-bug-tracking-for-success-an-effective-workflow-for-developers-and-testers-bd774f52e40d](https://medium.com/@vignarajj/streamlining-bug-tracking-for-success-an-effective-workflow-for-developers-and-testers-bd774f52e40d)  
9. How I designed an offline-first app. An outline. \- Brisqi Blog, accessed December 22, 2025, [https://blog.brisqi.com/posts/how-i-designed-an-offline-first-app-an-outline](https://blog.brisqi.com/posts/how-i-designed-an-offline-first-app-an-outline)  
10. Asana: Work Management \- Apps on Google Play, accessed December 22, 2025, [https://play.google.com/store/apps/details?id=com.asana.app](https://play.google.com/store/apps/details?id=com.asana.app)  
11. monday.com \- Work Management \- Apps on Google Play, accessed December 22, 2025, [https://play.google.com/store/apps/details?id=com.monday.monday](https://play.google.com/store/apps/details?id=com.monday.monday)  
12. monday.com \- Work Platform \- Ratings & Reviews \- App Store \- Apple, accessed December 22, 2025, [https://apps.apple.com/us/app/monday-com-work-platform/id1290128888?see-all=reviews\&platform=undefined](https://apps.apple.com/us/app/monday-com-work-platform/id1290128888?see-all=reviews&platform=undefined)  
13. Jira Cloud by Atlassian \- Apps on Google Play, accessed December 22, 2025, [https://play.google.com/store/apps/details?id=com.atlassian.android.jira.core](https://play.google.com/store/apps/details?id=com.atlassian.android.jira.core)  
14. Jira Cloud by Atlassian \- App Store \- Apple, accessed December 22, 2025, [https://apps.apple.com/us/app/jira-cloud-by-atlassian/id1006972087](https://apps.apple.com/us/app/jira-cloud-by-atlassian/id1006972087)  
15. 40 Best Task Management Software Reviewed For 2025, accessed December 22, 2025, [https://thedigitalprojectmanager.com/tools/best-task-management-software/](https://thedigitalprojectmanager.com/tools/best-task-management-software/)  
16. How to create an approval workflow for your team \- Wrike, accessed December 22, 2025, [https://www.wrike.com/blog/how-to-create-approval-workflow/](https://www.wrike.com/blog/how-to-create-approval-workflow/)  
17. Top 10 Employee Task Management App in 2025 | TARGPatrol, accessed December 22, 2025, [https://targpatrol.com/blog/top-free-task-management-apps-for-mobile-teams-in-2025/](https://targpatrol.com/blog/top-free-task-management-apps-for-mobile-teams-in-2025/)  
18. Best Practices for Structuring a NestJS Application | by @rnab \- Medium, accessed December 22, 2025, [https://arnab-k.medium.com/best-practices-for-structuring-a-nestjs-application-b3f627548220](https://arnab-k.medium.com/best-practices-for-structuring-a-nestjs-application-b3f627548220)  
19. Modules | NestJS \- A progressive Node.js framework, accessed December 22, 2025, [https://docs.nestjs.com/modules](https://docs.nestjs.com/modules)  
20. Full-Stack Task Management App with React, NestJS & TypeScript \- YouTube, accessed December 22, 2025, [https://www.youtube.com/watch?v=d5Tr0QMLS5E](https://www.youtube.com/watch?v=d5Tr0QMLS5E)  
21. Building Robust Role-Based Access Control (RBAC) in TypeScript with NestJS \- Medium, accessed December 22, 2025, [https://medium.com/@nwonahr/building-robust-role-based-access-control-rbac-in-typescript-with-nestjs-f96bd01f89ad](https://medium.com/@nwonahr/building-robust-role-based-access-control-rbac-in-typescript-with-nestjs-f96bd01f89ad)  
22. Building an Advanced RBAC System in NestJS \- Thomas Vanderstraeten, accessed December 22, 2025, [https://thomasvds.com/building-an-advanced-rbac-system-in-nest-js/](https://thomasvds.com/building-an-advanced-rbac-system-in-nest-js/)  
23. TaskNexus \- Modern Task Management, accessed December 22, 2025, [https://hoangsonww.github.io/Task-Manager-ReactNative/](https://hoangsonww.github.io/Task-Manager-ReactNative/)  
24. Database | NestJS \- A progressive Node.js framework, accessed December 22, 2025, [https://docs.nestjs.com/techniques/database](https://docs.nestjs.com/techniques/database)  
25. NestJS, TypeORM and PostgreSQL — full example development and project setup working with database migrations. | by Simon Gausmann | Medium, accessed December 22, 2025, [https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f](https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f)  
26. NestJS Code Sample: API Role-Based Access Control \- Auth0, accessed December 22, 2025, [https://developer.auth0.com/resources/code-samples/api/nestjs/basic-role-based-access-control](https://developer.auth0.com/resources/code-samples/api/nestjs/basic-role-based-access-control)  
27. Custom Role-Based Access Control in NestJS Using Custom Guards \- DEV Community, accessed December 22, 2025, [https://dev.to/imzihad21/custom-role-based-access-control-in-nestjs-using-custom-guards-jol](https://dev.to/imzihad21/custom-role-based-access-control-in-nestjs-using-custom-guards-jol)  
28. A Practical Guide to React Native App Development \- RapidNative, accessed December 22, 2025, [https://www.rapidnative.com/blogs/react-native-app-development](https://www.rapidnative.com/blogs/react-native-app-development)  
29. Navigating Between Screens \- React Native, accessed December 22, 2025, [https://reactnative.dev/docs/navigation](https://reactnative.dev/docs/navigation)  
30. Structure for nested navigation with react-native-navigation \- Stack Overflow, accessed December 22, 2025, [https://stackoverflow.com/questions/72897876/structure-for-nested-navigation-with-react-native-navigation](https://stackoverflow.com/questions/72897876/structure-for-nested-navigation-with-react-native-navigation)  
31. Taskkit \- Task management app written in react native : r/reactnative \- Reddit, accessed December 22, 2025, [https://www.reddit.com/r/reactnative/comments/uiwahq/taskkit\_task\_management\_app\_written\_in\_react/](https://www.reddit.com/r/reactnative/comments/uiwahq/taskkit_task_management_app_written_in_react/)  
32. 13 UI Design Patterns You Need to Know for Modern Interfaces \- Designership, accessed December 22, 2025, [https://www.thedesignership.com/blog/13-ui-design-patterns-you-need-to-know-for-modern-interfaces](https://www.thedesignership.com/blog/13-ui-design-patterns-you-need-to-know-for-modern-interfaces)  
33. A Practical Guide to React Native UI Components \- RapidNative, accessed December 22, 2025, [https://www.rapidnative.com/blogs/react-native-ui-components](https://www.rapidnative.com/blogs/react-native-ui-components)  
34. 7 best to do list apps of 2026 \- Zapier, accessed December 22, 2025, [https://zapier.com/blog/best-todo-list-apps/](https://zapier.com/blog/best-todo-list-apps/)  
35. Empty states \- Material Design, accessed December 22, 2025, [https://m2.material.io/design/communication/empty-states.html](https://m2.material.io/design/communication/empty-states.html)  
36. How React Native boilerplate helps us build mobile apps faster \[Starter Kit for 2022\] \!UPDATE\! | Brocoders blog about software development, accessed December 22, 2025, [https://brocoders.com/blog/react-native-boilerplate/](https://brocoders.com/blog/react-native-boilerplate/)  
37. Performance Overview \- React Native, accessed December 22, 2025, [https://reactnative.dev/docs/performance](https://reactnative.dev/docs/performance)  
38. Using List Views \- React Native, accessed December 22, 2025, [https://reactnative.dev/docs/using-a-listview](https://reactnative.dev/docs/using-a-listview)  
39. ev0clu/task-manager: Fullstack (React.js, Nest.js) Task Manager App \- GitHub, accessed December 22, 2025, [https://github.com/ev0clu/task-manager](https://github.com/ev0clu/task-manager)