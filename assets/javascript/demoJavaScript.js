/**
 * tableFormSynch Demo JavaScript functions
 */

$(document).ready(function() {
	/* Global var to allow this demo file to "fake" the creation of a new unique record 
	* ID (something normally done server-side), */
	var newIdCounter= 10;
	
	// The form starts in "Add" mode, so hide the update button.
	$("#updateBtn").hide();
	
	//Bind the table to the form using the plugin's bindTableToForm function'
	$("#demoTable").bindTableToForm($("#demoForm"),"personId");
	
	/* Whenever a hyperlink with the editRecord class is clicked, the metadata in the row containing that link will 
	 * populate the form*/
	$("a.editRecord").click(function() {
		//Alter the form for performing an update
		$("#demoForm legend").text("Edit Staff Member");
		$("#addBtn").hide();
		$("#updateBtn").show();
		
		//Call the plugin's populateForm function
		$(this).populateForm();
		
		//Make sure you disable/interrupt the normal hyperlink processing so you don't go to another page
		return false;
	});
	
	//Rewrite the form data back to the row's metadata using the plugin's updateRow function
	$("#updateBtn").click(function() {
		/* In normal production use, you would want to validate the form data, upload the changes to the
		 * server using AJAX, and confirm the success of the operation before you run the plugin's
		 * updateRow() function.  The jQuery Form plugin (http://malsup.com/jquery/form/) is an
 		 * excellent plugin for submitting data from an entire form to the server. */
		$("#demoForm").updateRow();
	});
	
	//Create a new row/record using the plugin's addRow function
	$("#addBtn").click(function() {
		/* This demo uses the newIdCounter variable to take the place of a unique ID number that would
		 * normally be returned by the server after a successful AJAX call that adds the record to the 
		 * database
		 *
		 * As with the update function, you would want to validate the form data, upload the changes to the
		 * server using AJAX, and confirm the success of the operation before you run the plugin's addRow()
		 * function */
		$("#demoForm").addRow(newIdCounter);
		
		// Since the demo uses a fake ID number, it needs to be incremented.
		newIdCounter= newIdCounter+1;
		
		// Change the form to "Edit" mode
		$("#demoForm legend").text("Edit Staff Member");
		$("#addBtn").hide();
		$("#updateBtn").show();
		
	});
	
	
	/* Whenever a hyperlink with the addRecord class is clicked, clear the current form values to
	 * prepare for a new record. */
	$("a.addRecord").click(function() {
		// Change the form to "Add" mode
		$("#demoForm legend").text("Add Staff Member");
		$("#updateBtn").hide();
		$("#addBtn").show();
		
		//Call the plugin's clearForm function on the form
		$("#demoForm").clearForm();
		//Make sure you disable/interrupt the normal hyperlink processing so you don't go to another page
		return false;
	});
	
	//Whenever a hyperlink with the deleteRecord class is clicked, the current row will be deleted.
	$("a.deleteRecord").click(function() {
		/* In normal production use, you would want to make an AJAX call to submit the record's unique ID to
		 * the server so it can be deleted and confirm the success of the deletion before you call the plugin's 
		 * deleteRow() function. */
		$(this).deleteRow();
		
		/* If the form has been cleared (because the data in the form was from the deleted row), change the
		 * form to "Add" mode. */
		if ($("#demoForm").find("input[type='hidden']").val()== "")
			{
				$("#demoForm legend").text("Add Staff Member");
				$("#updateBtn").hide();
				$("#addBtn").show();
			}
		//Make sure you disable/interrupt the normal hyperlink processing so you don't go to another page
		return false;
	});
	
});


