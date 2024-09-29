// ===========================================================================
// Schlog+ / schlogplus.js
// Created by s. aka Soygoy
//
// https://soyjak.blog/index.php?members/soygoy.488/
// sss5sss555s5s5s5.github.com
// s5s5s5.com
//
// This code is lcensed under the MIT License, please credit me in your forks.
// ===========================================================================

var profile_music_pause_offtab = true;
var browserType = "firefox"
if (typeof browser === "undefined") {
	var browser = chrome;
	browserType = "chrome";
}

function isEmpty(obj) {
	return Object.keys(obj).length === 0;
}

// Handles errors

function onError(error) {
	console.log(`Error: ${error}`);
}

// This is for custom text animations, etc.
function autoStyle() {
var style = `
.rainbow {
	animation: colorRotate 6s linear 0s infinite;	
}

@keyframes colorRotate {
  from {
    color: #6666ff;
  }
  10% {
    color: #0099ff;
  }
  50% {
    color: #00ff00;
  }
  75% {
    color: #ff3399;
  }
  100% {
    color: #6666ff;
  }
}
`
var styleNode = document.createElement("style")
styleNode.textContent = style
document.head.appendChild(styleNode)
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

// Extension's main decision making block

function getSettings(settings) {
	autoStyle()
	// Enable custom stylesheets
	if (settings.custom_stylesheet.value != "") {
		var style = document.createElement("style")
		style.textContent = settings.custom_stylesheet.value
		document.head.appendChild(style)
	}
	
	profile_music_pause_offtab = settings.profile_music_pause_offtab.value
	// If true, the reaction tooltip will become a grid.
	if (settings.toggle_react_grid.value == true) {
		var style = document.createElement("style")
		style.textContent = ".reactTooltip {display: grid; grid-template-columns: repeat(" + settings.react_grid_rows.value + ", 40px [col-start])}"
		document.head.appendChild(style)
	}
	// If true, image squishing will be fixed.
	if (settings.image_squish_fix.value == true) {
		var style = document.createElement("style")
		style.textContent = ".bbImage {width: auto;}"
		document.head.appendChild(style)
	}
	// If true, widescreen_videos will no longer become portrait.
	if (settings.widescreen_video.value == true) {
		var style = document.createElement("style")
		for (var i = 0; i < document.getElementsByTagName("video").length; i++) {
		document.getElementsByTagName("video")[i].style = "max-width:600px;max-height:300px;"
		}
	}
	
	function autoGreentext() {
		if (settings.toggle_auto_greentext.value == true) {
			if (document.getElementsByClassName("fr-element fr-view fr-element-scroll-visible").length > 0) {
				var messageBox = document.getElementsByClassName("fr-element fr-view fr-element-scroll-visible")[0]
				document.getElementsByClassName("fr-element fr-view fr-element-scroll-visible")[0].addEventListener("keypress",function(e) {
					//var messageBox = document.getElementsByClassName("fr-element fr-view fr-element-scroll-visible")[0]
					for (var i = 0; i < messageBox.childNodes.length; i++) {
							if (i > 0 && (messageBox.childNodes[i - 1].textContent.startsWith(">") || messageBox.childNodes[i - 1].textContent.startsWith("<")) && 
								!(messageBox.childNodes[i].textContent.startsWith(">") || messageBox.childNodes[i].textContent.startsWith("<") )
							) {
								messageBox.childNodes[i].style = "";
							}
							if (messageBox.childNodes[i].tagName == "P" && messageBox.childNodes[i].style.color == "") {
								var checkval = messageBox.childNodes[i].textContent[0]
								if (checkval == "") {
									//console.log("Empty text for some reason")
									checkval = messageBox.childNodes[i].textContent[1]
								}
								if (checkval == ">")
								{
									messageBox.childNodes[i].style = "color: rgb(65, 168, 95);"
									//console.log("Valid configuration met, your text colour has changed.")
								}
								else if (checkval == "<") {
									messageBox.childNodes[i].style = "color: rgb(251, 160, 38);"
									//console.log("Valid configuration met, your text colour has changed.")
								}
							}
					}
				})
			}
			else {
				console.log("Not working, ", document.getElementsByClassName("fr-element fr-view fr-element-scroll-visible"))
			}
		}
	}
	// Timeout to allow script to find messagebox
	setTimeout(autoGreentext, 500)
	
	updateFunction(settings)
	// When you click on new post or show new posts this will trigger.
	document.body.addEventListener("mousedown", event=> {
		setTimeout(updateFunction, 1000, settings);
	})
  
  // Enables profile music, checks on member pages only, makes sure you have an about section
	if (settings.enable_profile_music.value == true && window.location.href.includes("members") && document.getElementById("about") ){
        console.log("Attempting to load music player")
		var waitdiv = document.createElement("div")
		waitdiv.textContent = "Loading music player..."
		waitdiv.style = "float:right;"
		document.getElementsByClassName("memberHeader-buttons")[0].appendChild(waitdiv);
		// Extension clicks on your about section to force the site to load your about content and get any code strings you might have in there
        console.log("Clicking on about page")
		document.getElementById("about").click(); 
		// After 300 ms, it goes back to your main profile page and creates the music player 3 seconds later. The wait time is to let the about elements load
        console.log("Attempting to load music player")
		setTimeout(document.getElementsByClassName("tabs-tab")[0].click(), 300)
		setTimeout(startMusicPlayer, 3000);
		function startMusicPlayer() {
            console.log("Attempting to spawn music player.")
			var aboutText = document.getElementsByClassName("tabPanes js-memberTabPanes")[0].children[3].getElementsByClassName("bbWrapper")[0].childNodes
			console.log("Variable: aboutText = ", aboutText)
			// Injects into your buttons section on your profile
			var playerlocation = document.getElementsByClassName("memberHeader-buttons")[0]
			console.log("Variable: playerlocation = ", playerlocation)
			var playerNode = document.createElement("audio")
			playerNode.id = "profileMusicPlayer"
			playerNode.volume = settings.profile_music_volume.value;
			playerNode.controls = !settings.profile_music_hide_controls.value;
			playerNode.style = "height: 30px;float: right;";
			playerNode.autoplay = settings.profile_music_autoplay.value;
			playerNode.loop = settings.profile_music_loop.value;
			var playerSource = document.createElement("source");
			//console.log("Page is applicable for music");
			waitdiv.remove();
			for (var i = 0; i < aboutText.length; i++) {
				if (aboutText[i].constructor == Text && aboutText[i].data.includes("[MUSIC]") && aboutText[i].data.includes("[/MUSIC]")) {
					var musicUrl = aboutText[i].data.replace("[MUSIC]","").replace("\n","").replace("[/MUSIC]","")
                    console.log("This is the URL the player is attempting to load: " + musicUrl)
					if (musicUrl.startsWith("http")) {
						playerSource.src = musicUrl;
						playerNode.appendChild(playerSource);
						playerlocation.appendChild(playerNode);
						if (settings.profile_music_autoplay.value) {playerNode.play()}
					}
				}
				else {
					if (aboutText[i].tagName == "A") {
						var musicUrl = ""
						if (aboutText[i].textContent.toLowerCase() == "[music]") {
							musicUrl = aboutText[i].href
						}
						if (musicUrl.startsWith("http")) {
							playerSource.src = musicUrl;
							playerNode.appendChild(playerSource);
							playerNode.autoplay = settings.profile_music_autoplay.value; // Double check
							playerlocation.appendChild(playerNode);
						}
					}
                }
			}
		}
	}
	// Page takes a lil while to load so if we give it a delay it will eventually get in.
	setTimeout(profileButtons, 300);
	function profileButtons() { 
		if (window.location.href.includes("account-details")) {
			var musicInputField = document.createElement("input")
			var buttonBar = document.getElementsByClassName("fr-toolbar fr-ltr fr-desktop fr-top fr-basic")[0]
			var aboutMe = document.getElementsByClassName("fr-element fr-view fr-element-scroll-visible")[0]
			musicInputField.placeholder = "Music url..."
			musicInputField.id = "musicInputField"
			musicInputField.style = "max-height:30px;margin-top: 7px;"
			buttonBar.insertBefore(musicInputField, buttonBar.childNodes[3])
			musicInputField.addEventListener("keypress", function(event) {
					if (event.key === "Enter") {
						event.preventDefault();
						if (musicInputField.value.includes("http")) {
							//console.log("Enter pressed!")
							var pElement = document.createElement("p")
							var aElement = document.createElement("a")
							aElement.href = musicInputField.value
							aElement.target = "_blank"
							aElement.textContent ="[Music]"
							pElement.appendChild(aElement)
							aboutMe.appendChild(pElement)
						}
					}
				}
			); 
		}
	}
}

// This function checks for changes in messages for the word filter and other cool text stuff.
function changeElements(settings) {
	var effectElements = [document.getElementsByClassName("p-title-value")[0]]
	//var thing = document.getElementsByClassName("message-content js-messageContent");
	//for (var i = 0; i < thing.length; i++) {
		//effectElements.push(thing[i])
		//thing[i].innerHTML = thing[i].innerHTML.replace("schlog","shlog")
	//}
		
	// This gets message text.
	var conversationMessages = document.getElementsByClassName("message-userContent lbContainer js-lbContainer")
	for (var i=0; i < conversationMessages.length; i++) {
			effectElements.push(conversationMessages[i])
	}
	for(var i=0; i < document.getElementsByTagName("div").length; i++ ) { 
		if(document.getElementsByTagName("div")[i].hasAttribute("itemprop")) {
			if (document.getElementsByTagName("div")[i].getAttribute("itemprop") == "text") {
				effectElements.push((document.getElementsByTagName("div")[i]))
			}
		}
	}
		
	for(var i=0; i < document.getElementsByClassName("siropuShoutboxMessage").length; i++ ) { 
		effectElements.push(document.getElementsByClassName("siropuShoutboxMessage")[i])
	}

	for (var i= 0; i < effectElements.length; i++) {
		if (effectElements[i] != undefined) {
			if (settings.schlog_or_shlog.value != "Off") {
				effectElements[i].innerHTML = effectElements[i].innerHTML.replace(settings.schlog_or_shlog.value.split(" ")[0], settings.schlog_or_shlog.value.split(" ")[2]); 
				effectElements[i].innerHTML = effectElements[i].innerHTML.replace(settings.schlog_or_shlog.value.split(" ")[0].toLowerCase(), settings.schlog_or_shlog.value.split(" 	")[2].toLowerCase()); 
				effectElements[i].innerHTML = effectElements[i].innerHTML.replace(settings.schlog_or_shlog.value.split(" ")[0].toUpperCase(), settings.schlog_or_shlog.value.split(" ")[2].toUpperCase()); 
			}
			if (effectElements[i].innerHTML.includes(":rainbow:")) {
				effectElements[i].className = "rainbow"
			}
		}
	}
}

var isPlayerPaused = true

document.addEventListener("visibilitychange", (event) => {
	if (document.visibilityState == "visible") {
		// Tab is active
		if (document.getElementById("profileMusicPlayer") != null && profile_music_pause_offtab) {
			if (isPlayerPaused == false) {
				document.getElementById("profileMusicPlayer").play()
			}
		}
	} else {
		// Tab is NOT active
		if (document.getElementById("profileMusicPlayer") != null && profile_music_pause_offtab) {
			isPlayerPaused = document.getElementById("profileMusicPlayer").paused
			document.getElementById("profileMusicPlayer").pause()	
		}
	}
});

function updateFunction(settings) {
	// If you are currently on a thread page...
	if (window.location.href.includes("threads") || window.location.href.includes("conversations")) {
		var messageInner = document.getElementsByClassName("message-inner")
		for (var i= 0; i < messageInner.length; i++) {
			// If toggle_ignore_guests is true and there are guests on the page, their messages will be hidden. 
			if (messageInner[i].getElementsByClassName("userTitle message-userTitle").length > 0) {
				if (settings.toggle_ignore_guests.value && messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.includes("Guest")) {
					messageInner[i].style = "display:none;"
				}
			}
			
			// If a user's username is inside of the ignore list, their message gets hidden.
			if (messageInner[i].getElementsByClassName("username").length > 0) {
					if (settings.ignore_list.value.includes(messageInner[i].getElementsByClassName("username")[0].textContent)) {
						messageInner[i].style = "display:none;"
				}
			}
			changeElements(settings)
			if (settings.toggle_custom_badges.value && messageInner[i] != undefined && messageInner[i].getElementsByClassName("userTitle message-userTitle").length > 0) {
				if (messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.includes("[#")) {
					// This statement checks to make sure that people don't try to break the code by something of "[#[#[][[][#" etc.
					if ( (messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.match(/]/g) || []).length == 1 && (messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.match(/#/g) || []).length == 1) {
						var bannerText = messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.split("]")[1]
						var bannerColour = "#" + messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.split("[#")[1].split("]")[0]
						messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent = messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.split("[#")[0]
						var bannerDiv = document.createElement("div")
						var bannerStrong = document.createElement("strong")
						bannerStrong.textContent = bannerText
						bannerDiv.className = "userBanner"
						bannerDiv.style = "display:block;color:white;background-color:" + bannerColour + ";"
						bannerDiv.appendChild(bannerStrong)
						messageInner[i].getElementsByClassName("message-userDetails")[0].appendChild(bannerDiv);
					}
				}
			}
		}
	}
}

if (browserType == "firefox") {
	let getting = browser.storage.sync.get();
	getting.then(getSettings, onError);
}
else {
	browser.storage.sync.get(
		function(result) {
			getSettings(result)
		}
	)
}
