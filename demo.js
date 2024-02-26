const app = new PIXI.Application({ width: window.innerWidth - 20, height: window.innerHeight - 20 });
document.body.appendChild(app.view);

globalThis.__PIXI_APP__ = app;


// setting up background image
const bg = PIXI.Sprite.from('examples/assets/bg1.jpg');
bg.anchor.set(0.5);
bg.x = app.screen.width / 2;
bg.y = app.screen.height / 2;
app.stage.addChild(bg);


// declaring some variables
const rows = 3, columns = 3;
const spriteMatrix = Array(rows).fill().map(() => Array(columns));  // creating empty (rows*columns) matrix

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
        spriteMatrix[i][j] = PIXI.Sprite.from('examples/assets/closed-box.png');
    }
}


//total points variable
var sum = 0;
const sumArray = [];


// container for storing gift boxes
const container = new PIXI.Container();


// positioning gift boxes
var boxSize = 110;
for (let i = 0; i < rows; i++) {

	for (let j = 0; j < columns; j++) {

        spriteMatrix[i][j].width = boxSize;
        spriteMatrix[i][j].height = boxSize;
        spriteMatrix[i][j].anchor.set(0);
        spriteMatrix[i][j].position.set(j * boxSize, i * boxSize);

        container.addChild(spriteMatrix[i][j]);

        spriteMatrix[i][j].interactive = true;
        spriteMatrix[i][j].cursor = 'pointer';

        spriteMatrix[i][j].on('pointertap', () => {

            var number = Math.floor(Math.random() * 100);

            const help = new PIXI.Text(number, {
                fontFamily: 'Cambria',
                fontSize: 100,
                fill: 'red',
            });

            help.y = spriteMatrix[i][j].y;
            help.x = spriteMatrix[i][j].x;
            help.anchor.set(0);

            container.addChild(help);

            // adding no. to total display
            sum += number;
            sumArray.push(sum);

            const help1 = new PIXI.Text(sum, {
                fontFamily: 'Algerian',
                fontSize: 40,
                fontWeight: 'bold',
                fill: 'yellow',
                stroke: '#004620',
                strokeThickness: 12,
            });

            help1.y = app.screen.height;
            help1.x = app.screen.width;
            help1.anchor.set(1);

            // container.addChild(help1);

            // initially set alpha to 0
            help.alpha = 0;

            const ticker = PIXI.Ticker.shared;

            // declare a ticker listener
            const onTick = delta => {

                // updates the alpha value by little
                help.alpha += 0.02;
                spriteMatrix[i][j].alpha -= 0.02;

                // remove this listener once alpha reaches 1 or 0
                if (help.alpha > 1 && spriteMatrix[i][j].alpha < 0) {

                    // moving no. to total's position
                    if (help.y <= help1.y + 80 && help.x <= help1.x) {
                        help.y += (rows-i) + 1;
                        help.x += ((help1.x - spriteMatrix[i][j].x) / (help1.y/2));
                        console.log(spriteMatrix[i][j].x);
                    }
                    else {
                        help.alpha = 0;
                        app.stage.addChild(help1);
                        ticker.remove(onTick);
                    }
                }
                
                if (sumArray.length == (rows*columns)) {
                    const won = new PIXI.Text('You Won ' + sumArray[rows*col-1] + ' Points !!', {
                        fontFamily: 'Algerian',
                        fontSize: 40,
                        fontWeight: 'bold',
                        fill: 'yellow',
                        stroke: '#004620',
                        strokeThickness: 12,
                    });
                    
                    won.y = app.screen.height / 2;
                    won.x = app.screen.width / 2;
                    won.anchor.set(0.5);
                    
                    app.stage.addChild(won);
                }
            }

            // register the ticker listener
            ticker.add(onTick)
        });
	}

    
}


// total text
const text = new PIXI.Text('Total = ', {
    fontFamily: 'Algerian',
    fontSize: 40,
    fontWeight: 'bold',
    fill: 'yellow',
    stroke: '#004620',
    strokeThickness: 12,
});

text.y = app.screen.height;
text.x = app.screen.width - 70;
text.anchor.set(1);

app.stage.addChild(text);

// Move container to the center
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

// Center gift-box sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

// adding container to stage
app.stage.addChild(container);