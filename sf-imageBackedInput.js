angular.module('schemaForm').config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
  function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

    var formImage = function(name, schema, options) {
      if (schema.type === 'object' && schema.format === 'form-image') {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'ImageBackedInput';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
    };

    schemaFormProvider.defaults.object.unshift(formImage);

    //Add to the bootstrap directive
    schemaFormDecoratorsProvider.addMapping(
      'bootstrapDecorator',
      'ImageBackedInput',
      'sf-imageBackedInput.html'
    );
    schemaFormDecoratorsProvider.createDirective(
      'ImageBackedInput',
      'sf-imageBackedInput.html'
    );
  }
]);
