/** jQuery tableFormSynch plugin
 * by Brian Swartzfager (http://www.swartzfager.org/blog/jQuery/plugins/tableFormSynch)
 */

(function($) {

	$.fn.bindTableToForm = function(targetForm,primaryKeyName) {
		 return this.each(function() {
	   		var $table= $(this);
			$table.data("targetForm",targetForm);
			$table.data("primaryKeyName",primaryKeyName);
			targetForm.data("targetTable",$table);
			targetForm.data("primaryKeyName",primaryKeyName);
			
	   		$table.find("tr").each(function() {
				var $row= $(this);
				var $rowData= $row.metadata();
				for (var d in $rowData)
					{
							$row.data(d,$rowData[d]);
					}
		
				});
	   });
	};  
	
	$.fn.populateForm = function() {
		var $theRow= $(this).parents("td:first").parents("tr:first");
		var $theTable= $(this).parents("td:first").parents("tr:first").parents("table:first");
		var $theForm= $theTable.data("targetForm");
		var $rowKeys= $(this).parents("td:first").parents("tr:first").metadata();
		
		$theForm.clearForm();
		
		for (var i in $rowKeys)
			{
  				if (typeof($theRow.data(i))== "object")
  					{
  						var valueArray= $theRow.data(i);
						for (j=0;j < valueArray.length;j++)
  							{
  								$theForm.find("select[name='" + i + "']").children("option[value='" + valueArray[j] + "']").attr("selected",true);
  								$theForm.find("input[type='checkbox'][name='" + i + "'][value='" + valueArray[j] + "']").attr("checked",true);
  							}
  						
  					}
				else
  					{	
  						$theForm.find("input[type='text'][name='" + i + "']").val($theRow.data(i));
						$theForm.find("input[type='password'][name='" + i + "']").val($theRow.data(i));
						$theForm.find("input[type='hidden'][name='" + i + "']").val($theRow.data(i));
						$theForm.find("textarea[name='" + i + "']").val($theRow.data(i));
						$theForm.find("select[name='" + i + "']").children("option[value='" + $theRow.data(i) + "']").attr("selected",true);
						$theForm.find("input[type='radio'][name='" + i + "'][value='" + $theRow.data(i) + "']").attr("checked",true);
  						$theForm.find("input[type='checkbox'][name='" + i + "'][value='" + $theRow.data(i) + "']").attr("checked",true);
  					}
		  				
			}
		
	};  
	
	
	$.fn.updateRow = function() {
		var $theForm= $(this);
		var rowId= $theForm.find("[name=  '" + $theForm.data("primaryKeyName") + "']").val();
		var $rowKeys= $("#" + rowId).metadata();
		var $row= $("#" + rowId);
		
		for (var i in $rowKeys)
			{
				multiValue= false;
				dataArray= new Array;
				
				$row.find("[class*= '" + i + "']").text($theForm.find("input[type='text'][name= '" + i + "']").val());
				$row.data(i,$theForm.find("input[type='text'][name= '" + i + "']").val());
				$row.find("[class*= '" + i + "']").text($theForm.find("input[type='password'][name= '" + i + "']").val());
				$row.data(i,$theForm.find("input[type='password'][name= '" + i + "']").val());
				$row.find("[class*= '" + i + "']").text($theForm.find("input[type='hidden'][name= '" + i + "']").val());
				$row.data(i,$theForm.find("input[type='hidden'][name= '" + i + "']").val());
				$row.find("[class*= '" + i + "']").text($theForm.find(":checked[type='radio'][name= '" + i + "']").val());
				$row.data(i,$theForm.find(":checked[type='radio'][name= '" + i + "']").val());
				$row.find("[class*= '" + i + "']").text($theForm.find("textarea[name= '" + i + "']").val());
				$row.data(i,$theForm.find("textarea[name= '" + i + "']").val());
				if($theForm.find("input[name= '" + i + "']").is("input[type='checkbox']"))
					{
						multiValue= true;
						$theForm.find(":checked[type='checkbox'][name= '" + i + "']").each(function() {
							dataArray.push($(this).val());
						});
					}
				if($theForm.find("select[name= '" + i + "']").is("select"))
					{
						multiValue= true;
						$theForm.find("select[name= '" + i + "']").children(":selected").each(function() {
							dataArray.push($(this).val());
						});
					}
				if(multiValue)
					{
						$row.data(i,dataArray);
						multiValue= false;
					}	
			}

	}; 
	
	$.fn.deleteRow = function() {
		var $theRow= $(this).parents("td:first").parents("tr:first");
		var $theTable= $(this).parents("td:first").parents("tr:first").parents("table:first");
		var $theForm= $theTable.data("targetForm");
		var rowId= $theForm.find("[name=  '" + $theForm.data("primaryKeyName") + "']").val();
		var mustClearForm= false;
		if (rowId== $theRow.attr("id"))
			{
				mustClearForm= true;
			}
		$theRow.remove();	
		if (mustClearForm)
			{
				$theForm.clearForm();
			}	
			
	}; 
	
	$.fn.clearForm = function() {
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
		var $theForm= $(this);
		var $targetTable= $theForm.data("targetTable");
		var $templateRow= $targetTable.find("tbody > tr:first");
		var $clonedRow= $templateRow.clone(true);
		$clonedRow.attr("id",recordId);
		$theForm.find("[name=  '" + $theForm.data("primaryKeyName") + "']").val(recordId);
		$targetTable.children("tbody").append($clonedRow);
		$theForm.updateRow();
	
	}; 
	
	
})(jQuery);


