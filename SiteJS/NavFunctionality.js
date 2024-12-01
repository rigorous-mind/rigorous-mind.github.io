console.log ( "JS Loaded Successfully." );

document.addEventListener ( 
                            "DOMContentLoaded", 
                            InitializeData, 
                            false 
                           );
document.addEventListener ( 
                             "keydown", 
                             ManageNavInteraction, 
                             false 
                           );

var elNavList = null,
    arrKeyMap = 
    {
       0  : 0,
       2  : 2,
       3  : 3,
       8  : 6,
       15 : 1,
       18 : 5,
       19 : 4
    };


function InitializeData ( evCurr )
{
   var elMainNav = document.querySelector ( "header > nav" );
   elNavList = elMainNav.querySelectorAll ( "li > a" );
}


function ManageNavInteraction ( evCurr )
{
   var iCurrKeyCode = evCurr.keyCode; 
   if ( iCurrKeyCode > 64 && iCurrKeyCode < 91 )
      iCurrKeyCode -= 65;
   else if ( iCurrKeyCode > 96 && iCurrKeyCode < 123 )
      iCurrKeyCode -= 97;

   if (	
         arrKeyMap[iCurrKeyCode] != null
      )
   {
      iCurrKeyCode = arrKeyMap[iCurrKeyCode];
      window.location = elNavList[iCurrKeyCode].href; 
   }
}
