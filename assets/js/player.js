function Player(node){
	this.node = node;

	this.grace = false;
	this.energy = 100;

	this.damage = function(){
		this.energy = this.energy - 10;

		if(this.energy === 0){
			return true;
		}
		return false;
	};
}

var abbas = (function(){
	var is_gliding = false;
	var is_boosting = false;

	return {
		fly: function(){
			if( $('#player').y() > 80 ){
				$('#player').xy(30, -50, true);
				$('#player').xy(30, -50, true);
			}
			else{
				var jump = - ($('#player').y() + 30);
				$('#player').xy(30,jump, true);
			}			
			$("#abbas").setAnimation(animation["player"]["up"]);

			setTimeout(function(){
				$("#abbas").setAnimation(animation["player"]["idle"]);
			}, 1000);
		},
		glide:function(){
			$("#abbas").setAnimation(animation["player"]["glide"]);
			is_gliding = true;
		},
		isGliding:function(){
			return is_gliding;
		},
		stopGliding:function(){
			is_gliding = false;
		},
		isBoosting: function(){
			return is_boosting;
		},
		setBoosting: function(state){
			is_boosting = state;
		},
		damage: function(){
			$('#player').y(50, true);
			$("#abbasFlare").setAnimation(animation["player"]["flare"]);
			$("#abbas").setAnimation(animation["player"]["damage"]);
			setTimeout(function(){
				$('#abbasFlare').setAnimation();
				$("#abbas").setAnimation(animation["player"]["idle"]);
			}, 1000);
		}
	};

})();