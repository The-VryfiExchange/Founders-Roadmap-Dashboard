-- ============================================================
-- Founder Dashboard — Seed data (single-user, no auth)
-- Run after schema.sql (or after the migration if you're upgrading).
-- ============================================================

-- KPIs
insert into public.kpis (category, metric, q1, q2, q3, q4, actual, sort_order) values
  ('Sales', 'Cumulative signed PM logos', '2', '5', '8', '10-12', '0', 1),
  ('Sales', 'Active discovery cycles', '10', '20', '30', '40+', '0', 2),
  ('Sales', 'Economic Buyer convos / week', '3-5', '5-8', '8-12', '10-15', '0', 3),
  ('Sales', 'Pipeline coverage (4x rule)', '4x', '4x', '4x', '4x', '—', 4),
  ('Revenue', 'MRR (end of qtr)', '$15-30K', '$60-90K', '$120-180K', '$150-300K', '$0', 5),
  ('Revenue', 'ACV per signed logo', '$180K', '$220K', '$240K', '$260K', '—', 6),
  ('Marketplace', 'Verified renters on platform', '1,500', '8,000', '20,000', '40,000', '0', 7),
  ('Marketplace', 'Verified matches / week', '25', '200', '800', '1,500', '0', 8),
  ('Marketplace', 'Active PM listings live', '500', '3,000', '8,000', '15,000', '0', 9),
  ('Product', 'PMS integrations live', '1', '2', '3', '3+', '0', 10),
  ('Marketing', 'NOI Calculator runs by prospects', '10', '40', '80', '120', '0', 11),
  ('Marketing', 'LinkedIn posts published / week', '2', '3', '3', '3', '0', 12),
  ('Hiring', 'Team size', '3-4', '5-7', '7-9', '8-10', '3', 13),
  ('Capital', 'Cash runway (months)', '18+', '15+', '12+', '20+ (post-raise)', '—', 14),
  ('Capital', 'Investor conversations active', '0', '5', '15', 'Termsheet', '0', 15);

-- Milestones (Q1)
insert into public.milestones (quarter, month, title, category, done, sort_order) values
  ('Q1', 'May 2026', 'Priority 10 PM target list locked', 'Sales', false, 1),
  ('Q1', 'May 2026', 'Bridge round decision made (yes/no, size)', 'Capital', false, 2),
  ('Q1', 'May 2026', 'Founder dashboard live, Monday cadence started', 'Ops', true, 3),
  ('Q1', 'May 2026', 'Head of Sales req opened', 'Hiring', false, 4),
  ('Q1', 'May 2026', 'NOI Calculator assumptions sourced (NMHC, NAA, TransUnion)', 'GTM', false, 5),
  ('Q1', 'Jun 2026', 'Beta v1 ships — Homey full version with Vibes + roommate matching', 'Product', false, 6),
  ('Q1', 'Jun 2026', 'First signed PM logo / pilot agreement', 'Sales', false, 7),
  ('Q1', 'Jun 2026', 'Head of Sales onboarded', 'Hiring', false, 8),
  ('Q1', 'Jun 2026', 'Yardi PMS connector live for first paid pilot', 'Product', false, 9),
  ('Q1', 'Jul 2026', 'Second signed PM logo (cumulative: 2)', 'Sales', false, 10),
  ('Q1', 'Jul 2026', 'AE running pipeline independently', 'Sales', false, 11),
  ('Q1', 'Jul 2026', 'SOC 2 Type 1 audit kickoff', 'Ops', false, 12);

-- Milestones (Q2)
insert into public.milestones (quarter, month, title, category, done, sort_order) values
  ('Q2', 'Aug 2026', '3rd signed logo (cumulative: 3)', 'Sales', false, 13),
  ('Q2', 'Aug 2026', 'Senior Engineer #1 onboarded', 'Hiring', false, 14),
  ('Q2', 'Sep 2026', '4th signed logo + first owner-operator pilot active', 'Sales', false, 15),
  ('Q2', 'Sep 2026', 'AE #2 onboarded', 'Hiring', false, 16),
  ('Q2', 'Oct 2026', '5th signed logo (cumulative: 5)', 'Sales', false, 17),
  ('Q2', 'Oct 2026', 'NMHC OPTECH executed — 20+ booked meetings as output', 'GTM', false, 18),
  ('Q2', 'Oct 2026', 'Customer Success Lead onboarded', 'Hiring', false, 19),
  ('Q2', 'Oct 2026', 'SOC 2 Type 1 complete', 'Ops', false, 20);

-- Milestones (Q3)
insert into public.milestones (quarter, month, title, category, done, sort_order) values
  ('Q3', 'Nov 2026', '6th signed logo + 15+ investor conversations active', 'Sales', false, 21),
  ('Q3', 'Nov 2026', 'Senior Engineer #2 onboarded', 'Hiring', false, 22),
  ('Q3', 'Dec 2026', '7th signed logo + pitch deck v1 + data room shareable', 'Sales', false, 23),
  ('Q3', 'Jan 2027', '8th signed logo + first termsheet received', 'Capital', false, 24),
  ('Q3', 'Jan 2027', 'NMHC Annual Meeting executed', 'GTM', false, 25);

-- Milestones (Q4)
insert into public.milestones (quarter, month, title, category, done, sort_order) values
  ('Q4', 'Feb 2027', '9th signed logo + termsheet signed with lead', 'Capital', false, 26),
  ('Q4', 'Feb 2027', 'Diligence in motion', 'Capital', false, 27),
  ('Q4', 'Mar 2027', '10th signed logo + seed round closed', 'Capital', false, 28),
  ('Q4', 'Mar 2027', 'Growth/Marketing Lead onboarded (post-raise)', 'Hiring', false, 29),
  ('Q4', 'Apr 2027', '10-12 cumulative logos + Year 2 operating plan locked', 'Sales', false, 30);

-- Pipeline (Priority 10 PM targets)
insert into public.pipeline (name, units, ceo, city, stage, warm_intro, next_action, sort_order) values
  ('RangeWater Real Estate', 72838, 'Steven Shores', 'Atlanta, GA', 'Not started', false, 'Identify warm intro path', 1),
  ('RAM Partners LLC', 85072, 'Bill Leseman', 'Atlanta, GA', 'Not started', false, 'LinkedIn DM to CEO', 2),
  ('Cortland', 81979, 'Steven DeFrancis', 'Atlanta, GA', 'Not started', false, 'Identify warm intro path', 3),
  ('RPM Living', 241479, 'Jason Berkowitz', 'Austin, TX', 'Not started', false, 'ATX HQ — perfect geo match', 4),
  ('Hawthorne Residential', 59078, 'Samantha Davenport', 'Greensboro, NC', 'Not started', false, 'Cold outreach — #1 ORA score', 5),
  ('GID / Windsor', 49486, 'Gregory Bates', 'Atlanta, GA', 'Not started', false, 'Identify warm intro path', 6),
  ('Pegasus Residential', 50000, 'Jackie Ware', 'Alpharetta, GA', 'Not started', false, 'LinkedIn DM to CEO', 7),
  ('Drucker + Falk', 42016, 'Wendy Drucker', 'Newport News, VA', 'Not started', false, 'Research NJ exposure', 8),
  ('GoldOller', 45343, 'Jake Hollinger', 'Philadelphia, PA', 'Not started', false, 'NJ/NYC adjacent — warm intro', 9),
  ('Bozzuto', 133117, 'Toby Bozzuto', 'Greenbelt, MD', 'Not started', false, 'NYC/NJ presence — long cycle', 10);

-- Hires
insert into public.hires (role, start_month, status, sort_order) values
  ('Senior Tech Collaborator (Homey)', 'May 2026', 'Sourcing', 1),
  ('Head of Sales / first AE', 'May–Jun 2026', 'Not started', 2),
  ('SDR', 'Jul 2026', 'Not started', 3),
  ('AE #2', 'Sep 2026', 'Not started', 4),
  ('Senior Engineer #1', 'Aug 2026', 'Not started', 5),
  ('Customer Success / Ops Lead', 'Oct 2026', 'Not started', 6),
  ('Senior Engineer #2', 'Nov 2026', 'Not started', 7),
  ('Growth / Marketing Lead', 'Mar 2027 (post-raise)', 'Not started', 8);
