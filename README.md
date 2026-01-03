# 🚀 Civic Issue Tracker

A modern, community-focused web application for reporting, viewing, and tracking civic issues such as potholes, garbage problems, and infrastructure concerns. The project emphasizes clean UI, real authentication, and a smooth end-to-end user experience.

🔗 **Live Demo:** [https://civic-issue-tracker-three.vercel.app/](https://civic-issue-tracker-three.vercel.app/)

---

## ✨ Features

* 🎨 **Modern & Responsive UI** – Clean layout, smooth animations, and mobile-friendly design
* 🔐 **Firebase Authentication (Google Technology)** – Secure email/password login using Firebase Auth
* 👥 **Demo Login Support** – One-click **Citizen** and **Admin** demo login buttons for easy review
* 🗺️ **Interactive Maps** – Cluster-based issue visualization using Leaflet
* 📊 **Dashboard Overview** – View total issues, resolved issues, and activity stats
* 📸 **Image Upload Support** – Attach images while reporting issues
* 🔔 **Toast Notifications** – Clear success and error feedback
* ✅ **Form Validation** – Client-side validation for better UX

---

## 🔐 Authentication Details

This project uses **Firebase Authentication**, a **Google Cloud service**, to manage user login securely.

### Demo Login Instructions

To log in:

* Go to the **Login** page
* Click the **Citizen** or **Admin** demo login button
* No manual credentials are required for reviewers

> Firebase Authentication satisfies the requirement of using **one Google technology**.

---

##  Tech Stack

### Frontend

* React (Create React App)
* Firebase Authentication
* Leaflet & React-Leaflet (Maps)
* Axios
* Tailwind CSS
* Framer Motion

### Backend

* FastAPI
* SQLAlchemy
* SQLite (can be replaced with PostgreSQL)
* Hosted on Render

---
### FLOWCHART
User
 ↓
Web App (Vercel)
 ↓
Login Page
 ↓
Firebase Authentication (Google Cloud)
 ↓
Dashboard
 ↓
View Issues / Submit Issue
 ↓
Backend API (Render)
 ↓
Database


## 🚀 Deployment

* **Frontend:** Deployed on **Vercel**
* **Backend:** Deployed on **Render**
* **Authentication:** Firebase (Google Cloud)

The application is fully deployed and accessible via the live demo link above.

---

## ⚠️ Known Limitations (For Reviewers)

* Authentication is handled on the frontend using Firebase for demonstration purposes.
* Some backend routes may be restricted as the project prioritizes demo usability and flow over full production-grade authorization.

These choices are intentional for easier review and evaluation.

---

## 🎯 How to Review the Project

1. Open the live demo link
2. Navigate to the **Login** page
3. Click the **Citizen** or **Admin** demo login button
4. Explore the dashboard and map view

---

## 🤝 Acknowledgements

Special thanks to my friend who supported and helped during the development of this project.

---

## 📬 Feedback

Feedback on UI, usability, and overall experience is highly appreciated. Please feel free to explore the app and share your thoughts.

---

**Made with ❤️ to improve civic engagement and community awareness.**
