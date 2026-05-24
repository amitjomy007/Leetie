# GrindMap

> Company-wise LeetCode problem tracker with frequency data, timers, notes, and progress tracking.

Built on top of the [interview-company-wise-problems](https://github.com/liquidslr/interview-company-wise-problems) dataset by [@liquidslr](https://github.com/liquidslr).

If this project helps your prep, please consider leaving a star. It helps others find it.

---

## Features

- Browse problems from 200+ companies indexed by interview frequency
- Filter by time range: 30 days, 3 months, 6 months, 6+ months, all time
- Sort by frequency, acceptance rate, difficulty, or title
- Multi-company toggle — compare what two or more companies share
- Search problems by name
- Difficulty filter (Easy / Medium / Hard)
- Mark problems as done — records completion date
- Star problems for quick reference
- Add personal notes per problem (stored in browser)
- Start timer + open LeetCode in one click — pause and reset supported
- Hide completed problems toggle
- Starred-only view
- All state persists across browser sessions via localStorage

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/grindmap.git
cd grindmap
npm install
```

### Add the brain data

The app reads company problem data from `public/brain/`. The structure mirrors the upstream repository:

```
public/
  brain/
    Adobe/
      1. Thirty Days.csv
      2. Three Months.csv
      3. Six Months.csv
      4. More Than Six Months.csv
      5. All.csv
    Google/
      1. Thirty Days.csv
      ...
    Amazon/
      ...
```

To get the full dataset, clone the upstream repo and copy the folders:

```bash
git clone https://github.com/liquidslr/interview-company-wise-problems.git
cp -r interview-company-wise-problems/* public/brain/
```

Each CSV has the following structure:

```
Difficulty,Title,Frequency,Acceptance Rate,Link,Topics
MEDIUM,Two Sum,100.0,0.52,https://leetcode.com/problems/two-sum,"Array, Hash Table"
```

Empty CSVs (header-only) are handled gracefully — the UI will show "No problems found for this time range."

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

---

## Project Structure

```
app/
  api/
    companies/route.js     # Lists all company folders from public/brain
    problems/[company]/    # Serves CSV content for a given company + range
  layout.js
  page.js                  # Server component — fetches company list at build time
  globals.css

components/
  layout/
    Navbar.js
  problems/
    CompanySelector.js     # Multi-company autocomplete picker
    FilterBar.js           # Range / difficulty / sort controls
    ProblemList.js         # Main container — data fetching, filtering pipeline
    ProblemRow.js          # Single row — memoized
    ProblemTimer.js        # Per-problem timer with LeetCode redirect
    NoteEditor.js          # Inline note panel
    StatsBar.js            # Completion progress bar

lib/
  csv.js                   # CSV parsing (PapaParse) + DATE_RANGES config
  filters.js               # Composable filter/sort pipeline
  storage.js               # localStorage hook + all problem state actions
```

---

## Contributing

Contributions are welcome. Here are some good first areas:

- **New filter types** — add to `lib/filters.js` and wire into `FilterBar.js`
- **New sort options** — extend `SORT_OPTIONS` in `lib/filters.js`
- **Export feature** — export filtered problems as CSV or JSON
- **Study plan mode** — curated problem sets by topic or company tier
- **Mobile layout** — the current design is desktop-first
- **Dark/light toggle** — CSS variables are already set up for theming

To contribute:

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Open a pull request with a clear description

Please keep the codebase in JavaScript (no TypeScript migration at this time), follow the existing component structure, and avoid adding unnecessary dependencies.

---

## Data Source

Problem data is sourced from [liquidslr/interview-company-wise-problems](https://github.com/liquidslr/interview-company-wise-problems). This project does not redistribute the data directly — you bring your own copy of the `brain/` folder.

---

## License

MIT
