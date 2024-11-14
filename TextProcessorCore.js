

document.addEventListener ( "DOMContentLoaded", Initialize, false );

var elMenu 			= null, 
	 elMenuBtn	   = null,
	 elTextarea 	= null,
    strMarkedupText = "",
    iPrevKeyCode = 0,
    iCurrKeyCode = 0; 

function Initialize ( )
{
   window.addEventListener ( 'keydown', MonitorAppClicks );
   console.log ( "Attaching Keydown event handler with MonitorAppClicks" );

   console.log ( "Attaching Events To Meun Buttons." );

   elMenuBtn = document.getElementById ( "MenuButtons" );
   if ( elMenuBtn != null )
   {
      elMenu 	  	= elMenuBtn.querySelector ( "menuitems" );
      elTextarea 	= document.getElementById ( "Unprocessed" );
   }

	AttachHandlers ( );

   if ( window.location.href == "https://text-processor.w3spaces.com/" )
   {
      var elReadMe = document.getElementById ( "ReadMe" ),
         elSpanMac = elReadMe.getElementsByTagName( "span" );
      var elSelectAll = document.getElementById ( "SelectAll" ),
         elSpanSAMac = elSelectAll.getElementsByTagName ( "span" );

      if ( navigator.userAgent.indexOf ( "Mac" ) != -1 )
      {
         console.log ( elSpanMac );
         elSpanMac[1].classList.add ( "Hidden");
         elSpanSAMac[1].classList.add ( "Hidden" );
      }
   }
   else if ( window.location.href.pathName === "readme.html" ) 
   {
      var elHome = document.getElementById ( "Home" ),
      elSpanMac = elHome.getElementsByTagName( "span" );

      if ( navigator.userAgent.indexOf ( "Mac" ) != -1 )
      {
         elSpanMac[1].classList.add ( "Hidden");
      } 
   }
}

function AttachHandlers ( )
{
	document.addEventListener ( "keyup", ManageUserInteraction, false );
	document.addEventListener ( "click", ManageUserInteraction, false );
}

function ManageUserInteraction ( evCurr )
{
	var arrActions = { 
                       77 : "PDFTextPart",  /* Capturing m here. 
                                               77 for M in Markup 
                                               for PDF Text. */
                       67 : "PDFTextComp",  /* Capturing C here. */
							  82 : "RemoveJS", 
							  80 : "PurgeHTMLDoc",
                       66 : "BlogrollItem"
						  };

	var elActive = document.activeElement;

	var iCurrKeyCode 	= evCurr.keyCode; 
	var strActionId 	= null;

	/*
      When blur fires on text area, check whether the user has entered
      any valid data or not. In the absence of valid data, instead of 
      shifting focus to the menu button, display a message stating that 
      no processing can take place without valid data. 

      **** 	THE PROCESSING SYSTEM LACKS THIS FUNCTIONALITY AT THE MOMENT 	****
	*/

	if ( elActive.tagName !== 'TEXTAREA' )
	{
		if ( iCurrKeyCode === 13 || evCurr.type === "click" )
		{
			var strText = elTextarea.value; 

			/* 
					Enter pressed on MenuButton; code displays the menu 
					containing processing options.
			*/
			if ( 
               elActive.id === "MenuButtons" && 
               !elMenu.classList.contains ( "Displayed" ) 
				)
			{
				elMenu.classList.add ( "Displayed" );
				elActive.blur ( );
				elActive.classList.add ( "Expanded" );
			}
			else if ( 
                     strText !== "" && 
                     evCurr.target.getAttribute ( "role" ) ===
                     "menuitem" 
					  )
			{
				/* 		MarkupRemoveMarkup		*/
				var strFormatted 	= "", 
					 strHandler		= "",
					 strDataValue;

				strDataValue = evCurr.target.dataset.unprefixed;
				
				strHandler = strDataValue ? "" : "Markup";
				strHandler += evCurr.target.id;

            console.log ( "About to invoke: " + strHandler );

				strFormatted = window[strHandler]( strText );
				elMenu.classList.remove ( "Displayed" );
				elMenuBtn.classList.remove ( "Expanded" );

				if ( strFormatted === "" || strFormatted === undefined )
				{
					strFormatted = "You forgot to enter any valid text.";
				}

				var elProcessed = document.getElementById ( "ProcessedOutput" );
				elProcessed.textContent = strFormatted; 
            
				document.getElementById ( "PageCover" ).classList.add ( "Displayed" );
				elProcessed.focus ( );
			}
		}
		else if (	
               ( strActionId = arrActions [iCurrKeyCode] ) 
               !== undefined && strActionId !== elActive.id 
				  )
		{
         console.log (iCurrKeyCode);
         console.log ( strActionId );
			document.getElementById ( strActionId ).focus ( );
		}
		else if ( iCurrKeyCode === 27 && elMenu.classList.contains ( "Displayed") )
		{
			elMenu.classList.remove ( "Displayed" );
			elMenuBtn.classList.remove ( "Expanded" );
			elMenuBtn.focus ( );
		}
	}
}


function MonitorAppClicks ( evCurr )
{
   console.log ( evCurr.keyCode );
   console.log ( evCurr.shiftKey );
   console.log ( evCurr.altKey );

   evCurr.stopPropagation ( );

   if ( evCurr.ctrlKey == true || evCurr.metaKey == true )
   {
      if ( evCurr.keyCode == 82 )
      {
         evCurr.stopPropagation ( );
         evCurr.preventDefault ( );
         window.location.href = "https://text-processor.w3spaces.com/readme.html";
      }
      else if ( evCurr.keyCode == 72 )
      {
         evCurr.stopPropagation ( );
         evCurr.preventDefault ( );
         window.location.href = "https://text-processor.w3spaces.com";
      }
   }
}


function MarkupCasualMail ( strUserText )
{
	var sarMarkedupText = MarkupMail ( strUserText );
	sarMarkedupText.push ( "</div>" );
	
	return sarMarkedupText.join ( " " );
}


function MarkupBlogrollItem ( strUserText )
{
	var rxParaSeparator = /\s+(?!\S)/g;

	strUserText = strUserText.trim ( );

	var sarBlogrollItem  = strUserText.split ( rxParaSeparator );

   var strMarkupHeader  = "<article>\n\t\t<header>\n\t\t\t<h1>", 
		 strFirstLine		= "\n\t\t</h1>\n\t\t<byline>" + 
                          "\n\t\t<author>\n\t\t\t" + 
                          "<span>By<em>:</em>&nbsp;&nbsp;</span>" + 
                          "<a href = 'https://rigorous-mind.github.io/pages/about-me.html'>Irfan Surdar</a>\n\t\t",
		 strByline		   = "</author>\n\t\t<time pubdate datetime = ''>",
		 strHeaderEnd		= "</time>\n\t\t</byline>\n\t\t</header>",
       strLastLine      = "\n\t\t<section>\n\t\t<p>"
		 strCloseHeader	= "\n\t\t</p>\n\t</section>\t\n</article>",
       strMarkedUpItem  = "";

	if ( sarBlogrollItem.length === 3 )	
	{
		strMarkedUpItem      = strMarkupHeader + sarBlogrollItem[0]
                           + strFirstLine + strByline  
                           + sarBlogrollItem[1] + strHeaderEnd 
                           + strLastLine + sarBlogrollItem[2] 
                           + strCloseHeader;
	}

	return strMarkedUpItem;
}


function RemoveJS ( strHyperDoc )
{
	var rxJScript = /<script (\s|\S|\n|\r|\/)+?<\/script>|<script>(\s|\S|\n|\r|\/)+?<\/script>/g;
	var rxTagStart = /<(?!\/|\!)/g; 
	var strSansScript = strHyperDoc.replace ( rxJScript, "" );

	return strSansScript;
}

function PurgeHTMLDoc ( strHyperDoc )
{
   let parser = new DOMParser( );
   let strTextDoc = parser.parseFromString( strHyperDoc, 'text/html' );
   strTextDoc = strTextDoc.body.textContent || "";
   console.log( strTextDoc );

   var rxSpaces = /(\s|\n)+/i;
   strTextDoc = strTextDoc.replace ( rxSpaces, "" );
   strTextDoc.trim ( );

	return RemoveJS ( strTextDoc );
}


function PDFTextComp ( strSimpleDoc )
{
   var sarDocParas = strSimpleDoc.split(/\r?\n/);

	for ( iIndex = 0; iIndex < sarDocParas.length; ++iIndex )
	{
      sarDocParas[iIndex].trim ( );
      if (  
            sarDocParas[iIndex].length > 1
         )
         strMarkedupText += "\n\t\t\t<p>" + sarDocParas[iIndex] + "</p>";
	}
   strMarkedupText += strClosingTags;

	return strMarkedupText;
}


function PDFTextPart ( strSimpleDoc )
{
	var strMarkedupText = ""; 
        
   var sarDocParas = strSimpleDoc.split(/\r?\n/);

	for ( iIndex = 0; iIndex < sarDocParas.length; ++iIndex )
	{
      sarDocParas[iIndex].trim ( );
      if (  
            sarDocParas[iIndex].length > 2
         )
         strMarkedupText += "\n<p>" + sarDocParas[iIndex] + "</p>";
	}

	return strMarkedupText;
}



// var strSignatureMarkup = "<p style = \"margin: -5px 0 0;font: inherit;\"><a style = \"text-decoration: none; color: Blue;font:inherit;\" href = \"";

strMarkedupText = `
<!DOCTYPE html>
<html lang = "en">
	<head>
		<meta charset = "UTF-8">

		<title>
         Tiny Text Processor: Accelerate Your Text Processing
      </title>

		<link  rel = "stylesheet"  type = "text/css"  
             href	= "YourCSSFile.css' />

		<script 	type = "text/javascript"  src = "YourJavaScriptFile.js">
      </script\>
	</head>
	<body>
		<header>
         <h1>
         </h1>
		</header>
      <main>
`;

var strClosingTags = `\n\t\t</main>
\t</body>
</html>`;
