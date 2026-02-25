/**
 * Workspace Client Script / UI Builder helper.
 *
 * Usage:
 * 1) Create a data resource that calls Scripted REST API endpoint below.
 * 2) Bind the response to a custom field-prefix component that renders an info icon.
 * 3) On click open source_url and show flow_path/source_name in a popover.
 */
(function() {
    function getTraceMap(table, sysId, callback) {
        var ga = new GlideAjax('FieldChangeTraceAjax');
        ga.addParam('sysparm_name', 'getLatestByField');
        ga.addParam('sysparm_table', table);
        ga.addParam('sysparm_sys_id', sysId);
        ga.getXMLAnswer(function(answer) {
            try {
                callback(JSON.parse(answer || '{}'));
            } catch (e) {
                callback({});
            }
        });
    }

    window.FieldChangeTraceWorkspaceClient = {
        getTraceMap: getTraceMap
    };
})();
