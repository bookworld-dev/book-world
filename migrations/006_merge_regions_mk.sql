BEGIN;

CREATE TEMP TABLE region_merge (old_code TEXT NOT NULL, new_code TEXT NOT NULL, new_name TEXT NOT NULL) ON COMMIT DROP;

INSERT INTO region_merge (old_code, new_code, new_name) VALUES
  ('MK-01', 'MK-SK', 'Skopje Region'),
  ('MK-02', 'MK-SK', 'Skopje Region'),
  ('MK-03', 'MK-EA', 'Eastern Region'),
  ('MK-04', 'MK-PE', 'Pelagonia Region'),
  ('MK-05', 'MK-SE', 'Southeastern Region'),
  ('MK-06', 'MK-PO', 'Polog Region'),
  ('MK-07', 'MK-SE', 'Southeastern Region'),
  ('MK-08', 'MK-PO', 'Polog Region'),
  ('MK-09', 'MK-SK', 'Skopje Region'),
  ('MK-10', 'MK-SE', 'Southeastern Region'),
  ('MK-11', 'MK-SE', 'Southeastern Region'),
  ('MK-12', 'MK-SW', 'Southwestern Region'),
  ('MK-13', 'MK-VA', 'Vardar Region'),
  ('MK-14', 'MK-EA', 'Eastern Region'),
  ('MK-15', 'MK-SW', 'Southwestern Region'),
  ('MK-16', 'MK-PO', 'Polog Region'),
  ('MK-17', 'MK-SK', 'Skopje Region'),
  ('MK-18', 'MK-SE', 'Southeastern Region'),
  ('MK-19', 'MK-PO', 'Polog Region'),
  ('MK-20', 'MK-VA', 'Vardar Region'),
  ('MK-21', 'MK-SW', 'Southwestern Region'),
  ('MK-22', 'MK-SW', 'Southwestern Region'),
  ('MK-23', 'MK-EA', 'Eastern Region'),
  ('MK-24', 'MK-VA', 'Vardar Region'),
  ('MK-25', 'MK-PE', 'Pelagonia Region'),
  ('MK-26', 'MK-SE', 'Southeastern Region'),
  ('MK-27', 'MK-PE', 'Pelagonia Region'),
  ('MK-28', 'MK-SW', 'Southwestern Region'),
  ('MK-29', 'MK-SK', 'Skopje Region'),
  ('MK-30', 'MK-PO', 'Polog Region'),
  ('MK-31', 'MK-SW', 'Southwestern Region'),
  ('MK-32', 'MK-SK', 'Skopje Region'),
  ('MK-33', 'MK-EA', 'Eastern Region'),
  ('MK-34', 'MK-SK', 'Skopje Region'),
  ('MK-35', 'MK-PO', 'Polog Region'),
  ('MK-36', 'MK-VA', 'Vardar Region'),
  ('MK-37', 'MK-EA', 'Eastern Region'),
  ('MK-38', 'MK-SK', 'Skopje Region'),
  ('MK-39', 'MK-SK', 'Skopje Region'),
  ('MK-40', 'MK-SW', 'Southwestern Region'),
  ('MK-41', 'MK-SE', 'Southeastern Region'),
  ('MK-42', 'MK-EA', 'Eastern Region'),
  ('MK-43', 'MK-NE', 'Northeastern Region'),
  ('MK-44', 'MK-NE', 'Northeastern Region'),
  ('MK-45', 'MK-PE', 'Pelagonia Region'),
  ('MK-46', 'MK-PE', 'Pelagonia Region'),
  ('MK-47', 'MK-NE', 'Northeastern Region'),
  ('MK-48', 'MK-NE', 'Northeastern Region'),
  ('MK-49', 'MK-VA', 'Vardar Region'),
  ('MK-50', 'MK-PO', 'Polog Region'),
  ('MK-51', 'MK-EA', 'Eastern Region'),
  ('MK-52', 'MK-SW', 'Southwestern Region'),
  ('MK-53', 'MK-PE', 'Pelagonia Region'),
  ('MK-54', 'MK-VA', 'Vardar Region'),
  ('MK-55', 'MK-PE', 'Pelagonia Region'),
  ('MK-56', 'MK-SE', 'Southeastern Region'),
  ('MK-57', 'MK-SW', 'Southwestern Region'),
  ('MK-58', 'MK-SW', 'Southwestern Region'),
  ('MK-60', 'MK-EA', 'Eastern Region'),
  ('MK-61', 'MK-SW', 'Southwestern Region'),
  ('MK-62', 'MK-PE', 'Pelagonia Region'),
  ('MK-63', 'MK-EA', 'Eastern Region'),
  ('MK-64', 'MK-SE', 'Southeastern Region'),
  ('MK-65', 'MK-NE', 'Northeastern Region'),
  ('MK-66', 'MK-PE', 'Pelagonia Region'),
  ('MK-67', 'MK-VA', 'Vardar Region'),
  ('MK-68', 'MK-SK', 'Skopje Region'),
  ('MK-69', 'MK-VA', 'Vardar Region'),
  ('MK-70', 'MK-SK', 'Skopje Region'),
  ('MK-71', 'MK-NE', 'Northeastern Region'),
  ('MK-72', 'MK-SW', 'Southwestern Region'),
  ('MK-73', 'MK-SE', 'Southeastern Region'),
  ('MK-74', 'MK-SK', 'Skopje Region'),
  ('MK-75', 'MK-PO', 'Polog Region'),
  ('MK-76', 'MK-PO', 'Polog Region'),
  ('MK-77', 'MK-SK', 'Skopje Region'),
  ('MK-78', 'MK-SW', 'Southwestern Region'),
  ('MK-79', 'MK-SK', 'Skopje Region'),
  ('MK-80', 'MK-VA', 'Vardar Region'),
  ('MK-81', 'MK-EA', 'Eastern Region'),
  ('MK-82', 'MK-SK', 'Skopje Region'),
  ('MK-83', 'MK-EA', 'Eastern Region'),
  ('MK-84', 'MK-SK', 'Skopje Region'),
  ('MK-85', 'MK-SK', 'Skopje Region');

INSERT INTO locations (level, code, name, parent_id)
SELECT DISTINCT 'state', m.new_code, m.new_name, c.id
FROM region_merge m
JOIN locations c ON c.level = 'country' AND c.code = split_part(m.new_code, '-', 1)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO book_locations (book_id, location_id)
SELECT DISTINCT bl.book_id, r.id
FROM region_merge m
JOIN locations old ON old.code = m.old_code
JOIN book_locations bl ON bl.location_id = old.id
JOIN locations r ON r.code = m.new_code
WHERE m.old_code <> m.new_code
ON CONFLICT DO NOTHING;

DELETE FROM locations
WHERE code IN (SELECT old_code FROM region_merge WHERE old_code <> new_code);

COMMIT;
