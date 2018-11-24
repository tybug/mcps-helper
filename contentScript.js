function await_mcps_javascript_load() {
	var timer = setInterval(check_condition, 10);
	
    function check_condition() {
    // 	console.log($(".ng-binding"))
	// console.log($(".ng-scope"))
	// arbitrary condition where both the grade page and the home page are under when unloaded, but over when loaded
        if ($(".ng-binding").length > 7) { 
            clearInterval(timer);
            main()
        }
    }
}

COLOR_A = "#59e22b"; // green
COLOR_B = "#2ba9f2"; // blue
COLOR_C = "#fcf91e"; // yellow
COLOR_D = "#ff7700"; // orange
COLOR_E = "#ff2600"; // red
COLOR_X = "#939393"; // dark(er) grey
COLOR_EMPTY = "#cfd6d4"; // light grey
COLOR_EXTENSION = "#e0dbff"; // very light blue/purple

function main(){

	$("td.ng-binding, td.ng-scope").each(function(){
		text = $(this).text().trim();
		color = null;
		switch(text){
		case "A":
			color = COLOR_A;
			break;
		case "B":
			color = COLOR_B;
			break;
		case "C":
			color = COLOR_C;
			break;
		case "D":
			color = COLOR_D;
			break;
		case "Z":
		case "E":
			color = COLOR_E;
			break;
		case "NG":
		case "X":
			color = COLOR_X;
			break;
		case "":
			color = COLOR_EMPTY;
			break;
		}
		// don't change color for % or Score column
		if(!["%", "Score"].includes($(this).closest('table').find('th').eq($(this).index())[0].innerHTML)) {
			$(this).css("backgroundColor", color);
		}

 		// percent column itself gets selected to change color, so don't select the sibling's sibling of that, which is the assignment title
		if(["#cfd6d4", null].includes(color)){
			return;
		}
		percent_cell = $(this).prev();
		score = percent_cell.prev().text().trim();
		// credit to https://stackoverflow.com/a/3523794 for finding th from td
		// don't calculate percent if it's the main page Letters, or the Current Grade Letters (gives NaN answers)
		if(["Course", "MP1", "MP2", "MP3", "Current Grade %"].includes(percent_cell.closest('table').find('th').eq(percent_cell.index())[0].innerHTML)) {
			return;
		}

		parts = score.split("/");
		num = parseFloat(parts[0]); // float so we don't lose any precision for decimal grades
		denom = parseFloat(parts[1]);
		grade = calculateGradePercent(num, denom);

		if(grade == "N/A"){
			percent_cell.text(grade);
			return;
		}

		percent_cell.text(grade + "%");

			
	})

	// select the third table, add a new row for testing assignments
	$(".grid:eq(2)")
	.append(`<tr>
				<td class="ng-binding" style="background-color: ` + COLOR_EXTENSION + `;">Enter a new assignment</td>
				<td class="ng-binding" width="350px" style="background-color: ` + COLOR_EXTENSION + `;">Select category: 
					<select>
						<option>Summative (50)</option>
						<option>Formative (40)</option>
						<option>HW for Prac/Prep (10)</option>
					</select
				</td>
				<td class="ng-binding" style="background-color: ` + COLOR_EXTENSION + `;"></td>
				<td class="text-right" width="122px" style="background-color: ` + COLOR_EXTENSION + `;">
					<input type="text" size="5.5px" id="num"> / <input type="text" size="5.5px" id="denom">
				</td>
				<td class="text-right ng-binding" width="80px"></td>
				<td class="text-center ng-binding" style="background-color: rgb(207, 214, 212);"></td>
			</tr>`);
	
		$("#num, #denom").on("input", updateGrades)
}

function calculateGradePercent(num, denom){
	// returns num/denom, accurate to one decimal point, with trailing zeroes removed
	// returns N/A if both num and denom are zero

	if(num == 0 && denom == 0) { // for categories that have 0/0 points, don't calculate a NaN
		return "N/A";
	}

	percent_num = ((num/denom) * 100).toFixed(1);
	percent_no_padding = parseFloat(percent_num); // remove trailing 0's, 100.0% looks ugly
	return percent_no_padding;
}


function updateGrades(){
	num = $("#num").val();
	denom = $("#denom").val();
	percent_cell = $("#num").parent().next();
	grade_cell = percent_cell.next();

	grade = calculateGrade(num, denom);
	color_data = calculateColorData(grade);
	color = color_data[0]
	grade_letter = color_data[1]

	if(grade == "Infinity" || grade == "N/A"){ // reset back to nothing, or don't display anything to start with. Happens with num = 1, denom = 0
		grade = "";
		grade_letter = "";
		color = COLOR_EMPTY;
	}


	percent_cell.text(grade ? grade + "%" : grade); // don't add the percent sign if grade is empty
	grade_cell.text(grade_letter)
	grade_cell.css("backgroundColor", color);
}

function calculateColorData(grade){
	// returns [backgroundColor, gradeLetter] based on the given percentage grade
	if(grade >= 89.45){
		return [COLOR_A, "A"];
	} else if(grade >= 79.45){
		return [COLOR_B, "B"];
	} else if(grade >= 69.45){
		return [COLOR_C, "C"];
	} else if(grade >= 59.45){
		return [COLOR_D, "D"];
	} else {
		return [COLOR_E, "E"];
	}
}

await_mcps_javascript_load()