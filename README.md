# Smart College Event Manager — V3

A free-first React/Vite web application for managing a college innovation/hackathon workflow.

## V3 workflow
1. Kickoff attendance
2. Student master data / CSV import
3. Team registration — 4 to 6 members
4. Problem statement selection
5. Idea submission
6. Top 50 selection
7. Project build tracking
8. Final submission

## Run locally
```bash
npm install
npm run dev
```

## Build for deployment
```bash
npm run build
```

The current version stores data in browser localStorage so it can be tested immediately.
The next V3 phase can replace localStorage with a free cloud database and add admin/student login.

## CSV import
Students page accepts:
`name,roll,branch,year,kickoff,team`

Example:
```csv
name,roll,branch,year,kickoff,team
Ravi Kumar,23Y1A0501,CSE,III,true,
Priya,23Y1A0502,AIML,III,true,
```
