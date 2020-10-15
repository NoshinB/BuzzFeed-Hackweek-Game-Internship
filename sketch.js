//Game

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var collectables;
var canyons;
var game_score;
var flagpole;
var lives;
var platforms;

function setup()
{
    createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 4;
    startGame();
    game_score = 0;
    backgroundImg = loadImage('img/bg.gif')
    canyonImg = loadImage('img/Antoni/Canyon/ACanyon.png');
    collectablesImg = loadImage('img/Antoni/Collectable/ACollect.png');
    livesImg = loadImage('img/Antoni/Lives/ALives.png');
    characterFrontImg = ('img/Antoni/Character/AFront.png');
    charJumpLImg = ('img/Antoni/Character/AJumpL.png');
    charJumpRImg = ('img/Antoni/Character/AJumpR.png');
    charFallImg = ('img/Antoni/Character/AIdle.png');
    charRightImg = ('img/Antoni/Character/ARight.gif');
    charLeftImg = ('img/Antoni/Character/ALeft.gif');
}

function startGame()
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.   
    canyons = [
            {x_pos: 0, y_pos:0, size:100},
            {x_pos: 200,y_pos:0, size:100},
            {x_pos: 800,y_pos:0, size:100},
            {x_pos: -700,y_pos:0, size:100},
            {x_pos: -1200,y_pos:0, size:100},
            {x_pos: -1990,y_pos:0, size:100}
            ]
  
    collectables = [
            {x_pos: 200, y_pos: 100, size: 50, isFound:false},
            {x_pos: -700, y_pos: 100, size: 50, isFound:false},
            {x_pos: -900, y_pos: 100, size: 50, isFound:false},
            {x_pos: -1000, y_pos: 100, size: 50, isFound:false},
            {x_pos: -1600, y_pos: 100, size: 50, isFound:false},
            {x_pos: -2000, y_pos: 100, size: 50, isFound:false},
            {x_pos: -200, y_pos: 0, size: 50, isFound:false},
            {x_pos: -500, y_pos: 0, size: 50, isFound:false},
            {x_pos: -1700, y_pos: 0, size: 50, isFound:false}
            ]

    flagpole = {x_pos: -2100, isReached: false};
    
    lives -=1;
    
    platforms = [];
    platforms.push(createPlatform(0, floorPos_y-100,150));
    platforms.push(createPlatform(-1500, floorPos_y-100,150));
    platforms.push(createPlatform(-300, floorPos_y-100,150));
}

function draw()
{
	background(backgroundImg);

	noStroke();
	fill(0,130,60);
	rect(0, floorPos_y, width, height/4); // draw some ground
    
    //Scrolling
    push();
    translate(scrollPos,0);
    
    // Draw canyons.
    for(var i = 0; i<canyons.length; i++)
    {
        drawCanyons(canyons[i]);
        checkCanyons(canyons[i]);
    }
    if(isPlummeting==true)
    {
        gameChar_y+=10;
    }
    
    //Losing lives
    if (gameChar_y > 574 && lives > 0)
    {
        startGame();
    }
    
	// Draw collectable items.
    for (var i = 0; i < collectables.length; i++)
    {
        if (collectables[i].isFound != true)
        {
            drawCollectables(collectables[i]);
            checkCollectables(collectables[i]);
        }
    }
    
    renderFlagpole(); 
    
    for (var i =0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    // Draw game character.
	drawGameChar();
    
    //Draw screen text
    //Scores
    fill(255);
    noStroke();
    text("Score: " + game_score, 20, 20);
    
    //Lives
    for(var i = 0; i < lives; i++)
    {   
        push();
            image(livesImg, [i+10], 25, 0, 0);
        pop();
    }
    
        //Game Over
    if (lives < 1)
    {
        fill(255, 0,0);
        noStroke();
        textSize(25);
        text("Game over. Press space to continue!", 315, 60);
        return;
    }    
       //Level complete
    if (flagpole.isReached == true)
    {
        fill(255, 255, 0);
        noStroke();
        textSize(25)
        text("Level complete. Press space to continue!", 315, 60)
        return;
    }
    fill(255, 255, 0);
    ellipse(80, floorPos_y -350, 60, 60);
    
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if (gameChar_y < floorPos_y)
    {
        var isContact = false;
        for (var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y))
            {
                isContact = true;
                break;
            }
        }
        if(isContact == false)
        {        
        gameChar_y += 5;
        isFalling = true;
        }
        else
        {
            isFalling = false;
        }
    }
    else
    {
        isFalling = false;
    }

    if(flagpole.isReached != true)
    {
        checkFlagpole();
    }
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
    
    if(flagpole.isReached && key == ' ')
    {
        nextLevel();
        return
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
        return
    }

	console.log("press" + keyCode);
	console.log("press" + key);
    
    if (keyCode == 37)
    {
        isLeft = true;
    }
    if (keyCode == 39)
    {
        isRight = true;
    }
      if(keyCode==32)
    {
        isFalling = true;
    }
    if (keyCode ==32 && gameChar_y == floorPos_y)
    {
        gameChar_y -=200;
    }

}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
    
    if (keyCode == 37)
    {
        isLeft = false;
    }
    if (keyCode == 39)
    {
        isRight = false;
    }
    if(keyCode==32)
    {
        isFalling = false;
        console.log("isFalling=" + isFalling);
    }
}

// Game character render function
// ------------------------------
// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
		// add your jumping-left code
         //Body
        image(charJumpLImg, gameChar_x, gameChar_y-37, 0, 0);
    }
	else if(isRight && isFalling)
	{
		// add your jumping-right code
         //Body
       image(charJumpRImg, gameChar_x, gameChar_y-37, 0, 0);
	}
	else if(isLeft)
	{
		// add your walking left code
        //Body
        image(charLeftImg, gameChar_x, gameChar_y-37, 0, 0);
	}
	else if(isRight)
	{
		// add your walking right code
        //Body
        image(charRightImg, gameChar_x, gameChar_y-37, 0, 0);
	}
    
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        //Body
        image(charFallImg, gameChar_x, gameChar_y-37, 0, 0);
	}
	else
	{
		// add your standing front facing code
        //Body
//        image(characterFrontImg, gameChar_x, gameChar_y-37, 0, 0);
	}
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyons(t_canyons)
{
    image(canyonImg, t_canyons.x_pos, floorPos_y, 0, 0);
}

// Function to check character is over a canyon.
function checkCanyons(t_canyons)
{
    if(gameChar_world_x>=t_canyons.x_pos && (gameChar_y>=floorPos_y)&&(gameChar_world_x<=t_canyons.x_pos+t_canyons.size))
    {
        isPlummeting=true;
        gameChar_y+=10
        
    }
    else
    {
        isPlummeting=false
    }
}

// Collectable items render and check functions
// Function to draw collectable objects.
function drawCollectables(t_collectables)
{
    image(collectablesImg, t_collectables.x_pos+270, t_collectables.y_pos+294, 0, 0);
}

// Function to check character has collected an item.
function checkCollectables(t_collectables)
{
    //logic for collectable item
    //dist from item 529
    var dis=(dist(gameChar_world_x, gameChar_y, t_collectables.x_pos, t_collectables.y_pos));     
    if(dis<440 && dis > 420 && gameChar_y)
    {
        t_collectables.isFound = true;
        game_score +=1;
    }
}

//Creating flagpole
function renderFlagpole()
{
    push();
    stroke(0);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 150)
    
    if (flagpole.isReached)
    {
        noStroke();
        fill(255, 255, 0);
        rect(flagpole.x_pos, floorPos_y - 150, 50, 50);
        fill(0);
        ellipse(flagpole.x_pos+20, floorPos_y - 140, 10, 10);
        ellipse(flagpole.x_pos+40, floorPos_y - 130, 10, 10);
        fill(255);
        stroke(0);
        arc(flagpole.x_pos+25, floorPos_y-115, 30, 20, 0, PI + QUARTER_PI, CHORD);
    }
    else
    {
        noStroke();
        fill(255, 0, 0);
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50); 
    }
    pop();
}
function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if (d<50)
    {
        flagpole.isReached = true;
    } 
}

//Creating platforms
function createPlatform(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            stroke(0);
            strokeWeight(3);
            fill(255, 0, 0);
            rect(this.x, this.y, this.length, 20);
            fill(0, 255, 0);
            rect(this.x, this.y, this.length-100, 20);
            fill(0, 0, 255);
            rect(this.x+100, this.y, this.length-100, 20);  
        }, 
        checkContact: function(gc_x, gc_y)
        {
            //checks if game char is in contact with the platform
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if (d >=0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }
    }
    return p;
}

//Creating birds
function Bird(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 2;
    
    this.draw = function()
    {
        noStroke();
        fill(105, 105, 105);
        ellipse(this.current_x, this.y -25, 40, 10);
        ellipse(this.current_x, this.y -20, 8, 15);
        ellipse(this.current_x+5, this.y -30, 8, 15);        
    }
    this.update = function()
    {
        this.current_x += this.incr;
        if(this.current_x < this.x)
        {
            this.incr = 2;
        }
        else if (this.current_x > this.x + this.range)
        {
            this.incr = -2;
        }
    }
}
