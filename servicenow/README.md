# ServiceNow PDI - Field Change Trace UI Macro Agent

This package provides a baseline implementation for your requirement:
- Show a per-field indicator on forms when a value was changed.
- Display *which script/flow/configuration* changed that value.
- Provide a deep link to the source artifact.
- Support both classic/native UI and workspace.

## Implementation flow

1. **Set source context in automation**
   - Before scripts/flows update records, call `FieldChangeTraceAPI.setSourceContext(...)`.
   - This captures metadata about where the change originated.

2. **Capture changed fields on update**
   - Business Rule `FieldChangeTraceCapture.br.js` records every changed field into `x_classic_field_change_trace`.

3. **Render metadata in UI**
   - Native UI client script `FieldChangeTraceInjector.js` decorates each changed field with an icon.
   - Clicking icon opens the source URL.
   - Workspace helper `FieldChangeTraceWorkspaceClient.js` exposes the same data for UI Builder components.

## Example usage in a Business Rule / Script Include

```javascript
var tracer = new FieldChangeTraceAPI();
tracer.setSourceContext(
    'business_rule',
    current.sys_id + '',
    'sys_script',
    'BR: Auto-prioritize incidents',
    gs.getProperty('glide.servlet.uri') + 'sys_script.do?sys_id=' + current.sys_id,
    'BR: Auto-prioritize incidents > set priority'
);

// mutate target record fields here

tracer.clearSourceContext();
```

## Flow Designer guidance

In Script step/action before update:

```javascript
var tracer = new global.FieldChangeTraceAPI();
tracer.setSourceContext(
    'flow',
    flow_sys_id,
    'sys_hub_flow',
    flow_name,
    gs.getProperty('glide.servlet.uri') + 'sys_hub_flow.do?sys_id=' + flow_sys_id,
    flow_name + ' > ' + action_name
);
```

## Workspace

- Use a custom UI Builder field-prefix component.
- Call `window.FieldChangeTraceWorkspaceClient.getTraceMap(table, sys_id, callback)`.
- Render an icon + popover with `source_name`, `flow_path`, `changed_on`, and open `source_url`.


## Source Control import in PDI

If ServiceNow shows **"Repository does not contain an Application file to import"**, keep these files at the repository root:
- `sys_app_6f8f6fd3db3e2010c8d4f5d51d9619b1.xml`
- `sn_source_control.properties`
- `sys_scope_6f8f6fd3db3e2010c8d4f5d51d9619b1.xml` (recommended for complete scope metadata)

These identify the scoped application during **Studio > Import From Source Control**.

## Notes

- Out-of-box ServiceNow cannot always infer the precise automation source after the fact.
- This design guarantees precision by explicitly setting trace context in each automation path.
- For full coverage, update all scripts/flows/integrations that mutate form fields.
