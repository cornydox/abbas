// Global constants:
var PLAYGROUND_WIDTH  = 768;
var PLAYGROUND_HEIGHT = 480;
var BACKGROUND_WIDTH  = 3701;
var REFRESH_RATE      = 30;
var GAME_OVER = false;

var animation = {};
var sounds    = {};

// --------------------------------------------------------------------
// --                      FLYING ABBAS beta                         --
// --------------------------------------------------------------------

$(function(){
	var game = new Game();

	game.init();
	game.loadAssets();
	game.populate();

    $("#start").click(function(){
        $.playground().startGame(function(){
            $("#welcome").remove();
            game.startControls();
            sounds.bgm.play();
        });
    });

    //This is for the background animation
    $.playground().registerCallback(function(){
		game.callback();
    }, REFRESH_RATE);

});




