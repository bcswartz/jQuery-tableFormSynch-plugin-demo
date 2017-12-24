/** jQuery tableFormSynch plugin
 * by Brian Swartzfager (http://www.swartzfager.org/blog/jQuery/plugins/tableFormSynch)
 * 
 * This is the documented version of the tableFormSynch plugin, meant to be used as a reference guide for this plugin
 * or for testing purposes.  When you use this plugin in production, you should used the minified version
 * (jquery.tableFormSynch.min.js).
 * 
 * --------------------------------------------------------------
 * What Does This Plugin Do
 * --------------------------------------------------------------
 * 
 * This plugin works in conjunction with the metadata plugin (http://plugins.jquery.com/project/metadata) to bind a 
 * table to a form such that you can populate the form with the data stored in a particular row and then use the form
 * to update the data and write it back to the row.  It also has functions for creating a new row based on the data
 * in the form, deleting a selected row, and clearing the form of all values.  It works with all form elements, including 
 * checkboxes, radio buttons, and <select>.
 * 
 * --------------------------------------------------------------
 * Plugin Requirements/Conventions
 * --------------------------------------------------------------
 * 
 * This plugin requires the use of the metadata plugin (http://plugins.jquery.com/project/metadata): it will not work without
 * it.  If you want to transmit any of the changes made to the data in the table (changes made via the form), you will
 * have to incorporate your own AJAX functions.  The jQuery Form plugin (http://malsup.com/jquery/form/) is an
 * excellent plugin for submitting data from an entire form to the server.
 * 
 * This plugin makes the following assumptions about the table and the form it (the plugin) is used for:
 * 
 * --That all HTML tags used in the form and the table are closed (ex. "<p>...</p>")
 * 
 * --That you use the <tbody> tag to enclose all of the data rows (all of the rows you want to use with the plugin) in the table.
 * 
 * --That each <tr> element has an id attribute, that the id value is unique for each row, and that that id value is represented in the metadata
 * for that <tr> element.
 * 
 * --That each <tr> element contains metadata for the row in key/value pairs that can be processed by the metadata() plugin (more details
 * on that in the "How to Code the Table and Form (By Example)" section below).
 * 
 * --That the key name of any key/value pair in the metadata that you want to update via the form has a matching form element whose
 * name attribute is the same as the key name in the metadata.
 * 
 * --That any HTML element within the row whose text needs to be updated to reflect changes made with the form has a CSS class that 
 * matches the name attribute of the form element that updates that data.
 * 
 * --That the HTML elements used to trigger the updateRow() and deleteRow() functions (be they hyperlinks, buttons, images, etc.) are
 * found inside of the row that those functions are supposed to act upon.
 * 
 * --------------------------------------------------------------
 * How to Code the Table and Form (By Example)
 * --------------------------------------------------------------
 * 
 * Coding the table and the form to work with the plugin isn't particularly difficult to do, but it is a bit hard to explain how to do it in an 
 * abstract fashion, so it's best to explain it via a simple example.
 * 
 * Say the table we want to generate is a simple employee listing based on data in our database.  We want the table to just show the 
 * employees' first names, last names, and e-mail addresses (so the table isn't too large), but we want to be able to update each 
 * employee's phone number, office address, a and a paragraph-length profile of the employee.
 * 
 * Most HTML tables that represent a dataset like the one in this example have their rows generated on the server side by looping through 
 * the dataset:
 * 
 * <table ...>
 * 		<tbody>
 * 			{Start of the loop code}
 * 				<tr>
 * 					<td>{Dataset field for the first name}</td>
 * 					<td>{Dataset field for the last name}</td>
 * 					<td><span class="makeItalic">{Dataset field for the email address}</span></td>
 *				</tr>
 *			{End of the loop code}
 *		</tbody>
 *	</table>
 *
 * ...In my server-side language of choice, CFML (ColdFusion Markup Language), the above code might look like this:
 * 
 * <table ...>
 * 		<tbody>
 * 			<cfoutput query="qryEmployees">
 * 				<tr>
 * 					<td>#qryEmployees.firstName#</td>
 * 					<td>#qryEmployees.lastName#</td>
 * 					<td><span class="makeItalic">#qryEmployees.email#</span></td>
 *				</tr>
 *			</cfoutput>
 *		</tbody>
 *	</table> 
 *
 * To use the plugin, all we need to do is store the data we want to work with within each table row as metadata and add class names to the 
 * HTML elements in each row that display data from the dataset, like so:
 * 
 * <table ...>
 * 		<tbody>
 * 			<cfoutput query="qryEmployees">
 * 				<tr id="#qryEmployees.uniqueIdNumber#" class="{uniqueIdNumber:#qryEmployees.uniqueIdNumber#,
 * firstName:'#qryEmployees.firstName#',lastName:'#qryEmployees.lastName#',email:'#qryEmployees.email#',
 * phone:'#qryEmployees.phone#',officeAddress:'#qryEmployees.officeAddress#',
 * profile:'#qryEmployees.profile#'}">
 * 					<td class="firstName">#qryEmployees.firstName#</td>
 * 					<td class="lastName">#qryEmployees.lastName#</td>
 * 					<td><span class="makeItalic email">#qryEmployees.email#</span></td>
 *				</tr>
 *			</cfoutput>
 *		</tbody>
 *	</table> 
 *
 * So two things have changed in the <tr> element:  the <tr> element has an id attribute whose value is the unique identifier for the 
 * employee's record (in this case, a number), and the <tr> has a class attribute that contains the metadata for the row (note: the
 * metadata() plugin gives you the option of storing the metadata somewhere other than in the class of an HTML element, but the class
 * is the default location).
 * 
 * If you want to know all the details about the metadata plugin, you'll need to consult the documentation for it 
 * (http://plugins.jquery.com/project/metadata), but the above example shows you most of what you need to know.  The metadata is coded
 * like a JavaScript object literal, with each piece of data having a key/name (like "firstName") and a value (like 
 * "#qryEmployees.firstName#").  String values must be enclosed in single quotes ('#qryEmployees.firstName#') while numeric values do
 * not (if the data could be either a string or a number, treat it as a string).
 * 
 * WARNING: Because of the use of single-quotes and double-quotes in the HTML code of the metadata, you have to make sure that
 * any single-quotes and double-quotes in the data itself are escaped/converted by server-side code so that they don't break the code:
 * 
 * Single-quote: '   --> convert to \'
 * Double-quote: " --> convert to &quot;
 *
 * The user won't notice the change because the \' and &quot; values will look like normal single- and double-
 * quotes in the form.
 * 
 * In CFML, for example, you can use two regular expression replacement statements to alter any and all quote marks in 
 * the "profile" data field before adding it to the metadata:
 * 
 * <table ...>
 * 		<tbody>
 * 			<cfoutput query="qryEmployees">
 * 					<cfset cleanProfile= REReplace(qryEmployees.profile,"'","\'","ALL")>
 * 					<cfset cleanProfile= REReplace(cleanProfile,Chr(34),'&quot;','ALL')>
 * 				<tr id="#qryEmployees.uniqueIdNumber#" class="{uniqueIdNumber:#qryEmployees.uniqueIdNumber#,
 * firstName:'#qryEmployees.firstName#',lastName:'#qryEmployees.lastName#',email:'#qryEmployees.email#',
 * phone:'#qryEmployees.phone#',officeAddress:'#qryEmployees.officeAddress#',
 * profile:'#cleanProfile#'}">
 * 					<td class="firstName">#qryEmployees.firstName#</td>
 * 					<td class="lastName">#qryEmployees.lastName#</td>
 * 					<td><span class="makeItalic email">#qryEmployees.email#</span></td>
 *				</tr>
 *			</cfoutput>
 *		</tbody>
 *	</table> 
 *
 * While not shown in the example, you can also store multiple values for a single key in the metadata by 
 * enclosing the multiple values in curly braces (with the same rules regarding string vs. numeric values).  Here's
 * an example using static data rather than variables:
 * 
 * ...class="{uniqueIdNumber:12,employeeSkills:{'Windows','Macintosh','Linux'},...}"...
 * 
 * You can update these multiple values via the plugin with a mutli-select <select> element or a group of
 * checkboxes in the form.
 * 
 * Getting back to the example...in addition to the changes to the <tr> element of each row, the HTML elements
 * in the row that display the data now each have a CSS class name that corresponds to the key name for that
 * value in the metadata (note where "firstName" appears):
 * 
 * <table ...>
 * 		<tbody>
 * 			<cfoutput query="qryEmployees">
 * 				<tr id="#qryEmployees.uniqueIdNumber#" class="{uniqueIdNumber:#qryEmployees.uniqueIdNumber#,
 * firstName:'#qryEmployees.firstName#'...}">
 * 					<td class="firstName">#qryEmployees.firstName#</td>
 * 					...
 *				</tr>
 *			</cfoutput>
 *		</tbody>
 *	</table> 
 *
 * By doing this, we create a link between the value in the metadata and the value displayed in the row, and the
 * plugin can update both of them when that piece of data is changed using the form.
 * 
 * Coding the form is pretty straightforward:  we simply need to have form elements that correspond to the data
 * in the metadata of each row:
 * 
 * <form id="demoForm" method="post" action="someOtherPage">
 * 		<input type="hidden" name="uniqueIdNumber" id="uniqueIdNumber" value="" />
 * 		<p>			
 *			<label id="lbl_firstName" for="firstName">First Name:</label>
 *			<input type="text" id="firstName" name="firstName" size="20" value="">
 *		</p>
 *		<p>
 *			<label id="lbl_lastName" for="lastName">Last Name:</label>
 *			<input type="text" id="lastName" name="lastName" size="20" value="">
 *		</p>
 *		<p>
 *			<label id="lbl_email" for="email">E-mail:</label>
 *			<input type="text" id="email" name="email" size="20" value="">
 *		</p>
 *		<p>
 *			<label id="lbl_phone" for="phone">Phone:</label>
 *			<input type="text" id="phone" name="phone" size="20" value="">
 *		</p>
 *		<p>
 *			<label id="lbl_officeAddress" for="officeAddress">Office Address:</label>
 *			<input type="text" id="officeAddress" name="officeAddress" size="100" value="">
 *		</p>
 *		<p>
 *			<label id="lbl_notes" for="profile">Profile:</label>
 *			<textarea name="profile" id="profile" rows="6" cols="50"></textarea>	
 *		</p>
 *		<p align="right">
 *			<input type="button" id="addBtn" name="addBtn" value="Add Employee" />
 *			<input type="button" id="updateBtn" name="updateBtn" value="Update Employee" />
 *		</p>
 * 
 * </form>
 * 
 * Note how the name attribute of each form input corresponds to a key name found in the metadata of each
 * row:  that's how the plugin knows how to populate the form with the data from the row, and how to update the 
 * row data (and the data displayed in each row) with the data from the form.
 * 
 * The plugin knows which row to update with the form data because the name of the form field that contains 
 * the unique id value of that row (in this case, "uniqueIdNumber") is passed in as a parameter in the
 * bindTableToForm() plugin function used to establish the link between the table and the form:
 * 
 * $("table").bindTableToForm($("#demoForm"),"uniqueIdNumber");
 * 
 * That's it!  Once you've set up your table and form in the described fashion and run the bindTableToForm()
 * function on the table, you can use the other plugin functions--populateForm(), updateRow(), deleteRow(),
 * clearForm(), and addRow(newRecordId)--to keep the table data and the form data in synch.  Each function is
 * documented in-line below.
 * 
 
 */

(function($) {

	$.fn.bindTableToForm = function(targetForm,primaryKeyName) {
		/* This function is used on the table you want to tie to the form.  It effectively binds the table to the
		 * form represented by the targetForm object and vice-versa.  The primaryKeyName is the name of the 
		 * form field that will hold the unique id value of the row whose data is being updated via the form.It also 
		 * loops through all of the rows in the table, reads the metadata stored in each row, and writes that data 
		 * back to each row using jQuery's data() function.*/
		
	   return this.each(function() {
	   		var $table= $(this);
			/* Binds the form to the table by associating the form object and primaryKeyName to the table
			 * using jQuery's data() function*/ 
			$table.data("targetForm",targetForm);
			$table.data("primaryKeyName",primaryKeyName);
			
			/* Binds the table to the form by associating the table object and primaryKeyName to the form
			 * using jQuery's data() function*/ 
			targetForm.data("targetTable",$table);
			targetForm.data("primaryKeyName",primaryKeyName);
			
	   		// Loops through each row in the table
			$table.find("tr").each(function() {
				// Extracts the metadata from the current row using the metadata() function of the metadata plugin
				var $row= $(this);
				var $rowData= $row.metadata();
				// The metadata is stored in key/value pairs.  This for loop loops through all of the keys in the metadata 
				for (var d in $rowData)
					{
							/* Copies the metadata for that key into the row's data collection using jQuery's 
							 * data function.  The original key name (represented by d) is retained.*/
							$row.data(d,$rowData[d]);
					}
		
				});
	   });
	};  //end of bindTableToForm function
	
	$.fn.populateForm = function() {
		/* This function is used on an HTML element (hyperlink, button, image, etc.) contained within a table cell in the table.  It 
		 * copies all of the data from the row it belongs to to the form elements with names that match the key names of the data.*/
		
		// Create variables for the row and the table.
		var $theRow= $(this).parents("td:first").parents("tr:first");
		var $theTable= $(this).parents("td:first").parents("tr:first").parents("table:first");
		// Retrieves the form object from the reference in the table's metadata.
		var $theForm= $theTable.data("targetForm");
		// Retrieves the collection of key names from the metadata of the row using the metadata() function of the metadata plugin.
		var $rowKeys= $(this).parents("td:first").parents("tr:first").metadata();
		
		// Clears the form of any previous data using the clearForm() function of this plugin
		$theForm.clearForm();
		
		// Loops through each key in the metadata of the row.
		for (var i in $rowKeys)
			{
  				/* Determines if the value of key is a JavaScript object.  JavaScript objects are used in the metadata to store
  				 * multiple values for a single key that can be represented as multiple selections in a multi-select select box or a 
  				 * series of checkboxes  or radio buttons on the form.
  				 */ 
				if (typeof($theRow.data(i))== "object")
  					{
  						// Copies the data associated with the current key to an array 
						var valueArray= $theRow.data(i);
						// Loops through the array
  						for (j=0;j < valueArray.length;j++)
  							{
  								/* Finds any select box in the form whose name attribute matches the key name (represented by i), then 
  								 * finds any <option> element in that select box with a value equal to the current value in valueArray 
  								 * and marks that <option> element as selected. */ 
								$theForm.find("select[name='" + i + "']").children("option[value='" + valueArray[j] + "']").attr("selected",true);
  														
								/* Finds any checkbox element in the form whose name attribute matches the key name (represented by i) and 
								 * whose value matches the current value in valueArray and marks that box as checked */
  								$theForm.find("input[type='checkbox'][name='" + i + "'][value='" + valueArray[j] + "']").attr("checked",true);
  							}
  						
  					}
					
				// If the value of the key is not an object, it is assumed to be a single value 	
  				else
  					{	
  
						/* Finds any text input element in the form whose name attribute matches the key name (represented by i) and
						 * changes the value of the element to match the value in the data. */
  						$theForm.find("input[type='text'][name='" + i + "']").val($theRow.data(i));
						
						/* Finds any password input element in the form whose name attribute matches the key name (represented by i) and
						 * changes the value of the element to match the value in the data. */
						$theForm.find("input[type='password'][name='" + i + "']").val($theRow.data(i));
						
						/* Finds any hidden input element in the form whose name attribute matches the key name (represented by i) and
						 * changes the value of the element to match the value in the data. */
  						$theForm.find("input[type='hidden'][name='" + i + "']").val($theRow.data(i));
						
						/* Finds any textarea element in the form whose name attribute matches the key name (represented by i) and
						 * changes the value of the element to match the value in the data. */
						$theForm.find("textarea[name='" + i + "']").val($theRow.data(i));
						
						/* Finds any select box in the form whose name attribute matches the key name (represented by i), then 
  						 * finds any <option> element in that select box with a value equal to the value in the data 
  						 * and marks that <option> element as selected. */ 
  						$theForm.find("select[name='" + i + "']").children("option[value='" + $theRow.data(i) + "']").attr("selected",true);
						
						/* Finds any radio button in the form whose name attribute matches the key name (represented by i) and 
						 * whose value matches the value in the data and marks that box as checked */
  						$theForm.find("input[type='radio'][name='" + i + "'][value='" + $theRow.data(i) + "']").attr("checked",true);
  						
						/* Finds any checkbox element in the form whose name attribute matches the key name (represented by i) and 
						 * whose value matches the value in the data and marks that box as checked */	
						$theForm.find("input[type='checkbox'][name='" + i + "'][value='" + $theRow.data(i) + "']").attr("checked",true);
  					}
		  				
			}
		
	};  //end of populateForm function
	
	
	$.fn.updateRow = function() {
		/* This function is used on the form.  It copies the data from the form back to the matching row, updating both the metadata for the row as well as the text 
		 * in any HTML element in the cells of the row that has a CSS class that matches the name of a form element.*/
		
		var $theForm= $(this);
		// Finds the form element that stores as its value the id of the matching row in the table and stores it as the rowId variable
		var rowId= $theForm.find("[name=  '" + $theForm.data("primaryKeyName") + "']").val();
		
		// Retrieves the collection of key names from the metadata of the row using the metadata() function of the metadata plugin.
		var $rowKeys= $("#" + rowId).metadata();
		
		// Create a jQuery object  for the row
		var $row= $("#" + rowId);
		
		// Loops through each key in the metadata of the row.
		for (var i in $rowKeys)
			{
				// Indicator of whether or not the key matches a form element that could provide multiple values
				multiValue= false;
				
				/* Creates an array object to hold the data if the form element contains multiple values (checkboxes or mulit-select 
				 * select boxes) */
				dataArray= new Array;
				
				/* Finds any HTML element in the row with a class name equal to the current key name, and updates the text
				 * of that element with the value of the text input in the form whose name also matches the current key name.  The 
				 * data for the row is then updated with the value of the form element.*/
				$row.find("[class*= '" + i + "']").text($theForm.find("input[type='text'][name= '" + i + "']").val());
				$row.data(i,$theForm.find("input[type='text'][name= '" + i + "']").val());
				
				/* Finds any HTML element in the row with a class name equal to the current key name, and updates the text
				 * of that element with the value of the password input in the form whose name also matches the current key name.  The 
				 * data for the row is then updated with the value of the form element.*/
				$row.find("[class*= '" + i + "']").text($theForm.find("input[type='password'][name= '" + i + "']").val());
				$row.data(i,$theForm.find("input[type='password'][name= '" + i + "']").val());
				 
				 /* Finds any HTML element in the row with a class name equal to the current key name, and updates the text
				 * of that element with the value of the hidden input in the form whose name also matches the current key name.  The 
				 * data for the row is then updated with the value of the form element.*/
				$row.find("[class*= '" + i + "']").text($theForm.find("input[type='hidden'][name= '" + i + "']").val());
				$row.data(i,$theForm.find("input[type='hidden'][name= '" + i + "']").val());
				 
				 /* Finds any HTML element in the row with a class name equal to the current key name, and updates the text
				 * of that element with the value of checked radio button in the form whose name also matches the current key name.  The 
				 * data for the row is then updated with the value of the form element.*/
				$row.find("[class*= '" + i + "']").text($theForm.find(":checked[type='radio'][name= '" + i + "']").val());
				$row.data(i,$theForm.find(":checked[type='radio'][name= '" + i + "']").val());
				
				 /* Finds any HTML element in the row with a class name equal to the current key name, and updates the text
				 * of that element with the value of the textarea in the form whose name also matches the current key name.  The 
				 * data for the row is then updated with the value of the form element.*/
				$row.find("[class*= '" + i + "']").text($theForm.find("textarea[name= '" + i + "']").val());
				$row.data(i,$theForm.find("textarea[name= '" + i + "']").val());
				
				/* If there are one or more checkboxes with a name that matches the current key name, find the checked ones and
				 * store the value of each one in dataArray*/
				if($theForm.find("input[name= '" + i + "']").is("input[type='checkbox']"))
					{
						multiValue= true;
						$theForm.find(":checked[type='checkbox'][name= '" + i + "']").each(function() {
							dataArray.push($(this).val());
						});
					}
				
				/* If there is a select box with a name that matches the current key name, find the selected <option> children of that 
				 * select box and store the value of each selected option in dataArray. */
				if($theForm.find("select[name= '" + i + "']").is("select"))
					{
						multiValue= true;
						$theForm.find("select[name= '" + i + "']").children(":selected").each(function() {
							dataArray.push($(this).val());
						});
					}
					
				// If multiValue is true, update the data for the row with the dataArray.
				if(multiValue)
					{
						$row.data(i,dataArray);
						//Reset multiValue
						multiValue= false;
					}
							
			}
		 
	}; //end of $.fn.updateRow function
	
	
	$.fn.deleteRow = function() {
		/* This function is used on an HTML element (hyperlink, button, image, etc.) contained within a table cell in the table.  It 
		 * deletes the row it belongs to from the table.  If the row's data is present in the form, the clearForm() function will be
		 * called to empty out the form.*/
		
		// Create variables for the row and the table.
		var $theRow= $(this).parents("td:first").parents("tr:first");
		var $theTable= $(this).parents("td:first").parents("tr:first").parents("table:first");
		
		// Retrieves the form object from the reference in the table's metadata.
		var $theForm= $theTable.data("targetForm");
		
		// Finds the form element that stores as its value the id of the matching row in the table and stores it as the rowId variable
		var rowId= $theForm.find("[name=  '" + $theForm.data("primaryKeyName") + "']").val();
		
		// Sets the initial value of mustClearForm to false.
		var mustClearForm= false;
		
		// If the value retrieved from the form matches the id value of the row to be deleted, set mustClearForm to true
		if (rowId== $theRow.attr("id"))
			{
				mustClearForm= true;
			}
		
		// Remove/delete the row using jQuery's remove() function
		$theRow.remove();	
		
		// If mustClearForm is true, run the clearForm() function of this plugin
		if (mustClearForm)
			{
				$theForm.clearForm();
			}	
			
	}; //end of $.fn.deleteRow function
	
	$.fn.clearForm = function() {
		/* This function is used on the form whose data needs to be cleared.  It unchecks all checkboxes and radio buttons, 
		 * un-selects all select options, and empties the values of all other form elements.*/
		 return this.each(function() {
		 	var $theForm= $(this);
			$theForm.find(":checked").attr("checked",false);
			$theForm.find(":selected").attr("selected",false);
			$theForm.find("input[type='text']").val("");
			$theForm.find("input[type='password']").val("");
			$theForm.find("input[type='hidden']").val("");
			$theForm.find("textarea").val("");
		 });
		
	};
	
	$.fn.addRow= function(recordId) {
		/* This function is used on the form.  It takes the recordId submitted with the function to use as the id attribute value of the 
		 * new table row it creates at the end of the table.  The new row is created by cloning the first row in the tbody element of
		 * the table and then changing its metadata using the values of the form.  Even though the original metadata hardcoded
		 * in the row is unchanged, the key names in the metadata are still correct, allowing the added row to be edited just like an
		 * original row. */

		// Create variables for the row and the table.
		var $theForm= $(this);
		var $targetTable= $theForm.data("targetTable");
		
		// Create a jQuery object from the first row in the table
		var $templateRow= $targetTable.find("tbody > tr:first");
		
		// Create a clone of the row
		var $clonedRow= $templateRow.clone(true);
		
		// Change the id attribute value of the cloned row to the value of the recordId parameter
		$clonedRow.attr("id",recordId);
		
		/* Update the form element in the form whose name matches the value of the primaryKeyName value stored in the form's
		 * data with the value of the recordId parameter (so you have the option of editing the newly-added record).*/
		$theForm.find("[name=  '" + $theForm.data("primaryKeyName") + "']").val(recordId);
		
		//Append the cloned row to the table
		$targetTable.children("tbody").append($clonedRow);
		
		// Run the updateRow() function in this plugin			
		$theForm.updateRow();
	
	}; //end of $.fn.addRow function
	
	
})(jQuery);


