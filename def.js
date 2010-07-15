/*
 *    def.js: Simple Ruby-style inheritance for JavaScript
 *
 *    Copyright (c) 2010 Tobias Schneider
 *    This script is freely distributable under the terms of the MIT license.
 */

(function(global){
    // used to defer setup of superclass and properties
    var deferred;
    
    function extend(source){
        var prop, target = this.prototype;
        
        for(var key in source){
            if(source.hasOwnProperty(key)){
                prop = target[key] = source[key];
                // check if we're overwriting an existing function
                if ("function" == typeof prop){
                    // mark eatch method with its name and surrounding class
                    prop._name = key;
                 	prop._class = this;
                }
            }
        }
        
        return this;
    }
    
    // based on http://github.com/shergin/legacy by shergin
    function base() {
        var caller = base.caller;
        // call same method as its caller but in the superclass
        return caller._class._super.prototype[caller._name].apply(this, arguments);	
    }
    
    function def(context, klassName){
        klassName || (klassName = context, context = global);
        // create class on given context (defaults to global object)
        var Klass = context[klassName] = function Klass(){
            // called as a constructor
            if(this != context){
                // allow the constructor to return a different class/object
                return this.init && this.init.apply(this, arguments);
            }
            // called as a function - defer setup of superclass and properties
            deferred._super = Klass;
            deferred._props = arguments[0] || { };
        }
        
        // make this class extendable
        Klass.extend = extend;
        
        // called as function to set properties - when not, inheriting from a superclass
        deferred = function(props){
            return Klass.extend(props);
        };
        
        // dummy subclass
        function Subclass() { }
        
        // valueOf is called to setup inheritance from a superclass
        deferred.valueOf = function(){
            var Superclass = deferred._super;
            
            if(!Superclass){
                return Klass;
            }
            // inherit from superclass
            Subclass.prototype = Superclass.prototype;
            var proto = Klass.prototype = new Subclass;
            // reference base and superclass
            Klass._class = Klass;
            Klass._super = Superclass;
            // enforce the constructor to be what we expect
            proto.constructor = Klass;
            // to call original methods in the superclass
            proto._super = base;
            
            Klass.extend(deferred._props);
            // return actual value
            return Klass.valueOf();
        };
        
        return deferred;
    }
    
    // expose def to the gloabl context
    global.def = def;
}(this));
