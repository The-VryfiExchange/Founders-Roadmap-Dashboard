-- ============================================================
-- Founder Dashboard — Seed data
-- Run this AFTER your first magic-link login so auth.uid() exists.
-- Replace 'YOUR-USER-UUID' with your user ID from auth.users table.
-- Or just run as-is in SQL Editor while you're logged in — auth.uid() will resolve.
-- ============================================================

-- KPIs
insert into public.kpis (user_id, category, metric, q1, q2, q3, q4, actual, sort_order) values
  (auth.uid(), 'Sales', 'Cumulative signed PM logos', '2', '5', '8', '10-12', '0', 1),
  (auth.uid(), 'Sales', 'Active discovery cycles', '10', '20', '30', '40+', '0', 2),
  (auth.uid(), 'Sales', 'Economic Buyer convos / week', '3-5', '5-8', '8-12', '10-15', '0', 3),
  (auth.uid(), 'Sales', 'Pipeline coverage (4x rule)', '4x', '4x', '4x', '4x', '—', 4),
  (auth.uid(), 'Revenue', 'MRR (end of qtr)', '$15-30K', '$60-90K', '$120-180K', '$150-300K', '$0', 5),
  (auth.uid(), 'Revenue', 'ACV per signed logo', '$180K', '$220K', '$240K', '$260K', '—', 6),
  (auth.uid(), 'Marketplace', 'Verified renters on platform', '1,500', '8,000', '20,000', '40,000', '0', 7),
  (auth.uid(), 'Marketplace', 'Verified matches / week', '25', '200', '800', '1,500', '0', 8),
  (auth.uid(), 'Marketplace', 'Active PM listings live', '500', '3,000', '8,000', '15,000', '0', 9),
  (auth.uid(), 'Product', 'PMS integrations live', '1', '2', '3', '3+', '0', 10),
  (auth.uid(), 'Marketing', 'NOI Calculator runs by prospects', '10', '40', '80', '120', '0', 11),
  (auth.uid(), 'Marketing', 'LinkedIn posts published / week', '2', '3', '3', '3', '0', 12),
  (auth.uid(), 'Hiring', 'Team size', '3-4', '5-7', '7-9', '8-10', '3', 13),
  (auth.uid(), 'Capital', 'Cash runway (months)', '18+', '15+', '12+', '20+ (post-raise)', '—', 14),
  (auth.uid(), 'Capital', 'Investor conversations active', '0', '5', '15', 'Termsheet', '0', 15);

-- Milestones (Q1)
insert into public.milestones (user_id, quarter, month, title, category, done, sort_order) values
  (auth.uid(), 'Q1', 'May 2026', 'Priority 10 PM target list locked', 'Sales', false, 1),
  (auth.uid(), 'Q1', 'May 2026', 'Bridge round decision made (yes/no, size)', 'Capital', false, 2),
  (auth.uid(), 'Q1', 'May 2026', 'Founder dashboard live, Monday cadence started', 'Ops', true, 3),
  (auth.uid(), 'Q1', 'May 2026', 'Head of Sales req opened', 'Hiring', false, 4),
  (auth.uid(), 'Q1', 'May 2026', 'NOI Calculator assumptions sourced (NMHC, NAA, TransUnion)', 'GTM', false, 5),
  (auth.uid(), 'Q1', 'Jun 2026', 'Beta v1 ships — Homey full version with Vibes + roommate matching', 'Product', false, 6),
  (auth.uid(), 'Q1', 'Jun 2026', 'First signed PM logo / pilot agreement', 'Sales', false, 7),
  (auth.uid(), 'Q1', 'Jun 2026', 'Head of Sales onboarded', 'Hiring', false, 8),
  (auth.uid(), 'Q1', 'Jun 2026', 'Yardi PMS connector live for first paid pilot', 'Product', false, 9),
  (auth.uid(), 'Q1', 'Jul 2026', 'Second signed PM logo (cumulative: 2)', 'Sales', false, 10),
  (auth.uid(), 'Q1', 'Jul 2026', 'AE running pipeline independently', 'Sales', false, 11),
  (auth.uid(), 'Q1', 'Jul 2026', 'SOC 2 Type 1 audit kickoff', 'Ops', false, 12);

-- Milestones (Q2)
insert into public.milestones (user_id, quarter, month, title, category, done, sort_order) values
  (auth.uid(), 'Q2', 'Aug 2026', '3rd signed logo (cumulative: 3)', 'Sales', false, 13),
  (auth.uid(), 'Q2', 'Aug 2026', 'Senior Engineer #1 onboarded', 'Hiring', false, 14),
  (auth.uid(), 'Q2', 'Sep 2026', '4th signed logo + first owner-operator pilot active', 'Sales', false, 15),
  (auth.uid(), 'Q2', 'Sep 2026', 'AE #2 onboarded', 'Hiring', false, 16),
  (auth.uid(), 'Q2', 'Oct 2026', '5th signed logo (cumulative: 5)', 'Sales', false, 17),
  (auth.uid(), 'Q2', 'Oct 2026', 'NMHC OPTECH executed — 20+ booked meetings as output', 'GTM', false, 18),
  (auth.uid(), 'Q2', 'Oct 2026', 'Customer Success Lead onboarded', 'Hiring', false, 19),
  (auth.uid(), 'Q2', 'Oct 2026', 'SOC 2 Type 1 complete', 'Ops', false, 20);

-- Milestones (Q3)
insert into public.milestones (user_id, quarter, month, title, category, done, sort_order) values
  (auth.uid(), 'Q3', 'Nov 2026', '6th signed logo + 15+ investor conversations active', 'Sales', false, 21),
  (auth.uid(), 'Q3', 'Nov 2026', 'Senior Engineer #2 onboarded', 'Hiring', false, 22),
  (auth.uid(), 'Q3', 'Dec 2026', '7th signed logo + pitch deck v1 + data room shareable', 'Sales', false, 23),
  (auth.uid(), 'Q3', 'Jan 2027', '8th signed logo + first termsheet received', 'Capital', false, 24),
  (auth.uid(), 'Q3', 'Jan 2027', 'NMHC Annual Meeting executed', 'GTM', false, 25);

-- Milestones (Q4)
insert into public.milestones (user_id, quarter, month, title, category, done, sort_order) values
  (auth.uid(), 'Q4', 'Feb 2027', '9th signed logo + termsheet signed with lead', 'Capital', false, 26),
  (auth.uid(), 'Q4', 'Feb 2027', 'Diligence in motion', 'Capital', false, 27),
  (auth.uid(), 'Q4', 'Mar 2027', '10th signed logo + seed round closed', 'Capital', false, 28),
  (auth.uid(), 'Q4', 'Mar 2027', 'Growth/Marketing Lead onboarded (post-raise)', 'Hiring', false, 29),
  (auth.uid(), 'Q4', 'Apr 2027', '10-12 cumulative logos + Year 2 operating plan locked', 'Sales', false, 30);

-- Pipeline (Priority 10 PM targets)
insert into public.pipeline (user_id, name, units, ceo, city, stage, warm_intro, next_action, sort_order) values
  (auth.uid(), 'RangeWater Real Estate', 72838, 'Steven Shores', 'Atlanta, GA', 'Not started', false, 'Identify warm intro path', 1),
  (auth.uid(), 'RAM Partners LLC', 85072, 'Bill Leseman', 'Atlanta, GA', 'Not started', false, 'LinkedIn DM to CEO', 2),
  (auth.uid(), 'Cortland', 81979, 'Steven DeFrancis', 'Atlanta, GA', 'Not started', false, 'Identify warm intro path', 3),
  (auth.uid(), 'RPM Living', 241479, 'Jason Berkowitz', 'Austin, TX', 'Not started', false, 'ATX HQ — perfect geo match', 4),
  (auth.uid(), 'Hawthorne Residential', 59078, 'Samantha Davenport', 'Greensboro, NC', 'Not started', false, 'Cold outreach — #1 ORA score', 5),
  (auth.uid(), 'GID / Windsor', 49486, 'Gregory Bates', 'Atlanta, GA', 'Not started', false, 'Identify warm intro path', 6),
  (auth.uid(), 'Pegasus Residential', 50000, 'Jackie Ware', 'Alpharetta, GA', 'Not started', false, 'LinkedIn DM to CEO', 7),
  (auth.uid(), 'Drucker + Falk', 42016, 'Wendy Drucker', 'Newport News, VA', 'Not started', false, 'Research NJ exposure', 8),
  (auth.uid(), 'GoldOller', 45343, 'Jake Hollinger', 'Philadelphia, PA', 'Not started', false, 'NJ/NYC adjacent — warm intro', 9),
  (auth.uid(), 'Bozzuto', 133117, 'Toby Bozzuto', 'Greenbelt, MD', 'Not started', false, 'NYC/NJ presence — long cycle', 10);

-- Hires
insert into public.hires (user_id, role, start_month, status, sort_order) values
  (auth.uid(), 'Senior Tech Collaborator (Homey)', 'May 2026', 'Sourcing', 1),
  (auth.uid(), 'Head of Sales / first AE', 'May–Jun 2026', 'Not started', 2),
  (auth.uid(), 'SDR', 'Jul 2026', 'Not started', 3),
  (auth.uid(), 'AE #2', 'Sep 2026', 'Not started', 4),
  (auth.uid(), 'Senior Engineer #1', 'Aug 2026', 'Not started', 5),
  (auth.uid(), 'Customer Success / Ops Lead', 'Oct 2026', 'Not started', 6),
  (auth.uid(), 'Senior Engineer #2', 'Nov 2026', 'Not started', 7),
  (auth.uid(), 'Growth / Marketing Lead', 'Mar 2027 (post-raise)', 'Not started', 8);
