const app = new PIXI.Application({ width: window.innerWidth - 20, height: window.innerHeight - 20 });
document.body.appendChild(app.view);

// to enable pixi-devtools
globalThis.__PIXI_APP__ = app;


// resizing the window
window.addEventListener('resize', function() {
	app.stage.width = window.innerWidth - 20;
	app.stage.height = window.innerHeight - 20;

})


// declaring some variables
const rows = 3, columns = 3;
const spriteMatrix = Array(rows).fill().map(() => Array(columns));  // creating empty (rows*columns) matrix
var sum = 0;
const sumArray = [];
var boxSize = 110;


// setting up background image
const bg = PIXI.Sprite.from('examples/assets/bg1.jpg');
bg.anchor.set(0.5);
bg.x = app.screen.width / 2;
bg.y = app.screen.height / 2;
app.stage.addChild(bg);


// initialising the matrix with sprits.
function giftMatrix() {

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            spriteMatrix[i][j] = PIXI.Sprite.from('examples/assets/closed-box.png');
        }
    }
}


// positioning gift boxes
function boxPositioning() {

    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < columns; j++) {

            spriteMatrix[i][j].width = boxSize;
            spriteMatrix[i][j].height = boxSize;
            spriteMatrix[i][j].anchor.set(0);
            spriteMatrix[i][j].position.set(j * boxSize + app.screen.width/columns, i * boxSize + app.screen.height/(rows*rows/2));

            app.stage.addChild(spriteMatrix[i][j]);

            spriteMatrix[i][j].interactive = true;
            spriteMatrix[i][j].cursor = 'pointer';

            spriteMatrix[i][j].on('pointertap', () => {
                
                var number = Math.floor(Math.random() * 100);
                
                var boxNumber = displayNumbers(i, j, number);

                // adding no. to display sum
                sum += number;
                sumArray.push(sum);
                var finalXPositionOfNumber = window.statusMessage.x - window.statusMessage.width;      // x position for sum (message).
                var finalYPositionOfNumber = window.statusMessage.y - window.statusMessage.height;     // y position for sum (message).

                console.log("^^^^^^^^^^^^^^^^^^^^", finalXPositionOfNumber, finalYPositionOfNumber);
                
                // initially set alpha to 0
                boxNumber.alpha = 0;

                const ticker = PIXI.Ticker.shared;

                // Add a variable to count up the seconds our application has been running
                let elapsedTime = 0.0;
                var initialXPositionOfNumber = boxNumber.x;
                var initialYPositionOfNumber = boxNumber.y;
                var differenceOfXaxis =  (finalXPositionOfNumber - initialXPositionOfNumber);
                var differenceOfYaxis =  (finalYPositionOfNumber - initialYPositionOfNumber);
                

                // m = (y2 - y1) / (x2 - x1)
                let slope = differenceOfYaxis / differenceOfXaxis;

                // declare a ticker listener
                const onTick = () => {

                    // updates the alpha value by little
                    boxNumber.alpha += 0.02;
                    spriteMatrix[i][j].alpha -= 0.02;

                    let maximumTimeToReachSum = 2000;      // total time in mili-seconds

                    // remove this listener once alpha reaches 1 or 0
                    if (boxNumber.alpha > 1 && spriteMatrix[i][j].alpha < 0) {

                        // Add the time to our total elapsed time
                        elapsedTime += ticker.elapsedMS;       // time in mili-seconds

                        // draging no. to sum's position
                        if (elapsedTime <= maximumTimeToReachSum) {

                            console.log("&&&&&&&&&&&&&&&&&&&&&&", elapsedTime);

                            let speed = differenceOfXaxis/maximumTimeToReachSum;

                            // distance = (speed * time)
                            let x = (speed * elapsedTime);

                            console.log("(((((((((((((((((", initialXPositionOfNumber, initialYPositionOfNumber);
                            
                            // y = m * x
                            let y = (slope * x); 

                            boxNumber.y = y + initialYPositionOfNumber;      
                            boxNumber.x = x + initialXPositionOfNumber; 

                            // decreasing size of text litle by litle
                            boxNumber.width -= 0.4;
                            boxNumber.height -= 0.4;

                            console.log(boxNumber.x, boxNumber.y, finalXPositionOfNumber, finalYPositionOfNumber);
                        }
                        else {

                            console.log('*****************');
                            console.log(boxNumber.x, boxNumber.y, finalXPositionOfNumber, finalYPositionOfNumber);
                            console.log('*****************');
                            
                            ticker.remove(onTick);
                            boxNumber.alpha = 0; 
                            app.stage.removeChild(window.statusMessage);        // to remove previous total value
                            displayMessage(sum, window.statusMessage.x, window.statusMessage.y, 40, 1);
                        }

                        // setting up time leap for winning message
                        setTimeout(winingMessage, maximumTimeToReachSum);
                   }
                }

                // register the ticker listener
                ticker.add(onTick)
            });
        }
    }
}


// function for winning message display
function winingMessage() {

    if (sumArray.length == (rows*columns)) {

        let final_Message = 'You Won ' + sumArray[rows*columns-1] + ' Points !!';

        displayMessage(final_Message, app.screen.width / 2, app.screen.height / 2, 100, 0.5);
    }
}


// display no. from boxes
function displayNumbers(a, b, num) {

    const numberText = new PIXI.Text(num, {
        fontFamily: 'Cambria',
        fontSize: 100,
        fill: 'red',
    });

    numberText.y = spriteMatrix[a][b].y;
    numberText.x = spriteMatrix[a][b].x;
    numberText.anchor.set(0);

    app.stage.addChild(numberText);

    return numberText;
}


// display message on stage
function displayMessage(message, xPos, yPos, font, Anchor) {

    window.statusMessage = new PIXI.Text(message, {
        fontFamily: 'Algerian',
        fontSize: font,
        fontWeight: 'bold',
        fill: 'yellow',
        stroke: '#004620',
        strokeThickness: 12,
    });
    
    window.statusMessage.y = yPos;
    window.statusMessage.x = xPos;
    window.statusMessage.anchor.set(Anchor);

    app.stage.addChild(window.statusMessage);
}

displayMessage(sum, app.screen.width, app.screen.height, 40, 1);
giftMatrix();
boxPositioning();