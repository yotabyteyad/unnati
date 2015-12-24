app.controller("createPurchaseInvoiceCtrl", function ($location, $scope, PurchaseInvoiceFactory, $timeout){
	//TODO

	//Test Purchase Invoi
	$scope.purchaseInvoiceModel = {};
	$scope.purchaseInvoiceModel.date = new Date();//global_currentDate;
	console.log($scope.purchaseInvoiceModel.date);
	$scope.purchaseInvoiceModel.gross_amount = 0;
	$scope.purchaseInvoiceModel.net_amount = 0;
	$scope.purchaseInvoiceModel.discount_amt = 0;

	$scope.purchaseInvoiceModel.items = [];

	$scope.purchaseInvoiceModel.items.push({
	         purchase_item_master_id:undefined,
           item_barcode:undefined,
           item_name:undefined,
           purchase_item_purchase_qty:0,
           purchase_item_costprice:0,
           item_salesprice: 0,
           item_tax_per: 0
	         });						


	$scope.dummypurchaseInvoiceModel = {"items":[{"itemname":"dojo","quantity":"1","sch":false,
														"mfg":"","batch":"","expdate":"","price":100,"amount":""},
																		{"itemname":"crocin","quantity":"2","sch":false,
														"mfg":"","batch":"","expdate":"","price":100,"amount":""},
																		{"itemname":"allegra","quantity":"3","sch":false,
														"mfg":"","batch":"","expdate":"","price":100,"amount":""},
																		{"itemname":"Nasomist","quantity":"4","sch":false,
														"mfg":"","batch":"","expdate":"","price":100,"amount":""},
														       ],
													"date":"12/11/2015",
													"patient":"TestP",
													"doctor":"TestDoc",
													"discount":"100"};




	$scope.addItem = function(){
		//$scope.purchaseInvoiceModel.date = global_currentDate;
		//Add blank row only if there are less than 1 blank row remaining
		//no point in adding blank rows if 2 of them already exists
		//console.log($scope.purchaseInvoiceModel);
		var blank = 0;
		for(count=0;count < $scope.purchaseInvoiceModel.items.length;count++){
			if($scope.purchaseInvoiceModel.items[count].item_name === undefined) {
				blank += blank + 1
			}			
		}

		if(blank == 0){
			$scope.purchaseInvoiceModel.items.push({
	         purchase_item_master_id:undefined,
           item_barcode:undefined,
           item_name:undefined,
           purchase_item_purchase_qty:0,
           purchase_item_costprice:0,
           item_salesprice: 0,
           item_tax_per: 0
	         });						
		}
		//console.log($scope.purchaseInvoiceModel.items);
	}


	$scope.removeItem = function(item){
		$scope.purchaseInvoiceModel.items.splice($scope.purchaseInvoiceModel.items.indexOf(item),1);
	}


	$scope.totalPrice = function(){
			var subtotal = 0;
			for(count=0;count<$scope.purchaseInvoiceModel.items.length;count++){
				subtotal += (($scope.purchaseInvoiceModel.items[count].purchase_item_costprice || 0) * ($scope.purchaseInvoiceModel.items[count].purchase_item_purchase_qty || 0));
			}
			$scope.purchaseInvoiceModel.gross_amount = subtotal;
			$scope.purchaseInvoiceModel.net_amount = subtotal - $scope.purchaseInvoiceModel.discount_amt;
			return subtotal;
	};

	$scope.grandTotal = function(){
			var grandtotal = 0;
			grandTotal = (($scope.totalPrice() || 0) - ($scope.purchaseInvoiceModel.discount_amt || 0));
			// $scope.purchaseInvoiceModel.net_amount = grandTotal() || 0;
			//$scope.purchaseInvoiceModel.net_amount = grandtotal;
			console.log(grandTotal);
			return grandtotal;
	};


//PurchaseInvoiceFactory

		$scope.createPurchaseInvoice = function(){

		PurchaseInvoiceFactory.create($scope.purchaseInvoiceModel)
		.success(function(response){
					console.log('PurCtrl', response);
					toastr.success('Purchase Invoice added successfully');	
				// 	$timeout(function(){
				// 	console.log('TO');														
				// 	$location.url("/supplierlist");
				// }, 3000);
					setTimeout("location.reload(true);", 600);						
		})
		.error(function(){
			console.log('Error while adding the Purchase Invoice');
			toastr.error('<b>Seems there is an issue </b>');
		});
};






	var item_row = {};

	data_interlink = function(selectedRecord, index){
			item_row = selectedRecord;
			//console.log(selectedRecord);
			//console.log('Interlink ---');
			$scope.purchaseInvoiceModel.items[index].purchase_item_master_id = selectedRecord.id;
			$scope.purchaseInvoiceModel.items[index].item_barcode = selectedRecord.item_barcode;
			$scope.purchaseInvoiceModel.items[index].item_name = selectedRecord.item_name;
			$scope.purchaseInvoiceModel.items[index].item_salesprice = selectedRecord.item_salesprice;
			$scope.purchaseInvoiceModel.items[index].item_tax_per = selectedRecord.item_tax_per;
			//console.log($scope.purchaseInvoiceModel.items[index]);
	}

	$('#supplier_name').autocomplete({
		      	source: function( request, response ) {
		      		$.ajax({
		      			url : 'suppliers',
		      			dataType: "json",
						data: {
						   q: request.term
						},
						 success: function(data) {
						 		//console.log('Hello', data);
							 response( $.map( data, function( supplier ) {
								//console.log(supplier);
								return {
									label: supplier.name,
									value: supplier.name,
									id: supplier.id
								}
							}));
						}
		      		});
		      	},
		      	autoFocus: true,
		      	minLength: 0,
		      	select: function( event, ui ) {
		      						//console.log(ui.item);
											// var names = ui.item.data.split(",");						
											//$('#id').val(ui.item.id);
											$scope.purchaseInvoiceModel.supplier_id = ui.item.id;
											$scope.purchaseInvoiceModel.name  = ui.item.value; //this is wrong, i was trying something
											$scope.$apply();
										}      	
		      });
		      												

});

//autocomplete script
$(document).on('focus','.autocomplete_txt',function(){
	$(this).autocomplete({
		source: function( request, response ) {
			$.ajax({
				url : 'item',
				dataType: "json",
				data: {
				   q: request.term
				},
				 success: function( data ) {
					 response( $.map( data, function( item ) {
					 	//console.log(item);
						return {
							id: item.item_id,
							value: item.item_name,
							data : item
						}
					}));
				}
			});
		},
		autoFocus: true,	      	
		minLength: 0,
		select: function( event, ui ) {
			//console.log(ui);
			//$scope.purchaseInvoiceModel.items.id = ui.item.id;
			//$('#itemNo_'+element_id).val(names[0]);
			//console.log($(this).attr('id'));
			// var names = ui.item.data.split("|");						
			id_arr = $(this).attr('id');
	  	index = id_arr.split("_");
	  	element_id = index[index.length-1]; //gives the index of the 
	  	//console.log(ui.item.data.id);		
	  	$('#item.purchase_item_costprice_0').val('1000');
	  	$('#item.id_'+element_id).val(ui.item.data.id);
	  	//console.log('#item.id_'+element_id);
	  	//console.log(ui.item.data);
	  	data_interlink(ui.item.data, element_id);
			//items[index].id 				= ui.item.id;
			//items[index].item_name  = ui.item.value; //this is wrong, i was trying something
			//$scope.$apply();
	  	//console.log('Index', element_id);
	  	
			// $('#itemNo_'+element_id).val(names[0]);
			// $('#itemName_'+element_id).val(names[1]);
			// $('#quantity_'+element_id).val(1);
			// $('#price_'+element_id).val(names[2]);
			// $('#total_'+element_id).val( 1*names[2] );
			// calculateTotal();
		}		      	
	});
});
