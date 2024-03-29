
document.addEventListener("DOMContentLoaded",function(){
	ValidateAndDisplayButton();
	AddFormValidators();
	PrintTimers();
});

class Timer{
	id;
	constructor(name, timeInSeconds){
		this.name = name;
		this.time = timeInSeconds;
	}
}

function notify(message) {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification(message);
    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification(message);
        // …
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
}


function EmptyTimerOptions(){
	document.querySelector("#timers").innerHTML = '';
}

function SecondsToTimeString(seconds){
	const SECONDS_IN_HOUR = 3600;
	const SECONDS_IN_MINUTE = 60;
	var hours = 0, minutes = 0;
	switch(true){
		case seconds>=SECONDS_IN_HOUR:
			hour = (seconds - (seconds%SECONDS_IN_HOUR))/SECONDS_IN_HOUR;
			seconds = seconds - (seconds%SECONDS_IN_HOUR);
		case seconds>=SECONDS_IN_MINUTE:
			minutes = (seconds - (seconds%SECONDS_IN_MINUTE))/SECONDS_IN_MINUTE;
			seconds = seconds%SECONDS_IN_MINUTE;
		default:
		break;
	}

	return `${numbersFormat(hours)}:${numbersFormat(minutes)}:${numbersFormat(seconds)}`;
	
}

function numbersFormat(number){
	return number<=9? "0" +number: number;
	
}

function GetStoredTimers(){
	var timersKW = localStorage.getItem("Timers");
	if(timersKW == undefined){
		return [];
	}
	return JSON.parse(timersKW);
}



function PrintTimers(){
	var timers = GetStoredTimers();
	for(let i in timers){
		Object.setPrototypeOf(timers[i],new Timer());
		var elemento = document.createElement("div");
		elemento.innerHTML = `${timers[i].name} (${SecondsToTimeString(timers[i].time)})`;
		elemento.classList = "timerButton";
		elemento.time = parseInt(timers[i].time);
		elemento.timerID = "timer" + (Math.floor(Math.random()*(10000))+i) ;
		elemento.name = timers[i].name;
		
		this.running = false;
		elemento.addEventListener("click", async function(){
			var self = this;
			self.runningStart = new Date();
			var div = document.querySelector(`#runningTimers #${self.timerID}`);
			if(self.running == true){ 	
				return;
			}
			
			var segundos = self.time;
			if(!div){
				div = document.createElement("div");
				div.id = self.timerID;
				div.classList = "runningTimer";
				div.innerHTML = SecondsToTimeString(Math.ceil(segundos)) + " <pre style='font-weight:bold;display:inline-block'>(" + self.name + ")</pre>";
			
				document.querySelector("#runningTimers").appendChild(div);
			}
			
			self.running = true;
			
			
			while(true){
				
				var timeLapse = (new Date() - self.runningStart)/1000;
								
				if(timeLapse>=segundos){
					document.querySelector(`#runningTimers #${self.timerID}`).dataset.finished = true;
					notify(`El timer de ${self.name} finalizó.`);
					self.running = false;
					break;
				}
				
				await Wait(100).then(function(){
					timeLapse = (new Date() - self.runningStart)/1000;
					div.dataset.finished = false;
					div.innerHTML =  SecondsToTimeString(Math.ceil(segundos - timeLapse)) + " <pre style='font-weight:bold;display:inline-block'>(" + self.name + ")</pre>";
				});
			}
			
			
			
			
			
		});
		
		document.querySelector("#timers").appendChild(elemento);
	}
}

async function Wait(milliseconds){
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			resolve();
		},milliseconds);
	})
}

function AddFormValidators(){
	document.querySelectorAll("#formulario input").forEach((elemento)=>{
		elemento.addEventListener("input",function(){
			ValidateAndDisplayButton();
		})
		
	});
}

function ValidateAndDisplayButton(){
	if(IsFormClear()){
		document.querySelector("#btnClear").style.display = "none";
	}
	else{
		document.querySelector("#btnClear").style.display = "inline-block";
	}
}


function Save(){
	if(IsFormClear()){
		alert("There are missing inputs.");
		return;
	}
	
	var name = document.querySelector("#timerName").value;
	var time = document.querySelector("#timerTime").value;
	
	var timer = new Timer(name,time);
	var currentTimers = GetStoredTimers();
	timer.id = currentTimers.length+1;
	currentTimers.push(timer);
	localStorage.setItem("Timers",JSON.stringify(currentTimers));
	
	EmptyTimerOptions();
	PrintTimers();
	ClearForm();
}

function Update(){
	Test();
}

function Delete(){
	Test();
}

function ClearForm(){
	document.querySelector("#timerName").value = '';
	document.querySelector("#timerTime").value = '';
	ValidateAndDisplayButton();
}

function IsFormClear(){
	var name = document.querySelector("#timerName").value;
	var time = document.querySelector("#timerTime").value;
	
	var allInputs = [name,time];
	
	allInputs = allInputs.filter((a)=>{
		return a!='';
	});
	
	return allInputs.length==0;
	
}

function Test(){
	if(arguments.callee.caller){
		console.log(`Testing the following function: ${arguments.callee.caller.name}`);	
		return;
	}
	console.log("Testing anonymous function");

}

