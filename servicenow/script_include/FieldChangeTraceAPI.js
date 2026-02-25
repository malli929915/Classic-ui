var FieldChangeTraceAPI = Class.create();
FieldChangeTraceAPI.prototype = {
    initialize: function() {
        this.TABLE = 'x_classic_field_change_trace';
    },

    /**
     * Call this helper before changing values from business rules, script actions,
     * flow actions, transform maps, etc.
     *
     * @param {String} sourceType - business_rule | flow | transform_map | script_include | fix_script | other
     * @param {String} sourceSysId - sys_id of the source record.
     * @param {String} sourceTable - sys_db_object name where sourceSysId lives.
     * @param {String} sourceName - display name to render in UI.
     * @param {String} sourceUrl - deep link to source config.
     * @param {String} flowPath - optional step path, e.g. "Flow X > Subflow Y > Action Z".
     */
    setSourceContext: function(sourceType, sourceSysId, sourceTable, sourceName, sourceUrl, flowPath) {
        var payload = {
            source_type: sourceType || 'other',
            source_sys_id: sourceSysId || '',
            source_table: sourceTable || '',
            source_name: sourceName || '',
            source_url: sourceUrl || '',
            flow_path: flowPath || ''
        };
        gs.getSession().putClientData('x_classic.field_change_context', JSON.stringify(payload));
    },

    clearSourceContext: function() {
        gs.getSession().clearClientData('x_classic.field_change_context');
    },

    getSourceContext: function() {
        var raw = gs.getSession().getClientData('x_classic.field_change_context');
        if (!raw)
            return {};

        try {
            return JSON.parse(raw);
        } catch (e) {
            gs.warn('FieldChangeTraceAPI.getSourceContext parse failure: ' + e.message);
            return {};
        }
    },

    persistFieldChange: function(currentRecord, fieldName, oldValue, newValue) {
        if (!currentRecord || !fieldName)
            return;

        var context = this.getSourceContext();
        var gr = new GlideRecord(this.TABLE);
        gr.initialize();
        gr.setValue('target_table', currentRecord.getTableName());
        gr.setValue('target_sys_id', currentRecord.getUniqueValue());
        gr.setValue('field_name', fieldName);
        gr.setValue('old_value', oldValue + '');
        gr.setValue('new_value', newValue + '');
        gr.setValue('changed_by', gs.getUserID());
        gr.setValue('changed_on', gs.nowDateTime());
        gr.setValue('source_type', context.source_type || 'manual_or_unknown');
        gr.setValue('source_table', context.source_table || '');
        gr.setValue('source_sys_id', context.source_sys_id || '');
        gr.setValue('source_name', context.source_name || '');
        gr.setValue('source_url', context.source_url || '');
        gr.setValue('flow_path', context.flow_path || '');
        gr.insert();
    },

    type: 'FieldChangeTraceAPI'
};
