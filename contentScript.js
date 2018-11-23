function await_mcps_javascript_load() {
	var timer = setInterval(check_condition, 10);
	
    function check_condition() {
    // 	console.log($(".ng-binding"))
    // console.log($(".ng-scope"))
        if ($(".ng-binding").length > 7) {
            clearInterval(timer);
            main()
        }
    }
}


function main(){
	$("td.ng-binding, td.ng-scope").each(function(){
		text = $(this).text().trim();
		color = null;
		switch(text){
		case "A":
			color = "#59e22b"; // green
			break;
		case "B":
			color = "#2ba9f2"; // blue
			break;
		case "C":
			color = "#fcf91e"; // yellow
			break;
		case "D":
			color = "#ff7700"; //orange
			break;
		case "Z":
		case "E":
			color = "#ff2600"; // red
			break;
		case "NG":
		case "X":
			color = "#939393"; // dark(ish) grey
			break;
		case "":
			color = "#cfd6d4"; // light grey
			break;
		}
		// don't change color for % column
		if($(this).closest('table').find('th').eq($(this).index())[0].innerHTML != "%"){
			$(this).css("backgroundColor", color);
		}

 		// percent column itself gets selected to change color, so don't select the sibling's sibling of that, which is the assignment title
		if(["#cfd6d4", null].includes(color)){
			return;
		}
		percent = $(this).prev();
		score = percent.prev().text().trim();
		// credit to https://stackoverflow.com/a/3523794 for finding th from td
		// don't calculate percent if it's the main page A's, or the Current Grade A's (gives NaN answers)
		if(["Course", "MP1", "MP2", "MP3", "Current Grade %"].includes(percent.closest('table').find('th').eq(percent.index())[0].innerHTML)) {
			return;
		}

		parts = score.split("/");
		num = parseFloat(parts[0]); // float so we don't lose any precision for decimal grades
		denom = parseFloat(parts[1]);
		if(num == 0 && denom == 0) { // for categories that have 0/0 points, don't calculate a NaN
			percent.text("N/A");
			return;
		}

		percent_num = ((num/denom) * 100).toFixed(1);
		percent_no_padding = parseFloat(percent_num); // remove trailing 0's, 100.0% looks ugly

		percent.text(percent_no_padding + "%");
		
	})
}

await_mcps_javascript_load()