sap.ui.define([], function () {
	"use strict";
	return {

		formatterColor: function (Estado) {
			var state;
			switch (Estado) {
			case "S":
				state = "Success";
				break;			
			case "W":
				state = "Warning";
				break;
			case "E":
				state = "Error";
				break;

			default:
				break;
			}
			return state;
		},
		formatterIcon:function(){
			
		}

	};
});