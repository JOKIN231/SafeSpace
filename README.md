# AMEU SafeSpace

> **"Your Voice. Your Safety. Your Digital Space."**  
> *AMEU Cyberbullying Reporting and Peer Support System*

AMEU SafeSpace is a digital cyberbullying reporting and peer-support platform developed as part of the **AMEU Cyberbullying Awareness Initiative**, implemented by **Career Launchpad Liberia** in partnership with the **Ministry of Justice of the Republic of Liberia** and the **Federation of Liberian Youth (FLY)**.

---

## 🛡️ Key Features

- **Confidential & Anonymous Student Reporting:** Students can submit reports without providing a name, student ID, or personal identifiers.
- **5-Step Mobile-First Reporting Wizard:**
  - *Step 1:* Affected party selection (*Me*, *A friend or another student*, *I'm not sure*).
  - *Step 2:* Incident categories (multi-select + custom description).
  - *Step 3:* Platform and optional incident date.
  - *Step 4:* Narrative description with character limit and guidance that file uploads are omitted to protect media privacy.
  - *Step 5:* Immediate danger advisory and voluntary counselor contact with explicit unchecked consent.
- **Clean Reporting Service Interface (`src/services/reportingService.ts`):** Clear boundary isolating submission logic, validation, duplicate submission protection, and transparent labeling between live Supabase and development mock mode.
- **Unique Unpredictable Reference Receipt:** Generates cryptographic, collision-checked codes (e.g., `SS-7K4M-92PX`) with clear receipt disclaimers (not an authentication credential).
- **Optional Counselor Contact:** Students can voluntarily request peer counseling check-ins. Contact numbers are stored in an isolated, encrypted table requiring explicit authorization and audit logging.
- **Discreet Authorized Access:** Accessible via `/internal-access` for approved peer counselors and administrators.
- **Case Management Dashboard:** Real-time metrics, status workflows (`New`, `Under Review`, `Support Requested`, `Referred`, `Closed`), internal notes, and referral logs.
- **Authorized Excel (.xlsx) Exports:** Generates confidential reports using SheetJS with built-in formula injection neutralization and privacy filters.
- **Progressive Web App (PWA):** Installable on Android, Windows, and iOS with privacy-conscious service worker caching.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Lucide Icons
- **Backend & Database:** Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)
- **Spreadsheet Generation:** SheetJS (`xlsx`) with formula injection neutralization
- **Deployment Targets:** Cloudflare Pages (Frontend SPA), Supabase (PostgreSQL & Auth)

---

## 🗄️ Database Schema & Security (Supabase)

The database schema is defined in `supabase/migrations/20261013000000_init_ameu_safespace.sql`.

### Tables

1. **`reports`**
   - Core incident reports.
   - Public INSERT is permitted for anonymous reporting.
   - Public SELECT is **strictly denied**; only authenticated active counselors can view reports.
2. **`report_contacts`**
   - Stores phone numbers and explicit consent for students requesting contact.
   - Isolated from general reports to minimize disclosure risk.
   - Accessible only by authorized counselors with immutable audit logging.
3. **`counselor_profiles`**
   - Role-based access control (`peer_counselor`, `supervising_counselor`, `administrator`).
4. **`case_activity`**
   - Append-only audit trail recording status changes, notes, referrals, contact reveals, and Excel exports.
   - UPDATE and DELETE permissions are completely revoked to prevent audit tampering.

---

## 🚀 Setup & Local Development

### 1. Prerequisites
- Node.js 18+
- npm or bun

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file based on `.env.example`:
```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"
```
*Note: If no Supabase credentials are provided, AMEU SafeSpace seamlessly runs in a local storage mode with pre-seeded baseline test reports.*

### 4. Run Development Server
```bash
npm run dev
```

---

## ☁️ Deployment Instructions

### A. Supabase Database Provisioning
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Copy the contents of `supabase/migrations/20261013000000_init_ameu_safespace.sql` and run it.
4. To provision the first administrator or counselor:
   - Create a user in **Authentication -> Users** (e.g. `counselor@ame.edu.lr`).
   - Run the following SQL snippet to link their profile:
   ```sql
   INSERT INTO public.counselor_profiles (id, email, display_name, role, active)
   VALUES ('<AUTH-USER-UUID>', 'counselor@ame.edu.lr', 'Jane Doe', 'peer_counselor', true);
   ```

### B. Cloudflare Pages Deployment
1. Connect your repository to **Cloudflare Pages**.
2. Set Build Command: `npm run build`
3. Set Build Output Directory: `dist`
4. In Environment Variables, configure:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
5. Deploy!

---

## 📋 20-Point Security & Testing Checklist

- [x] 1. A student can submit a report without providing a name.
- [x] 2. A student can report an incident affecting a friend or another student.
- [x] 3. A student can request contact without being forced to provide phone contact info.
- [x] 4. Contact consent checkbox is explicit and unchecked by default.
- [x] 5. A unique, unpredictable reference code (e.g., `SS-7K4M-92PX`) is generated upon submission.
- [x] 6. Failed submissions are caught with clear error feedback and not falsely reported as successful.
- [x] 7. Public visitors cannot read reports (no public SELECT policy on `reports`).
- [x] 8. Public visitors cannot access counselor dashboards without authentication.
- [x] 9. Users cannot self-assign privileged administrator roles.
- [x] 10. Counselors can only perform authorized case management operations.
- [x] 11. Student contact information is restricted and stored in an isolated table.
- [x] 12. Excel export requires counselor authorization.
- [x] 13. Excel exports respect active filters (status, category, date range).
- [x] 14. Export events are recorded in the audit trail.
- [x] 15. Spreadsheet exports neutralize CSV/formula injection (`=`, `+`, `-`, `@`).
- [x] 16. Sensitive report records and counselor API calls are NOT cached by the service worker.
- [x] 17. The interface is responsive and tested for mobile Safari and Android Chrome.
- [x] 18. No secret service-role keys are exposed in the client-side bundle.
- [x] 19. No real student data is included in test fixtures.
- [x] 20. The project builds cleanly with zero TypeScript errors for production.

---

## 🏛️ Initiative Partners
- **Career Launchpad Liberia**
- **Ministry of Justice, Republic of Liberia**
- **Federation of Liberian Youth (FLY)**
- **African Methodist Episcopal University (AMEU)**
