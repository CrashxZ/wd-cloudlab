# WD CloudLab

**The cloud for physical experimentation.**

WD CloudLab is a polished hackathon prototype marketplace for monetizing unused laboratory capacity. Customers can discover services and submit experiments; employees can operate the lab and publish new services; administrators can inspect and export the complete prototype state.

The application uses Next.js App Router, TypeScript, Tailwind CSS, Recharts, Lucide icons, and a typed browser `localStorage` layer. It has no backend, secrets, database, or required environment variables.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Customer | `customer@cloudlab.demo` | `demo123` |
| Employee | `employee@cloudlab.demo` | `demo123` |
| Administrator | `admin@cloudlab.demo` | `demo123` |

The sign-in screen also provides one-click access for every role.

## Run entirely online

This project is intended to be installed, tested, and deployed in an isolated online environment. The end user does not need Node.js, Git, Docker, VS Code, or any other local software.

1. Push or import this repository into GitHub.
2. On the repository page, choose **Code → Codespaces → Create codespace on main**.
3. In the Codespaces terminal, run `npm install` and `npm run dev`.
4. Open the forwarded port shown by Codespaces to test the app in the browser.
5. Before committing, run `npm run typecheck`, `npm run lint`, and `npm run build` inside Codespaces.
6. Commit and push from the Codespaces Source Control panel or terminal.
7. In [Vercel](https://vercel.com/new), import the GitHub repository. Keep the detected Next.js settings and leave environment variables empty.
8. Deploy, open the production URL, and test each demo role.

StackBlitz, CodeSandbox, Replit, or another cloud container can be used instead of Codespaces.

## Suggested live demo

1. Sign in as the customer and browse AFM or XRR services.
2. Inspect week/month equipment availability.
3. Submit the eight-step request wizard.
4. Open a second tab, sign in as an employee, claim the incoming request, and add a note.
5. Return to the customer tab and watch the one-minute timeline unlock a technique-specific result.
6. Download CSV/JSON or print the report.
7. Open the administrator dashboard to show revenue, utilization, export, and reset controls.
8. As the employee, publish a new service and see it appear immediately in the customer catalog.

## Prototype data behavior

- All persisted keys begin with `wd-cloudlab-`.
- State is seeded on first load and validated with a schema version.
- Corrupted or incompatible data is safely replaced with seed data.
- The browser `storage` event synchronizes separate tabs on the same browser profile.
- Uploaded file contents are never stored—only name, MIME type, size, and simulated status.
- Submitted requests generate and store results immediately, but results remain hidden until the timestamp-derived 60-second workflow completes.
- Data does **not** synchronize across devices or browsers.

## Production notes

The build is static-client friendly and needs no API routes. Browser-generated downloads and `localStorage` are accessed only in client components, preventing server-side storage access and hydration mismatches.
