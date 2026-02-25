# Table: x_classic_field_change_trace

Create a custom table with these columns:

- `target_table` (String 80)
- `target_sys_id` (String 32)
- `field_name` (String 80)
- `old_value` (String 4000)
- `new_value` (String 4000)
- `changed_by` (Reference -> sys_user)
- `changed_on` (Glide Date/Time)
- `source_type` (Choice: business_rule, flow, transform_map, script_include, fix_script, manual_or_unknown, other)
- `source_table` (String 80)
- `source_sys_id` (String 32)
- `source_name` (String 255)
- `source_url` (URL 1000)
- `flow_path` (String 1000)

Recommended indexes:
- `(target_table, target_sys_id, sys_created_on)`
- `(target_table, target_sys_id, field_name, sys_created_on)`
