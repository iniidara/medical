# MediQ

Real-time clinic workflow and queue management system built for universities and campus medical centers.

MediQ helps reduce overcrowding, improve patient flow, and modernize student clinic experiences through live queue tracking, smart triage, and real-time updates.

## Features

### Student Check-In

* Full name + matric number input
* Multi-symptom selection
* Additional health notes
* Smart urgency classification
* Automatic ticket generation

### Live Queue System

* Real-time queue updates using Supabase
* Ticket-based privacy system
* Estimated wait times
* Urgency badges
* “You’re Next” indicators
* Browser notifications

### Admin Dashboard

* Secure admin login
* Live patient management
* Call patient workflow
* Mark patient as seen
* Remove patients from queue
* Queue analytics dashboard
* Urgency prioritization

### 🔔 Notifications

* Browser push notifications
* Real-time queue alerts
* Instant queue syncing


# Why MediQ?

Campus clinics across Africa still rely heavily on:

* paper queues
* overcrowded waiting areas
* inefficient patient flow
* poor communication systems

MediQ modernizes that experience with a lightweight and scalable real-time workflow system designed specifically for schools and universities.


# Built With

* HTML5
* CSS3
* JavaScript
* Supabase
* Vercel


# How It Works

## Student Flow

1. Student checks in
2. Symptoms are selected
3. Urgency is assigned automatically
4. Ticket number is generated
5. Student joins live queue

## Clinic Flow

1. Clinic admin logs in
2. Dashboard displays all active patients
3. Patients are prioritized by urgency
4. Admin calls next patient
5. Queue updates live for everyone

# Project Structure

```text
/
├── index.html
├── queue.html
├── admin.html
├── admin-login.html
│
├── styles.css
├── queue.css
├── admin.css
├── login.css
│
├── app.js
├── queue.js
├── admin.js
├── admin-login.js
├── supabase.js
```

---

# Key Features In Detail

## Smart Triage System

Patients are automatically categorized into:

* Urgent
* Moderate
* Non-Urgent

based on submitted symptoms.

---

## Real-Time Updates

MediFlow uses Supabase realtime subscriptions to instantly sync:

* queue updates
* admin actions
* patient status changes

across all devices.

## Privacy Focused

Instead of displaying full patient names publicly, MediFlow uses ticket IDs such as:

```text
MF-2041
```

to protect student privacy.

Vision

MediQ is designed to become a lightweight clinic operating system for African universities and student medical centers.

The goal is to create:

* faster patient processing
* less overcrowding
* smarter clinic workflows
* better healthcare accessibility for students

# Future Improvements

* SMS / WhatsApp alerts
* QR code check-in
* AI-assisted triage
* Appointment scheduling
* Doctor dashboards
* Medical records integration
* Multi-clinic support

# Deployment

This project is optimized for deployment on Vercel.

# Author

Built by a student founder passionate about solving real problems in African healthcare and education through technology.


# If You Like This Project

Star the repo, share feedback, and contribute ideas to help improve healthcare experiences for students everywhere.
