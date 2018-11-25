function await_mcps_javascript_load() {
	var timer = setInterval(check_condition, 10);
	
	function check_condition() {
		// console.log($(".ng-binding"))
		// console.log($(".ng-scope"))
		// arbitrary condition where both the grade page and the home page are under when unloaded, but over when loaded
        if ($(".ng-binding").length > 7) { 
            clearInterval(timer);
            main();
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

var grade_info = []; // [[weight, num, denom], ...]


function main(){

	updateColors();

	// select the third table, add a new row for testing assignments
	$(".grid:eq(2)")
	.append(`<tr>
				<td class="ng-binding" style="background-color: ` + COLOR_EXTENSION + `;">Enter a new assignment</td>
				<td class="ng-binding" width="350px" style="background-color: ` + COLOR_EXTENSION + `;">Select category: 
					<select id="category-select">
						
					</select
				</td>
				<td style="background-color: ` + COLOR_EXTENSION + `;"></td>
				<td class="text-right" width="122px" style="background-color: ` + COLOR_EXTENSION + `;">
					<input type="text" size="5.5px" id="num"> / <input type="text" size="5.5px" id="denom">
				</td>
				<td class="text-right" width="80px"></td>
				<td class="text-center" style="background-color: rgb(207, 214, 212);"></td>
			</tr>`);
	
	$("#num, #denom").on("input", updateGrades);
	$("#category-select").on("change", updateGrades);


	// Get the categories and their weights from the second table, then add them to the input button we just created
	$(".grid:eq(1)").find("tr td:nth-child(2)").each(function(index){
		$("#category-select").append("<option value=" + index + ">" + $(this).prev().text().trim() + "</option>");
		parts = $(this).next().text().trim().split("/");
		grade_info.push([$(this).text().trim(), parts[0], parts[1]]);
	});
}

function updateColors(){
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

			
	});
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

	grade = calculateGradePercent(num, denom);
	color_data = calculateColorData(grade);
	if(color_data != null){
		color = color_data[0];
		grade_letter = color_data[1];
	}

	if(grade == "Infinity" || grade == "N/A"){ // reset back to nothing, or don't display anything to start with. Happens with num = 1, denom = 0
		grade = "";
		grade_letter = "";
		color = COLOR_EMPTY;
	}

	num = parseFloat(num);
	denom = parseFloat(denom);
	percent_cell.text(grade ? grade + "%" : grade); // don't add the percent sign if grade is empty
	grade_cell.text(grade_letter);
	grade_cell.css("backgroundColor", color);

	index = $("#category-select").val();
	updated_grades = grade_info.slice();
	updated_grades[index] = [updated_grades[index][0], parseFloat(updated_grades[index][1]) + num, parseFloat(updated_grades[index][2]) + denom]; // add test grade values

	weighted_grade = 0;
	for (var i = 0; i < updated_grades.length; i++) {
		num_category = parseFloat(updated_grades[i][1]);
		denom_category = parseFloat(updated_grades[i][2]);

		// console.log(num_category);
		// console.log(denom_category);
		// if a category has no points yet, its weight doesn't matter, so assume 100% in that category.
		// TODO THIS LOGIC IS WRONG!! RESULTS IN MUCH HIGHER GRADES THAN EXPECTED. We could give the remaining weight
		// of an NG category to a category that does have a grade, but what happens if two categories are graded
		// and one is NG? To which category does the extra weights go?
		if(denom_category == 0) {  
			num_category = 100; 
			denom_category = 100;  
		} 
		unweighted = ( num_category / denom_category);
		// console.log(unweighted);
		weighted_grade +=  unweighted * parseFloat(updated_grades[i][0]);
		// console.log(weighted_grade);
	}

	current_grade_letter = $(".grid:eq(0)").find("tr:first-child td:last-child"); // last cell of first row in first table
	color_data = calculateColorData(weighted_grade);
	if(color_data == null){
		return;
	}
	current_grade_letter.text(color_data[1]);
	current_grade_letter.css("backgroundColor", color_data[0])
	current_grade_letter.prev().text(parseFloat(weighted_grade.toFixed(1)) + "%"); // previous cell is the current grade percent

	updateColors();
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
	} else if(grade < 59.45){
		return [COLOR_E, "E"];
	}
	return null;
}

await_mcps_javascript_load()