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
        var target = this.prototype;
        
        for(var key in source){
            var sup = target[key], sub = source[key];
            // check if we're overwriting an existing function
            target[key] = typeof sup + typeof sub == "functionfunction" ? (function(sup, sub){
                return function(){
                    var self = this;
                    
                    sub._super || (sub._super = function(){
                        // call the same method but in the superclass
                        sup.apply(self, arguments);
                    });
                    
                    return sub.apply(self, arguments);
                };
            })(sup, sub) : sub;
        }
        
        return this;
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
        
        // add static helper method
        Klass.extend = extend;
        
        // called as function when not, inheriting from a superclass
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
            Klass.prototype = new Subclass;
            
            Klass._super = Superclass;
            Klass.prototype.constructor = Klass;
            Klass.extend(deferred._props);
            
            deferred._super = deferred._props = null;
            // return actual value
            return Klass.valueOf();
        };
        
        return deferred;
    }
    
    // calls the same method as its caller but in the superclass
    function __super__(){
        var caller = __super__.caller;
        
        if(caller !== caller._super){
            return caller._super.apply(caller, arguments);
        }
    }
    
    // expose
    global.def = def;
    global.__super__ = __super__;
}(this));
