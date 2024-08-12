

//       									 ============= GLOBAL VARIABLES =============

var //money = 0,//parseInt(localStorage.getItem('moneys')),//global player's money
	//clickGain = 1,//money gain on clicker clicked =
	autoGain = 1,//parseInt(localStorage.getItem('autoGains')),//auto money gain
	interval;//auto money interval

	
	// ДЕНЬГИ ПОЛЬЗОВАТЕЛЯ
	if ((localStorage.getItem('moneys')) > 0){
		var money = parseInt(localStorage.getItem('moneys'));
		
	}
	else{
		var money = 0;
	}
	
	
	// ДЕНЬГИ ЗА ОДИН КЛИК
	if ((localStorage.getItem('clickGains')) >= 1){
		var clickGain = parseInt(localStorage.getItem('clickGains'));
		
	}
	else{
		var clickGain = 1;
	}
	
	
/*if (clickGain >= 1){
		clickGain = parseInt(localStorage.getItem('clickGains'));
	}*/




// HTML MAIN ELEMENTS (except  shop buttons)
var element = {
	clicker   : document.getElementById("main-clicker"),//button
	money     : document.getElementById("money"),//txt
}

//       									============= GLOBAL FUNCTIONS =============

function addMoney() { // onClicker pressed add ClickGain
  money = money + clickGain;
  
  
  localStorage.setItem('moneys', money);
  localStorage.setItem('clickGains', clickGain);
  localStorage.setItem('autoGains', autoGain);
}

function updateMoney(check=true) {//update html money txt
  text = "JUMPS: " + money;
  element.money.innerHTML = text;
  if(check){checkPrices();}
  
/*if (autoGain >= 1){
		autoGain = parseInt(localStorage.getItem('autoGains'));
	}*/

}
function autoMoney(amount) {//auto add money every interval
  clearInterval(interval);
  interval = setInterval(function(){ money = money + autoGain; updateMoney(); }, 200 / amount);
}

//called when a shop Element was bought
function checkPrices() {
	//Check price for each shop element
	//unlock purchase button if enough money
	for(let i=0;i<shop.length;i++){
		if(money >= shop[i].price){
			shop[i].element.disabled = false;
		}
	}
}
//called when a shop Element was bought
function onBuy(obj) {
	//update money
	money -= obj.price;
	updateMoney(check=false);
	//localStorage.setItem('moneys', money);
	//localStorage.setItem('clickGain', clickGain);
	//localStorage.setItem('autoGain', autoGain);
	//lock every purchase buttons in shop
	for(let i=0;i<shop.length;i++){
		shop[i].element.disabled = true;
	}
}

//       								 ============= SHOP BUTTON CLASS =============

class ShopElement{
	// Object for elements in the shop.
	// New Instance Token:
	//	 id -> html main element id (in Html)
	//   newprice_func -> the new price formula function
	//   onclick_func  -> the onClick function
	
	constructor (id,newprice_func,onclick_func) 
	{ //constructor: called on "new ShopElement()"
		this.id = id;
		this.element = document.getElementById(id);
		this.element.onclick = this.purchase.bind(this);
		this.text_element = this.element.getElementsByTagName("b")[0];
		
		this._updatePrice = newprice_func;
		this._onClick = onclick_func;
		
		this.price = 0;
		this.purchaseLvl = 1;
		this.updatePrice();
	}
	
	//Call default functions with this as argument
	onClick(){this._onClick(this);}
	updatePrice(){this._updatePrice(this);}
	
	//Update Button's txt price
	updateText(){
		this.text_element.innerHTML = "<b>" +'$'+this.price+': ' + "</b>";}
	
	// Update Every new purchase
	update(){
		this.updatePrice(); //calculate new price
		this.updateText();  //update displayed txt
	}
	// called on Element clicked
	purchase(){
		this.purchaseLvl += 1;
		this.onClick();
		onBuy(this);
		this.update()
		checkPrices();
	}
	
}

//       							 =============== SHOP BUTTONS & FUNCTIONS ===============

//alls buttons functions ( newPriceFormula , onClick )
function newPrice1(obj){obj.price = clickGain * 25 * obj.purchaseLvl;}
function newPrice2(obj){obj.price = 250 * obj.purchaseLvl;}
function newPrice3(obj){obj.price = autoGain * 30 * obj.purchaseLvl + 900;}
function newPrice4(obj){obj.price = clickGain * 25 * obj.purchaseLvl;}
function newPrice5(obj){obj.price = clickGain * 550 * obj.purchaseLvl;}
function onClick1(obj){clickGain*=2;}
function onClick2(obj){autoMoney(this.purchaseLvl);}
function onClick3(obj){autoGain*=2;}
function onClick4(obj){clickGain*=2;}
function onClick5(obj){clickGain*=5;}



//all shop's buttons
shop = [
	//new ShopElement("b1",newPrice1,onClick1),
	new ShopElement("b2",newPrice2,onClick2),
	new ShopElement("b3",newPrice3,onClick3),
	new ShopElement("b4",newPrice4,onClick4),
	new ShopElement("b5",newPrice5,onClick5),
	
	//new ShopElement("b4",newPrice4,onClick3),
];

//       									 ================= START =================

// FIRST UPDATE (on page loaded)
updateMoney(); //money txt
for (let i=0;i<shop.length;i++){
	shop[i].update() //buttons txt & price
}

//set main clicker function onClick
element.clicker.onclick = function() { 
	element.clicker.disabled = true;
	addMoney(); updateMoney(); 
	element.clicker.disabled = false;
};


