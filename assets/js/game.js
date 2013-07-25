
// --------------------------------------------------------------------
// --                      the main stuff:                     --
// --------------------------------------------------------------------

function Game(){
	this.init = function(){
		// Initialize game:
		$("#playground").playground({
			height: PLAYGROUND_HEIGHT,
			width: PLAYGROUND_WIDTH,
			keyTracker: true
		});

		// Loading bar callback
		$.loadCallback(function(percent){
			$('#loader').css('width', percent + '%');
			// console.log(percent);
		});

	};

	this.loadAssets = function(){
		var path = "assets/img/";

		// The background:
		animation["background"] = {
			sky        : new $.gameQuery.Animation({imageURL: path + "bg_sky.png"}),
			mountains  : new $.gameQuery.Animation({imageURL: path + "bg_mountains.png"}),
			clouds     : new $.gameQuery.Animation({imageURL: path + "bg_clouds.png"}),
			base       : new $.gameQuery.Animation({imageURL: path + "bg_base.png"}),
			grass      : new $.gameQuery.Animation({imageURL: path + "bg_grass.png"})
		};

		// Player (Abbas)
		animation["player"] = {
			idle  : new $.gameQuery.Animation({imageURL: path + "position3.png"}),
			glide : new $.gameQuery.Animation({imageURL: path + "position4.png"}),
			up    : new $.gameQuery.Animation({
				imageURL: path + "position2.png",
				numberOfFrame: 6, delta: 5, rate: 60,
				type: $.gameQuery.ANIMATION_HORIZONTAL
			})
		};

		sounds = {
			bgm    : new $.gameQuery.SoundWrapper("assets/sound/bgm.ogg", true),
			swoosh : new $.gameQuery.SoundWrapper("assets/sound/swoosh.ogg", false),
			boost : new $.gameQuery.SoundWrapper("assets/sound/boost.ogg", false)
		};


	};

	this.populate = function(){
		$.playground()
        .addGroup("background", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
			.addSprite("sky", {animation: animation["background"]["sky"],
				width: BACKGROUND_WIDTH,
				height: PLAYGROUND_HEIGHT})
			.addSprite("sky_b", {animation: animation["background"]["sky"],
				width: BACKGROUND_WIDTH,
				height: PLAYGROUND_HEIGHT,
				posx: BACKGROUND_WIDTH})
			.addSprite("mountains", {animation: animation["background"]["mountains"],
				width: BACKGROUND_WIDTH,
				height: PLAYGROUND_HEIGHT})
			.addSprite("mountains_b", {animation: animation["background"]["mountains"],
				width: BACKGROUND_WIDTH,
				height: PLAYGROUND_HEIGHT,
				posx: BACKGROUND_WIDTH})
			.addSprite("clouds", {animation: animation["background"]["clouds"],
				width: BACKGROUND_WIDTH,
				height: PLAYGROUND_HEIGHT})
			.addSprite("clouds_b", {animation: animation["background"]["clouds"],
				width: BACKGROUND_WIDTH,
				height: PLAYGROUND_HEIGHT,
				posx: BACKGROUND_WIDTH})
			.addSprite("base", {animation: animation["background"]["base"],
				width: BACKGROUND_WIDTH,
				height: PLAYGROUND_HEIGHT})
			.addSprite("base_b", {animation: animation["background"]["base"],
				width: BACKGROUND_WIDTH,
				height: PLAYGROUND_HEIGHT,
				posx: BACKGROUND_WIDTH})
			.addSprite("grass", {animation: animation["background"]["grass"],
				width: BACKGROUND_WIDTH,
				height: PLAYGROUND_HEIGHT})
			.addSprite("grass_b", {animation: animation["background"]["grass"],
				width: BACKGROUND_WIDTH,
				height: PLAYGROUND_HEIGHT,
				posx: BACKGROUND_WIDTH}).end()
        .addGroup("objects", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
			.addGroup("player", {posx: PLAYGROUND_WIDTH/2, posy: PLAYGROUND_HEIGHT/2,
                  width: 150, height: 100})
				.addSprite("abbas",{animation: animation["player"]["idle"],
					posx: -350, posy: -200, width: 150, height: 100}).end()
			.addGroup("obstacle", {posx: PLAYGROUND_WIDTH/2, posy: PLAYGROUND_HEIGHT/2,
                  width: 150, height: 150});
	};

	this.callback = function(){		

		helper.animateBackground(abbas.isBoosting());

		// console.log('x : ' + $('#abbas').x() + ' , y :' + $('#abbas').y());
		// console.log(player_move.is_gliding());
		if( $('#abbas').x() >= -350 && abbas.isGliding() === false ){
			$('#abbas').x(-5,true);
		}

		if( $('#abbas').y() <= 270 && abbas.isGliding() === false ){
			$('#abbas').y(2, true);
		}

		if( $('#abbas').y() > 120 && GAME_OVER === false){
			helper.gameOver();
			GAME_OVER = true;
		}
	};

	this.startControls = function(){
		$("#playground").css('cursor','pointer');
		$('#playground').on('click', function(){
			if( GAME_OVER === true ){
				window.location.reload();
			}
			else{
				abbas.fly();
				sounds.swoosh.play();
			}
		});

		var mouse_timeout = 0;

		$('#playground').mousedown(function() {
			mouse_timeout = setTimeout(function(){abbas.glide()}, 400);
		}).bind('mouseup mouseleave', function() {
			clearTimeout(mouse_timeout);
			abbas.stopGliding();
		});

		$(document).keydown(function(event){
			if( event.keyCode == 66 ){
				abbas.setBoosting(true);
				sounds.boost.play();
			}
		});

		$(document).keyup(function(event){
			if( event.keyCode == 66 ){
				abbas.setBoosting(false);
			}
		});

	};

}

var abbas = (function(){
	var is_gliding = false;
	var is_boosting = false;

	return {
		fly: function(){
			if( $('#abbas').y() >= -100 ){
				$('#abbas').xy(100, -100, true);
				$('#abbas').xy(100, -100, true);
			}
			else{
				var jump = - ($('#abbas').y() + 250);
				$('#abbas').xy(200,jump, true);
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
		}
	};

})();

var helper = (function(){
	return {
		gameOver: function(){
			$("#playground").append('<div id="gameover">GAME OVER <p> PLAY AGAIN </p></div>');
			$("#player").fadeTo(2000,0);
			$("#background").fadeTo(1000,0);
			sounds.bgm.stop();
		},
		makeItMove: function(id, speed){
			return ($('#'+id).x() - speed - BACKGROUND_WIDTH) % (-2 * BACKGROUND_WIDTH) + BACKGROUND_WIDTH;
		},

		animateBackground: function(boost){
			var sky       = 2;
			var mountains = 4;
			var clouds    = 3;
			var base      = 6;
			var grass     = 16;
			if( boost === true ){
				sky       = sky * 10;
				mountains = mountains * 10;
				clouds    = clouds * 10;
				base      = base * 10;
				grass     = grass * 10;
			}

			$('#sky').x( helper.makeItMove('sky', sky), false );
			$('#mountains').x( helper.makeItMove('mountains', mountains), false );
			$('#clouds').x( helper.makeItMove('clouds', clouds), false );
			$('#base').x( helper.makeItMove('base', base), false );
			$('#grass').x( helper.makeItMove('grass', grass), false );

			$('#sky_b').x( helper.makeItMove('sky_b', sky), false );
			$('#mountains_b').x( helper.makeItMove('mountains_b', mountains), false );
			$('#clouds_b').x( helper.makeItMove('clouds_b', clouds), false );
			$('#base_b').x( helper.makeItMove('base_b', base), false );
			$('#grass_b').x( helper.makeItMove('grass_b', grass), false );

		}
	};
})();
