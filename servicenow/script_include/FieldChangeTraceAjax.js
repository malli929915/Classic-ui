var FieldChangeTraceAjax = Class.create();
FieldChangeTraceAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    getLatestByField: function() {
        var tableName = this.getParameter('sysparm_table');
        var sysId = this.getParameter('sysparm_sys_id');
        if (!tableName || !sysId)
            return '{}';

        var response = {};
        var gr = new GlideRecord('x_classic_field_change_trace');
        gr.addQuery('target_table', tableName);
        gr.addQuery('target_sys_id', sysId);
        gr.orderByDesc('sys_created_on');
        gr.query();

        while (gr.next()) {
            var field = gr.getValue('field_name');
            if (response[field])
                continue;

            response[field] = {
                changed_on: gr.getDisplayValue('changed_on'),
                changed_by: gr.getDisplayValue('changed_by'),
                source_type: gr.getDisplayValue('source_type'),
                source_name: gr.getValue('source_name'),
                source_url: gr.getValue('source_url'),
                flow_path: gr.getValue('flow_path'),
                old_value: gr.getValue('old_value'),
                new_value: gr.getValue('new_value')
            };
        }

        return JSON.stringify(response);
    },

    isPublic: function() {
        return false;
    },

    type: 'FieldChangeTraceAjax'
});
