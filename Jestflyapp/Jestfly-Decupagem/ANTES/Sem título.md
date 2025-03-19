

Below is a complete document that combines the general guidelines for the programming AI, the “anti-deception” rules for the codebase review, and the full project overview of **JESTFLY**—all translated into English and formatted in Markdown with checklist-style options.

---

# Guidelines and Rules for the Programming AI

## General Guidelines

-  **Economy and Efficiency:**  
    Save tokens and the user’s time by always seeking the most practical and efficient solution.
    
-  **Clarity and Communication:**  
    Ensure the prompt is clear. In case of any doubts or ambiguities, ask specific questions for clarification before proceeding.
    
-  **Authorization and Transparency:**  
    Never make decisions or implement changes without explicit user permission. Explain the detailed action plan in the chat before executing it, and always ask for approval.
    
-  **Comprehensive Approach:**  
    Use all available information from the conversation, exploring every possible solution and using the maximum available characters to detail the plan.
    
-  **Code Integrity:**  
    Avoid refactoring or making changes without prior notice and user consent, always maintaining open communication about any proposed changes.
    

---

# EXTRA TASK (ANTI-DECEPTION VERSION): Complete and Immediate Codebase Review

1. **Thorough Review of All Code (Mandatory and Immediate)**
    
    - [ ]  Do not omit any file and do not ignore any folder.
    - [ ]  Traverse all layers of the project (frontend, backend, configurations, and scripts).
    - [ ]  If any component or library is not analyzed, the report will be considered incomplete.
2. **Ruthless Diagnosis**
    
    - [ ]  List all potential failure points without downplaying any problem.
    - [ ]  If the code is confusing, explicitly state the confusion; do not attempt to omit or sugarcoat it.
    - [ ]  Any segment with complex logic should be detailed and questioned regarding its clarity and efficiency.
3. **Security Without Excuses**
    
    - [ ]  Check all routes and endpoints for vulnerabilities (SQL injection, XSS, CSRF, etc.).
    - [ ]  Any identified breach must be described with clear examples of the problem and possible solutions.
    - [ ]  If the project lacks security tests, record this as a severe failure.
4. **Consistency and Organization**
    
    - [ ]  Precisely identify where there are inconsistencies in naming, style, or code standards.
    - [ ]  If duplication of functions or logic is found, report the duplication and suggest refactoring.
    - [ ]  Analyze adherence to style guides (Tailwind, React, TypeScript) and report any discrepancies.
5. **Efficiency and Performance**
    
    - [ ]  Investigate each component that could cause bottlenecks (nested loops, inefficient queries, etc.).
    - [ ]  If there are external APIs or integrations that might impact performance, describe the impact.
    - [ ]  Present clear and immediate optimization suggestions.
6. **Documentation and Comments**
    
    - [ ]  Evaluate whether the code has sufficient internal documentation (comments, docstrings) for each critical function.
    - [ ]  If there are no comments in complex functions, flag this as a priority.
    - [ ]  If the official documentation (README or Wiki) is incomplete or outdated, report it in the review.
7. **Straightforward Final Report**
    
    - [ ]  Deliver a comprehensive report containing:
        - [ ]  **List of Issues Found** (organized by severity: critical, high, medium, low).
        - [ ]  **Proposed Solutions** (with examples of how to fix them).
        - [ ]  **Concrete Examples** of suspicious or poorly structured code segments.
        - [ ]  **Step-by-Step Instructions** for implementing fixes or improvements.
    - [ ]  If more than one report is needed (due to the codebase’s size), divide them into parts without omitting any section.
8. **Anti-Evasion Guarantee**
    
    - [ ]  Do not ignore or mask responses by claiming “lack of context” or generic “limitations.”
    - [ ]  If any file or part of the system is missing, report that it was not provided or that content is lacking.
    - [ ]  In case of doubt, ask specific questions or request additional files, but never conclude the task without the complete overview.

> **Note:** This README is prohibited from any modifications to these rules or the checklist. The only permitted actions are to check off the items already described or add new ones—but never delete or alter the existing ones.

---

# Project Overview: JESTFLY

**JESTFLY** is a comprehensive web platform for musical artists, content creators, and fans. The platform combines community features, demo submission, an NFT marketplace, the digital currency JestCoin, and career planning tools into an integrated ecosystem.

## Current Status & Roadmap



✅ Complete Features
🟠 In Progress
🔴 Planned Features
🔶  New Features
🔄 Integration
❌ ERRO

**Core Platform**

- [ ]  **Authentication & User Management**
    - [ ]  Supabase Authentication
    - [ ]  Password Recovery
    - [ ]  Protected Routes & Authorization
    - [ ]  Multi-role Support (Admin, Artist, Fan, Collaborator)
- [ ]  **Responsive Layout & Navigation**
    - [ ]  Mobile-friendly Design
    - [ ]  Header with Dynamic Navigation
    - [ ]  Mobile Menu
    - [ ]  Error Handling & 404s

**Community Features**

- [ ]  Post Creation & Management
- [ ]  Rich Comments & Interaction System
- [ ]  Like/Reaction System
- [ ]  User Profiles with Activity History
- [ ]  Categories and Topic Organization
- [ ]  Post Detail Views
- [ ]  Community Exploration

**Demo Submission System**

- [ ]  Complete Submission Form
- [ ]  Audio File Uploads with Enhanced Progress UI
- [ ]  Multi-file Audio Upload Support
- [ ]  Artist Profile Information Collection
- [ ]  Demo Categories and Genre Tagging
- [ ]  User Demo History
- [ ]  Integrated Audio Player
- [ ]  Basic Feedback Interface

**Analytics**

- [ ]  Page View Tracking
- [ ]  Event Tracking (submissions, logins, interactions)
- [ ]  Basic Data Visualization with Charts
- [ ]  Interactive Charts with Multiple Visualizations
- [ ]  Metric Display Components
- [ ]  Chart Data Export

**JestCoin Wallet**

- [ ]  Balance Display
- [ ]  Transaction History
- [ ]  Transfer Capability
- [ ]  User Search for Transfers
- [ ]  Basic Rewards System

**Product Store**

- [ ]  Product Listings
- [ ]  Product Details
- [ ]  Shopping Cart
- [ ]  Order History

**NFT Gallery**

- [ ]  Basic NFT Viewer
- [ ]  Gallery Interface
- [ ]  Collection Display

**UI/UX Components**

- [ ]  shadcn/ui Component Library
- [ ]  Toast Notifications
- [ ]  Modals and Dialogs
- [ ]  Form Validation
- [ ]  Animated Interactive Charts
- [ ]  Loaders and Skeletons

**Backend (Supabase)**

- [ ]  Complete Authentication System
- [ ]  Database Tables for All Features
- [ ]  Row-Level Security Policies
- [ ]  Custom SQL Functions for Complex Operations
- [ ]  Storage Buckets for Media


**Demo Platform**

- [ ]  Enhanced Feedback System with Ratings
- [ ]  Advanced Audio Processing Features
- [ ]  Demo Status Workflow Improvements

**Analytics Enhancements**

- [ ]  Custom Date Filters
- [ ]  Personalized Dashboards
- [ ]  Real-time Analytics Updates
- [ ]  Expanded Metric Types
- [ ]  Enhanced Data Visualization

**Career Planning Dashboard**

- [ ]  Canvas-like Interface for Career Planning
- [ ]  Node-based Workflow System
- [ ]  Google Calendar Integration
- [ ]  Event Scheduling and Tracking
- [ ]  Collaborative Planning with Team Members
- [ ]  Task Assignment and Management
- [ ]  Career Milestone Tracking
- [ ]  Reminder System with Notifications
- [ ]  Calculators for Budget/Revenue Projections

**JestCoin System Enhancements**

- [ ]  Detailed Transaction History
- [ ]  Automated Reward System
- [ ]  Administrative Interface
- [ ]  Transaction Statistics

**Store & Products Enhancements**

- [ ]  Real Payment Processing
- [ ]  Real-time Order Status
- [ ]  Product Filtering Improvements
- [ ]  Product Rating System
- [ ]  Digital Product Delivery

**NFT Marketplace Enhancements**

- [ ]  Enhanced NFT Viewer
- [ ]  Buy/Sell Interface
- [ ]  Metadata Display and Management
- [ ]  Collection Organization


**Security & Authentication**

- [ ]  Social Login (Google, Twitter, Discord)
- [ ]  Two-factor Authentication
- [ ]  Email Verification
- [ ]  Advanced Permission Levels
- [ ]  Account Activity Logs
- [ ]  Admin Dashboard
- [ ]  Comprehensive Admin Interface
- [ ]  User Management
- [ ]  Content Moderation Tools
- [ ]  Advanced Analytics Dashboard
- [ ]  Inventory Management
- [ ]  Demo Approval Workflow
- [ ]  Platform Status Monitoring

**Live Streaming**

- [ ]  Live Video Player
- [ ]  Real-time Chat System
- [ ]  Donation Processing
- [ ]  Event Scheduling
- [ ]  Stream Archiving

**Complete NFT Marketplace**

- [ ]  Blockchain Integration
- [ ]  Auction System
- [ ]  NFT Minting Interface
- [ ]  Creator Royalties
- [ ]  Collection Management

**Revenue Features**

- [ ]  Subscription System
- [ ]  Digital Product Delivery
- [ ]  Multiple Payment Gateway Integration
- [ ]  Affiliate Program
- [ ]  Revenue Sharing

**Performance & Scalability**

- [ ]  Media Optimization
- [ ]  CDN Implementation
- [ ]  Advanced Lazy Loading
- [ ]  Optimized Caching
- [ ]  Code Splitting

**Mobile & Cross-platform**

- [ ]  Mobile Application
- [ ]  Offline Experience
- [ ]  Push Notifications
- [ ]  Cross-device Synchronization

**Communication Features**

- [ ]  Email Notification System
- [ ]  In-app Messaging
- [ ]  Collaborative Tools
- [ ]  Team Communication

---

# Tech Stack

**Current Implementation**

- [ ]  React + TypeScript
- [ ]  Tailwind CSS + shadcn/ui
- [ ]  Supabase (Auth, DB, Storage)
- [ ]  React Router
- [ ]  React Hook Form
- [ ]  Recharts for data visualization
- [ ]  Lucide icons
- [ ]  React Dropzone for file uploads

**Planned Additions**

- [ ]  Payment Processing (Stripe/PayPal)
- [ ]  Blockchain Integration (Ethereum/Solana)
- [ ]  WebSocket Integration for Real-time Features
- [ ]  SendGrid for Email Communications
- [ ]  CDN for Media Optimization
- [ ]  Stream Processing Services
- [ ]  Advanced State Management

---

# Detailed Feature Breakdown

**Career Planning Dashboard**  
The Career Planning Dashboard is a specialized workspace—similar to canvas tools like Flowise or Whiteboards—designed specifically for musical artists and professionals.

-  **Node-Based Interface**
    
    - [ ]  Creation of nodes representing tasks, goals, and events.
    - [ ]  Connection of nodes to create career roadmaps.
    - [ ]  Addition of dependencies and relationships between goals.
-  **Integration Nodes**
    
    - [ ]  Integration with Google Calendar for scheduling.
    - [ ]  Budget calculators.
    - [ ]  Revenue projections.
    - [ ]  Task management.
    - [ ]  Contact organization.
-  **Collaboration Features**
    
    - [ ]  Inclusion of team members or collaborators.
    - [ ]  Assignment of responsibilities.
    - [ ]  Contribution monitoring.
    - [ ]  Sharing segments of the career plan.
-  **Alert & Reminder System**
    
    - [ ]  Deadline notifications.
    - [ ]  Task completion alerts.
    - [ ]  Celebrations for important milestones.
    - [ ]  Reminders via email or push notifications.
-  **Progress Tracking**
    
    - [ ]  Visual indicators of completion.
    - [ ]  Timeline visualization.
    - [ ]  Metrics for goal achievement.
    - [ ]  Performance comparison against set goals.

**Demo Submission System**  
A comprehensive system for artists to submit their demos on the platform.

-  **Multi-file Upload**
    
    - [ ]  Support for various audio formats.
    - [ ]  Submission of multiple tracks.
    - [ ]  Enhanced progress visualization.
    - [ ]  Drag-and-drop interface.
-  **Artist Profile**
    
    - [ ]  Biographical information.
    - [ ]  Social media links.
    - [ ]  Genre classification.
    - [ ]  Indicators of influences and style.
-  **Review Process**
    
    - [ ]  Status tracking (pending, under review, approved, rejected).
    - [ ]  Collection of reviewer feedback.
    - [ ]  Star rating system.
    - [ ]  Improvement suggestions.
-  **Publishing Pipeline**
    
    - [ ]  Promotion of approved demos.
    - [ ]  Community sharing options.
    - [ ]  Consideration for future features.
    - [ ]  Distribution opportunities.

**JestCoin Ecosystem**  
A digital currency system that powers the platform's economy.

-  **Wallet Management**
    
    - [ ]  Balance display.
    - [ ]  Transaction history.
    - [ ]  Transfer capability.
    - [ ]  Receipt generation.
-  **Earning Mechanisms**
    
    - [ ]  Rewards for community participation.
    - [ ]  Bonuses for content creation.
    - [ ]  Achievement unlocks.
    - [ ]  Referral incentives.
-  **Spending Options**
    
    - [ ]  In-store purchases.
    - [ ]  Feature unlocks.
    - [ ]  Access to premium content.
    - [ ]  Payment for services.
-  **Value Exchange**
    
    - [ ]  Future blockchain integration.
    - [ ]  Potential real-world value.
    - [ ]  Trading mechanisms.
    - [ ]  Value storage.

---

# Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

For detailed documentation, visit [docs.jestfly.com](http://docs.jestfly.com/).

---

# Development Priorities

- [ ]  Complete the Career Planning Dashboard
- [ ]  Enhance the Demo Submission System
- [ ]  Implement payment processing
- [ ]  Develop a comprehensive administrative interface
- [ ]  Build streaming functionalities
- [ ]  Improve analytics and dashboards
- [ ]  Implement blockchain for NFTs and JestCoin
- [ ]  Optimize performance and user experience (UX)

---

# Contributing

Please read our **Contributing Guidelines** before submitting pull requests or issues.

---

# License

This project is licensed under the **MIT License** – see the LICENSE file for details.

---

This document compiles all the necessary guidelines and specifications for the programming AI to perform a complete and thorough analysis of the JESTFLY codebase, ensuring that no step is omitted and that all measures regarding security, consistency, and performance are rigorously evaluated—without any attempt to evade or omit information.