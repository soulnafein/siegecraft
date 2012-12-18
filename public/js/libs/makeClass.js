// makeClass - By John Resig (MIT Licensed)
function makeClass(){
  var theClass = function(args) {
    if ( this instanceof arguments.callee ) {
      if ( typeof this.init == "function" )
        this.init.apply( this, args.callee ? args : arguments );
    } else
      return new arguments.callee( arguments );
  };

  theClass.prototype.bind = function ( fn ) {
    var self = this;
    return function () {
      fn.apply( self, arguments );
    };
  };

  return theClass;
}
