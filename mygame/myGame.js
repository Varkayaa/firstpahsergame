/*global Phaser*/


var game = new Phaser.Game(800, 600, Phaser.AUTO, '');
var game_state = {}


game_state.main = function () {};
game_state.main.prototype = {


	preload: function() {
	game.load.image('sky','assets/sky.png');
	game.load.image('ground', 'assets/platform.png');
	game.load.image('star','assets/star.png');
	game.load.spritesheet('dude','assets/dude.png', 32, 48);


},


create: function() {
    
game.add.sprite(0,0, 'star');

//simple game background
game.add.sprite(0,0,'sky');

//platforms groups
this.platforms = game.add.group();

//enable physics
this.platforms.enableBody =true;

//ground
var ground = this.platforms.create(0,game.world.height-64, 'ground');

//scale
ground.scale.setTo(2,2);

//stops ground from falling away when jump on it
ground.body.immovable = true;

//ledges you can change posistion
var ledge = this.platforms.create(20,80,'ground');
ledge.body.immovable=true;

//Enable physics
game.physics.startSystem(Phaser.Physics.ARCADE);

//player and its settings
this.player= game.add.sprite(32,game.world.height-150,'dude');

//enable physics on this player
game.physics.arcade.enable(this.player);

//player physics properties
this.player.body.bounce.y = 0.5 - 10;
this.player.body.gravity.y=  9- 10;
this.player.body.collideWorldBounds= true;

//player animations walking left and right
this.player.animations.add('left',[0,1,2,3],10,true);
this.player.animations.add('right',[5,6,7,8],10, true);

//player controls
this.cursors = game.input.keyboard.createCursorKeys();

//stars to collect
this.stars=game.add.group();

//enable physics for the stars created in this group
this.stars.enableBody = true;

//create 12 evenly spaced stars
for (var i = 0; i<12; i++){
	//create a star inside of this group
	var star = this.stars.create(i*70,0,'star');
	//gravity!
	star.body.gravity.y = 300;
	//gives each star slightly random bounce value
	star.body.bounce.y = 0.7 + Math.random()*0.2;
	//this is the score
	this.scoreText = game.add.text(16,16, 'score: 0',{
		fontSize: '32px',
		fill: '#000'
	})
}


update: function() {
	//collide player and the platforms
game.physics.arcade.collide(this.player,this.platforms);

//reset player velocity/movement
this.player.body.velocity.x = 0;

if(this.cursors.left.isDown){
//move left
this.player.body.velocity.x = -150;
this.player.animations.play('left');
}
else if (this.cursors.right.isDown){
//move right
this.player.body.velocity.x=150;
this.player.animations.play('right');
}
else{
	//stand still
	this.player.animations.stop();
	this.player.frame=4;
}
	//allow player to jump if they are touching ground
	if(this.cursors.up.isDown && this.player.body.touching.down) {
		this.player.body.velocity.y = -350;
	}
	//collide stars and the platform
	game.physics.arcade.collide(this.stars, this.platforms);

	//checks if player is overlapping stars and if so collects them
	game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
	
}
collectStar: function(player,star){
	//removes star from screen
	star.kill();
}


game.state.add('main', game_state.main);
game.state.start('main');



