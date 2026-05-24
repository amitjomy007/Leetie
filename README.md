<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/logo_dark.png">
    <img src="./public/logo_light.png" width="140" alt="Leetie Logo"/>
  </picture>
</p>

<h1 align="center">Leetie 👋</h1>

<p align="center">
  <b>Open-source company-wise LeetCode intelligence dashboard.</b>
  <br />
  Track interview trends, organize preparation, and build a smarter grinding workflow.
</p>

<p align="center">
  If this project helps your interview prep, consider giving it a ⭐
</p>

<p align="center">
  <a href="https://github.com/amitjomy007/Leetie/stargazers">
    <img src="https://img.shields.io/github/stars/amitjomy007/Leetie?style=for-the-badge" />
  </a>
  <a href="https://github.com/amitjomy007/Leetie/network/members">
    <img src="https://img.shields.io/github/forks/amitjomy007/Leetie?style=for-the-badge" />
  </a>
  <a href="https://github.com/amitjomy007/Leetie/issues">
    <img src="https://img.shields.io/github/issues/amitjomy007/Leetie?style=for-the-badge" />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/github/license/amitjomy007/Leetie?style=for-the-badge" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript" />
  <img src="https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black" />
  <img src="https://img.shields.io/badge/Open_Source-181717?style=for-the-badge&logo=github" />
</p>

<p align="center">
  <a href="https://github.com/amitjomy007">
    <img src="https://img.shields.io/badge/GitHub-amitjomy007-181717?style=flat-square&logo=github" />
  </a>

  <a href="https://www.linkedin.com/in/amitjomy/">
    <img src="https://img.shields.io/badge/LinkedIn-Amit%20Jomy-blue?style=flat-square&logo=linkedin" />
  </a>

  <a href="https://github.com/amitjomy007/Leetie/issues">
    <img src="https://img.shields.io/badge/Contributions-Welcome-success?style=flat-square" />
  </a>

  <a href="https://github.com/amitjomy007/Leetie/pulls">
    <img src="https://img.shields.io/badge/PRs-Welcome-success?style=flat-square" />
  </a>
</p>

---

## ✨ Why Leetie?

Most LeetCode trackers focus only on solving problems.

Leetie focuses on **interview intelligence**:

- company-wise interview trends
- frequency-based prioritization
- persistent preparation tracking
- fast filtering workflows
- developer-grade dashboard experience

Designed for serious interview preparation with a clean, premium desktop-first workflow.

---

## 🚀 Features

- Browse interview problems from company datasets
- Filter by:
  - 30 Days
  - 3 Months
  - 6 Months
  - More Than 6 Months
  - All Time
- Sort by:
  - Frequency
  - Acceptance Rate
  - Difficulty
  - Title
- Multi-company comparison mode
- Company autocomplete search
- Problem title search
- Difficulty filtering
- Mark problems as completed
- Completion date tracking
- Star important problems
- Persistent personal notes
- Timer + open LeetCode workflow
- Pause/reset timers
- Hide completed problems toggle
- Starred-only mode
- localStorage persistence across refreshes and browser restarts
- Graceful handling for empty CSV datasets
- Responsive desktop-first UI
- Modular architecture for scalability

---

## 🖼️ Preview

### Dashboard

![Dashboard](./public/screenshots/dashboard.png)

### Filters & Search

![Filters](./public/screenshots/filters.png)

### Problem Workspace

![Workspace](./public/screenshots/workspace.png)

---

## 🌐 Live Demo

Coming soon via Vercel deployment.

---

## ⚡ Quick Start

### Clone the repository

```bash
git clone https://github.com/amitjomy007/Leetie.git
cd Leetie
```

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## 📦 Production Build

```bash
npm run build
npm start
```

---

## 🏗️ Project Structure

```txt
app/
  api/
    companies/route.js
    problems/[company]/

  layout.js
  page.js
  globals.css

components/
  layout/
    Navbar.js

  problems/
    CompanySelector.js
    FilterBar.js
    ProblemList.js
    ProblemRow.js
    ProblemTimer.js
    NoteEditor.js
    StatsBar.js

lib/
  csv.js
  filters.js
  storage.js
```

---

## 🧠 Architecture Highlights

### Composable Filtering Pipeline

Filtering logic is intentionally modular.

Adding new filters requires:

- one filter condition
- one UI control

without rewriting the entire pipeline.

---

### Persistent State Management

localStorage powers:

- completed problems
- starred problems
- notes
- timers
- completion history

Everything survives:

- refreshes
- browser restarts
- navigation

---

### Optimized Rendering

- memoized problem rows
- cached company datasets
- minimized rerenders
- efficient filtering/sorting

Designed for large datasets and fast interaction.

---

### No Hardcoded Data

Leetie dynamically discovers:

- companies
- ranges
- datasets

directly from the dataset structure.

No fake or placeholder data is used.

---

## 🙌 Credits

Leetie is built on top of the amazing:

**interview-company-wise-problems**

dataset maintained by:

https://github.com/liquidslr

Huge thanks to the creator and contributors for maintaining one of the most useful open-source interview preparation datasets available.

Dataset repository:

https://github.com/liquidslr/interview-company-wise-problems

---

## 📄 Dataset / CSV Structure

If you'd like to extend the dataset with additional companies or newer interview data, CSV files should follow the existing structure.

Example:

```csv
Difficulty,Title,Frequency,Acceptance Rate,Link,Topics
MEDIUM,Two Sum,100.0,0.52,https://leetcode.com/problems/two-sum,"Array, Hash Table"
```

Expected directory structure:

```txt
brain/
  Google/
    1. Thirty Days.csv
    2. Three Months.csv
    3. Six Months.csv
    4. More Than Six Months.csv
    5. All.csv

  Amazon/
    ...

  Adobe/
    ...
```

Leetie gracefully handles:

- empty CSVs
- malformed rows
- missing values
- inconsistent datasets

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Possible contribution areas:

- new filters
- new sorting modes
- performance optimization
- accessibility improvements
- mobile polish
- export/import support
- analytics views
- UI improvements
- dataset tooling

### Contribution Workflow

1. Fork the repository

2. Create your feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push to the branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

Please:

- keep the project JavaScript-only
- follow existing architecture patterns
- avoid unnecessary dependencies
- keep components modular

---

## 🛣️ Roadmap

- [x] Company-wise filtering
- [x] Persistent progress tracking
- [x] Notes system
- [x] Timer workflow
- [ ] Topic-based filtering
- [ ] Heatmap analytics
- [ ] Contest integration
- [ ] Study plan mode
- [ ] PWA support
- [ ] Keyboard shortcuts
- [ ] Advanced statistics dashboard
- [ ] Google login & cloud sync
- [ ] User-based persistent storage
- [ ] Public deployment if the project receives good community response

---

## 👤 Author

**Amit Jomy**

<p>
  <a href="https://github.com/amitjomy007">
    <img src="https://img.shields.io/badge/GitHub-amitjomy007-181717?style=for-the-badge&logo=github" />
  </a>

  <a href="https://www.linkedin.com/in/amitjomy/">
    <img src="https://img.shields.io/badge/LinkedIn-Amit%20Jomy-blue?style=for-the-badge&logo=linkedin" />
  </a>
</p>

---

## ⭐ Show Your Support

If this project helped your interview preparation, consider giving it a star.

It helps:

- more people discover the project
- grow the open-source community
- motivate future development

---

## 📜 License

Copyright © 2026 Amit Jomy

This project is MIT licensed.
