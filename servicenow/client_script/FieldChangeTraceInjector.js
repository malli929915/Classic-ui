/**
 * Type: onLoad
 * UI Type: All
 * Global: true
 * Applies to: forms where you want per-field provenance indicator.
 */
function onLoad() {
    if (!window.g_form || g_form.isNewRecord())
        return;

    var ga = new GlideAjax('FieldChangeTraceAjax');
    ga.addParam('sysparm_name', 'getLatestByField');
    ga.addParam('sysparm_table', g_form.getTableName());
    ga.addParam('sysparm_sys_id', g_form.getUniqueValue());
    ga.getXMLAnswer(function(answer) {
        if (!answer)
            return;

        var details = JSON.parse(answer);
        Object.keys(details).forEach(function(fieldName) {
            if (!g_form.hasField(fieldName))
                return;

            var meta = details[fieldName];
            var label = g_form.getLabelOf(fieldName);
            var help = [
                'Last change source: ' + (meta.source_name || meta.source_type || 'Unknown'),
                'Flow/Path: ' + (meta.flow_path || 'n/a'),
                'Changed by: ' + (meta.changed_by || 'n/a'),
                'Changed on: ' + (meta.changed_on || 'n/a')
            ].join('\n');

            // Native UI: decoration icon in field label area.
            g_form.addDecoration(
                fieldName,
                'icon-script',
                label + ' - source trace',
                help,
                function() {
                    if (meta.source_url)
                        window.open(meta.source_url, '_blank');
                }
            );
        });
    });
}
