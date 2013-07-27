function Bird(node){
	this.speedx = Math.floor(Math.random() * -7) -5; // min -5, max - 12
	this.node = $(node);
	console.log(this.speedx);

	this.update = function(){
		var speed = this.speedx;
		if(abbas.isBoosting()){
			speed = speed - 10;
		}
		$(this.node).x(speed, true);
	};
}