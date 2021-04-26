var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feed,lastFed,database,time,mylastfed;


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  FeedTheDog = createButton("Feed The Dog");
  FeedTheDog.position(625,95);
  FeedTheDog.mousePressed(feedDog);



  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  var mylastfedref = database.ref("FeedTime")
  mylastfedref.on("value",function(data){
    mylastfed = data.val();
  })
 
  if(mylastfed >= 12){
    mylastfed = mylastfed - 12;
    fill("white");
    textSize(20);
    text("Last Fed: " + mylastfed + " PM",250,33);
  }
  else if(mylastfed === 0){
  fill("white");
  textSize(20);
  text("Last Fed: 12 AM",250,33);
  }
  else{
    fill("white");
    textSize(20);
    text("Last Fed: " + mylastfed + " AM",250,33);
  }


  fill("white");
  textSize(20);
  text("Last Fed: " + mylastfed,250,33);
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  var foodStockVal = foodObj.getFoodStock();
  if(foodStockVal <= 0){
    foodObj.updateFoodStock(foodStockVal*0);
  }
  else{
    foodObj.updateFoodStock(foodStockVal-1);
  }
  database.ref('/').update({
    Food:foodStockVal-1
  })

  //write code here to update food stock and last fed time

  time = hour()
  database.ref('/').update({
    FeedTime:time
  })


}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
