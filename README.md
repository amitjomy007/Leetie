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
  <a href="https://github.com/amitjomy007/Leetie/pulls">
    <img src="https://img.shields.io/badge/PRs-Welcome-success?style=for-the-badge" />
  </a>
</p>

<br />

<p align="center">
  <img src="./public/logo.png" width="140" alt="Leetie Logo"/>
</p>

<h1 align="center">
  Leet<span style="color:#f0883e">ie</span>
</h1>

<p align="center">
  <b>An attempt to organize company wise problems for interview practice</b>
  <br />
  Track interview trends, filter by companies and frequency, your replacement for leetcode premium extension ? maybe!
</p>

<p align="center">
  If this project helps your interview prep, consider giving it a ⭐ — it helps more people discover it.
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
</p>

Disclaimer : Right now everything is saved to local storage since this is intended only for personal usage, you may fork it and extend it to connect with a cloud sync platform, that way you don't risk losing any saved data.

---

## ✨ Why Leetie?

Last time I did leetcode we had working extensions which organized the leetcode problems based on company and frequency for free, but now those extensions have been taken down.

So I just created this simple tool. I think this is better than the extension with my touch of 2 special features. A big thanks to [@liquidslr](https://github.com/liquidslr) for the problem sets and company data.

These are the 2 special features which I love the most,

- write notes for every problem, with hidden notes for writing hints
- time every problem before solving and it will be saved so you know your past time.

Yes just 2 features, but it makes the difference between hell and heaven for me.
But more than what is now, I hope to build and improve with more features if required.
(_read this ai description below if you would like to..._)
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
- Completion date tracking
- Star important problems
- Persistent personal notes with hidden section
- Timer + open LeetCode workflow
- Starred-only mode
- Tag reveal system (per-tag and global)
- Dark / light theme with no flash
- Graceful handling for empty CSV datasets
- Responsive desktop-first UI
- Modular architecture for scalability

---

## 🌐 Live Demo

leetie-tool.vercel.app

---

## ⚡ Quick Start Guide (just clone repo, npm i, npm run dev)

### 1. Clone the repository

```bash
git clone https://github.com/amitjomy007/Leetie.git
cd Leetie
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

Open: `http://localhost:3000`

---

## For Production Build

```bash
npm run build
npm start
```

---

## (For Developers) Project Structure

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
  companyLogos.js
  filters.js
  storage.js
```

---

## 🧠 Architecture Highlights (read if you have patience ;)

### Composable Filtering Pipeline

Filtering logic is intentionally modular. Adding new filters requires one filter condition and one UI control — nothing else changes.

### Persistent State Management

localStorage powers completed problems, starred problems, notes, timers, and completion history. Everything survives refreshes, browser restarts, and navigation.

### Optimized Rendering

- memoized problem rows
- module-level cached company datasets
- in-flight deduplication
- efficient filtering/sorting pipeline

Designed for large datasets (400+ companies, thousands of problems) and fast interaction.

### No Hardcoded Data

Leetie dynamically discovers companies, ranges, and datasets directly from the filesystem. No fake or placeholder data is used.

---

## Credits

Leetie is built on top of the amazing **interview-company-wise-problems** dataset maintained by [@liquidslr](https://github.com/liquidslr).

Huge thanks for maintaining one of the most useful open-source interview preparation datasets available.

Dataset repository: https://github.com/liquidslr/interview-company-wise-problems

---

## 📄 Dataset / CSV Structure (For developers)

```csv
Difficulty,Title,Frequency,Acceptance Rate,Link,Topics
MEDIUM,Two Sum,100.0,0.52,https://leetcode.com/problems/two-sum,"Array, Hash Table"
```

Leetie gracefully handles empty CSVs, malformed rows, missing values, and inconsistent datasets.

---

## Contributing Guide

Contributions, issues, and feature requests are welcome. Check the [issues page](https://github.com/amitjomy007/Leetie/issues).

Possible contribution areas:

- new filters or sorting modes
- performance optimization (highly welcome)
- accessibility improvements
- mobile polish
- export/import support
- analytics views (highly welcome)
- UI improvements
- dataset tooling

### Contribution Workflow

```bash
# Fork, then:
git checkout -b feature/amazing-feature
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
# Open a Pull Request
```

Please keep the project JavaScript-only, follow existing architecture patterns, and avoid unnecessary dependencies.

---

## 🛣️ Roadmap

- [x] Company-wise filtering
- [x] Persistent progress tracking
- [x] Notes system with hidden section
- [x] Timer workflow
- [x] Tag reveal system
- [x] Dark / light theme
- [ ] Topic-based filtering
- [ ] Heatmap analytics
- [ ] Study plan mode
- [ ] PWA support
- [ ] Keyboard shortcuts
- [ ] Advanced statistics dashboard
- [ ] Google login & cloud sync
- [x] Public deployment

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

If you liked this project, please [give it a star](https://github.com/amitjomy007/Leetie/stargazers).

It helps more people discover the project, grows the open-source community, and motivates future development.

---

## 📜 License

Copyright © 2026 Amit Jomy. MIT licensed.
