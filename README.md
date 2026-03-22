# 🎓 EduNexus

Elevating Institutional Administration. EduNexus is a modern, deeply scalable multi-tenant SaaS architecture designed to handle complex academic lifecycles, rigorous student document verification routines, and robust fee tracking systems—styled with beautiful, professional-grade UI interfaces.

![EduNexus Tech Stack](https://img.shields.io/badge/Next.js%2014-black?style=for-the-badge&logo=next.js&logoColor=white) 
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068b7?style=for-the-badge&logo=zod&logoColor=white)

---

## ⚡ Core Features

- 🏢 **Multi-Tenant Routing:** Complete data isolation utilizing strict `institute_code` enforcement across MongoDB records and API layers.
- 💳 **Smart Fee Engines:** Instantly calculate remaining and total fee arrays synchronously connected tightly with comprehensive Zod schema validations.
- 🪪 **Real-Time ID Designer:** Dynamically scale, preview, and generate print-ready Student ID Cards right directly inside a responsive React-portaled UI modal.
- ☁️ **Orphan-Proof Cloud Media:** Eliminates AWS/ImageKit cloud bloat algorithmically locking unsubmitted storage files loosely into a `temporary` garbage-collected state before confirmed API bindings.

## 🛠️ Project Architecture 

EduNexus embraces a highly specialized Model-View-Controller layered adaptation utilizing the Next.js `app` router for aggressive backend colocation:

* **[Frontend Presentation]**: Built heavily on optimized `shadcn/ui` components augmented intimately with robust `react-hook-form` inputs.
* **[Backend Controllers]**: RESTful abstractions inside `/app/api` routing directly into secure `Mongoose` schema definitions.
* **[Service Tier]**: Decoupled domain business logic cleanly extracted into singleton classes (e.g. `mediaService`, `studentService`) enabling unit-testing resilience and repository patterns.

## 🚀 Getting Started

Deploy locally using the Next.js dev server:

```bash
npm install
npm run dev
```

Navigate cleanly to [http://localhost:3000](http://localhost:3000) inside your browser.


## 📊 Tech Spec Highlight
- **Global State**: Accelerated through sophisticated strict `Redux` RTK slices storing deep institutional contextual trees and user profiles. 
- **Forms**: Driven by 300+ line localized `Zod` schemas yielding incredibly crisp string errors and perfect TypeScript `Infer<>` matching.

> *Architected to be visually engaging and systematically unbreakable.*
