	  
	 
	 function showPage(pageId) {
		// Hide all pages
		document.querySelectorAll('.page').forEach(function (page) {
		  page.style.display = 'none';
		});
  
		// Show the selected page
		document.getElementById(pageId).style.display = 'block';
	  }
  
	  function submitFiles() {
		// Implement file submission logic here
		alert("Files submitted successfully!");
		// Show the "Next" button after submitting files (assuming it's on page 3)
		showPage('page4');
	  }
  
	  function updateDocumentList() {
		var rolesDropdown = document.getElementById("rolesDropdown");
		var selectedRole = rolesDropdown.options[rolesDropdown.selectedIndex].value;
		var documentListContainer = document.getElementById("documentList");
  
		// Define document lists for each role
		var documentLists = {
		  Role1: ["Doc A", "Doc B", "Doc C", "Doc D", "Doc E", "Doc F", "Doc G", "Doc H"],
		  Role2: ["Doc I", "Doc J", "Doc K", "Doc L", "Doc M", "Doc N", "Doc O", "Doc P"],
		  Role3: ["Doc Q", "Doc R", "Doc S", "Doc T", "Doc U", "Doc V", "Doc X", "Doc Z"],
		  Role4: ["Doc AA", "Doc BB", "Doc CC", "Doc DD", "Doc EE", "Doc FF", "Doc GG", "Doc HH"],
		  Role5: ["Doc AB", "Doc BC", "Doc CD", "Doc DE", "Doc EF", "Doc FG", "Doc GH", "Doc HI"],
		  Role6: ["Doc A,Q", "Doc BW", "Doc CM", "Doc DT", "Doc ES", "Doc FW", "Doc GS", "Doc HZ"],
		  Role7: ["Doc AT", "Doc BQ", "Doc CS", "Doc DO", "Doc EY", "Doc FI", "Doc GY", "Doc HY"],
		  Role8: ["Doc A1", "Doc B1", "Doc C1", "Doc D1", "Doc E1", "Doc F1", "Doc G1", "Doc H1"],
		  Role9: ["Doc A0", "Doc B0", "Doc C0", "Doc D0", "Doc E0", "Doc F0", "Doc G0", "Doc H0"],
		  Role10: ["Doc AQ", "Doc BQ", "Doc CQ", "Doc DQ", "Doc EQ", "Doc FQ", "Doc GQ", "Doc HQ"]
		};
  
		// Clear existing document list
		documentListContainer.innerHTML = "";
  
		// Populate document list based on selected role
		var documents = documentLists[selectedRole];
		for (var i = 0; i < documents.length; i++) {
		  var documentItem = document.createElement("p");
		  documentItem.textContent = documents[i];
		  documentListContainer.appendChild(documentItem);
		}
	  }
  
	  // Initially show the first page
	  document.addEventListener('DOMContentLoaded', function () {
		showPage('page1');
	  });
