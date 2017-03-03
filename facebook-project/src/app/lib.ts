declare const FB:any;
export function checkLoginState()
{
function statusChangeCallback(response) {
      console.log('statusChangeCallback in app component');
      console.log(response);
}
    FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
    console.log(response);
    });  
}