Simple Ruby-style inheritance for JavaScript
============================================

## Example

	def ("Person") ({
		init: function(name){
			this.name = name;
		},
		
		speak: function(text){
			alert(text || "Hi, my name is " + this.name);
		}
	});
	
	def ("Ninja") << Person ({
		init: function(name){
			__super__();
		},
		
		kick: function(){
			this.speak("I kick u!");
		}
	});
	
	var ninjy = new Ninja("JDD");
	
	ninjy.speak();
	ninjy.kick();
