/**
 * Notification JS
 * Creates Notifications
 * @author Andrew Dodson
 * 
 */
Notification = {

	requestPermission : function(cb){
		// Setup
		// triggers the authentication to create a notification

		// IE9
		if(("external" in window) && ("msIsSiteMode" in window.external)){
			if( !window.external.msIsSiteMode() ){
				window.external.msAddSiteMode();
				return true;
			}
			return false;
		}
		else if("webkitNotifications" in window){
			return window.webkitNotifications.requestPermission();
		}
		else {
			return null;
		}
	},
		
	checkPermission : function(){
		// Check whether the current desktop supports notifications and if they are authorised, 
		// true (yes they are supported and permission is granted), 
		// false (yes they are supported, permission has not been granted), 
		// null (Notifications are not supported)
		
		// IE9
		if(("external" in window) && ("msIsSiteMode" in window.external)){
			return window.external.msIsSiteMode();
		}
		else if("webkitNotifications" in window){
			return window.webkitNotifications.checkPermission() === 0;
		}
		else {
			return null;
		}
	},

	createNotification : function(icon, title, description, ttl){
		// Create a notification
		// @title string
		// @description string
		// @icon string
		// @ttl string

		if(("external" in window) && ("msIsSiteMode" in window.external)){
			if(window.external.msIsSiteMode()){
				window.external.msSiteModeActivate();
				return true;
			}
			return false;
		}
		else if("webkitNotifications" in window){
			if(window.webkitNotifications.checkPermission() === 0){
				var n = window.webkitNotifications.createNotification(icon, title, description )
				n.show();
				if(ttl>0){
					setTimeout( function(){ n.cancel(); }, ttl);
				}
				return n;
			}
			return false;
		}
		else {
			return null;
		}
	}
};