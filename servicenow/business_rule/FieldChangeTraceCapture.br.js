/**
 * Name: Field Change Trace - Capture
 * Table: task (duplicate for all required task extension roots / custom tables)
 * When: before update
 * Filter: none
 * Advanced: true
 */
(function executeRule(current, previous /*null when async*/) {
    var tracer = new FieldChangeTraceAPI();
    var fields = current.getFields();

    for (var i = 0; i < fields.size(); i++) {
        var element = fields.get(i);
        var fieldName = element.getName();

        // Skip noisy/system fields.
        if (fieldName.indexOf('sys_') === 0)
            continue;

        if (!current[fieldName].changes())
            continue;

        tracer.persistFieldChange(
            current,
            fieldName,
            previous.getValue(fieldName),
            current.getValue(fieldName)
        );
    }
})(current, previous);
